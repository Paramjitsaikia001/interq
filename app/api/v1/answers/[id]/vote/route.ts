import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { createAndSendNotification } from '@/lib/socket';

// POST /api/v1/answers/:id/vote - Toggles an upvote on an answer.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: answerId } = await params;

    // 1. Authenticate user
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch answer with question
    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
      include: {
        user: true,
        question: true
      }
    });

    if (!answer || answer.deletedAt) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 });
    }

    // 3. Self-Voting Prohibition
    if (answer.userId === user.id) {
      return NextResponse.json({ error: 'Forbidden: You cannot upvote your own answer' }, { status: 403 });
    }

    // 4. Toggle Upvote in a transaction
    let action: 'added' | 'removed' = 'added';
    let upvotesCount = 0;

    await prisma.$transaction(async (tx) => {
      const ans = await tx.answer.findUnique({
        where: { id: answerId }
      });
      if (!ans) throw new Error('Answer not found');

      const existing = ans.upvoteUserIds.includes(user.id);

      if (existing) {
        // Remove Vote
        upvotesCount = Math.max(0, ans.upvote - 1);
        await tx.answer.update({
          where: { id: answerId },
          data: {
            upvote: upvotesCount,
            upvoteUserIds: ans.upvoteUserIds.filter(uid => uid !== user.id)
          }
        });
        action = 'removed';

        // Decrement author reputation (minimum 0)
        const author = await tx.user.findUnique({ where: { id: answer.userId } });
        if (author) {
          const newRep = Math.max(0, author.reputation - 1);
          await tx.user.update({
            where: { id: answer.userId },
            data: { reputation: newRep }
          });
        }
      } else {
        // Add Vote
        upvotesCount = ans.upvote + 1;
        await tx.answer.update({
          where: { id: answerId },
          data: {
            upvote: upvotesCount,
            upvoteUserIds: [...ans.upvoteUserIds, user.id]
          }
        });
        action = 'added';

        // Increment author reputation
        const author = await tx.user.findUnique({ where: { id: answer.userId } });
        if (author) {
          await tx.user.update({
            where: { id: answer.userId },
            data: { reputation: author.reputation + 1 }
          });
        }
      }
    });

    // Send real-time notification if upvote was added
    if (action === 'added' && answer.userId !== user.id) {
      await createAndSendNotification({
        userId: answer.userId,
        type: 'upvote',
        title: 'Answer Upvoted',
        message: `${user.name} upvoted your answer to: "${answer.question.title}"`,
        link: `/questions/${answer.questionId}`,
      });
    }

    return NextResponse.json({ action, upvotesCount }, { status: 200 });

  } catch (error) {
    console.error('Error toggling answer vote:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
