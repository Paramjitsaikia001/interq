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

    // 4. Toggle upvote (batch transaction — reliable with PrismaPg adapter)
    const ans = await prisma.answer.findUnique({ where: { id: answerId } });
    if (!ans) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 });
    }

    const existing = ans.upvoteUserIds.includes(user.id);
    const action: 'added' | 'removed' = existing ? 'removed' : 'added';
    const upvotesCount = existing ? Math.max(0, ans.upvote - 1) : ans.upvote + 1;
    const upvoteUserIds = existing
      ? ans.upvoteUserIds.filter((uid) => uid !== user.id)
      : [...ans.upvoteUserIds, user.id];

    const author = await prisma.user.findUnique({ where: { id: answer.userId } });
    const reputationUpdate =
      author && existing
        ? prisma.user.update({
            where: { id: answer.userId },
            data: { reputation: Math.max(0, author.reputation - 1) },
          })
        : author
          ? prisma.user.update({
              where: { id: answer.userId },
              data: { reputation: author.reputation + 1 },
            })
          : null;

    await prisma.$transaction([
      prisma.answer.update({
        where: { id: answerId },
        data: { upvote: upvotesCount, upvoteUserIds },
      }),
      ...(reputationUpdate ? [reputationUpdate] : []),
    ]);

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
