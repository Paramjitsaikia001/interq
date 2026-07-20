import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { redis } from '@/lib/redis';
import { createAndSendNotification } from '@/lib/socket';

// POST /api/v1/questions/:id/vote - Toggles a helpful upvote on a question.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: questionId } = await params;

    // 1. Authenticate user
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch question
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        user: true
      }
    });

    if (!question || question.deletedAt) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // 3. Self-Voting Prohibition
    if (question.userId === user.id) {
      return NextResponse.json({ error: 'Forbidden: You cannot upvote your own question' }, { status: 403 });
    }

    // 4. Toggle upvote (batch transaction — reliable with PrismaPg adapter)
    const q = await prisma.question.findUnique({ where: { id: questionId } });
    if (!q) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const existing = q.upvoteUserIds.includes(user.id);
    const action: 'added' | 'removed' = existing ? 'removed' : 'added';
    const upvotesCount = existing ? Math.max(0, q.upvote - 1) : q.upvote + 1;
    const upvoteUserIds = existing
      ? q.upvoteUserIds.filter((uid) => uid !== user.id)
      : [...q.upvoteUserIds, user.id];

    const author = await prisma.user.findUnique({ where: { id: question.userId } });
    const reputationUpdate =
      author && existing
        ? prisma.user.update({
            where: { id: question.userId },
            data: { reputation: Math.max(0, author.reputation - 1) },
          })
        : author
          ? prisma.user.update({
              where: { id: question.userId },
              data: { reputation: author.reputation + 1 },
            })
          : null;

    await prisma.$transaction([
      prisma.question.update({
        where: { id: questionId },
        data: { upvote: upvotesCount, upvoteUserIds },
      }),
      ...(reputationUpdate ? [reputationUpdate] : []),
    ]);

    // Send real-time notification if a vote was added
    if (action === 'added') {
      await createAndSendNotification({
        userId: question.userId,
        type: 'upvote',
        title: 'Question Upvoted',
        message: `${user.name} upvoted your question: "${question.title}"`,
        link: `/questions/${questionId}`,
      });
    }

    // Invalidate Redis caches
    try {
      await redis.del(`question:detail:${questionId}`);
      const keys = await redis.keys('questions:list:*');
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (err) {
      console.error('Redis cache invalidation error:', err);
    }

    return NextResponse.json({ action, upvotesCount }, { status: 200 });

  } catch (error) {
    console.error('Error toggling question vote:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
