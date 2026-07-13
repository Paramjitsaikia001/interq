import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { redis } from '@/lib/redis';
import { createAndSendNotification } from '@/lib/socket';

// POST /api/v1/questions/:id/validate - Toggles "I was asked this" validation counter.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: questionId } = await params;
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Toggle Validation Match
    const existing = await prisma.askedMatch.findUnique({
      where: {
        userId_questionId: {
          userId: user.id,
          questionId
        }
      }
    });

    let action: 'added' | 'removed' = 'added';
    if (existing) {
      await prisma.askedMatch.delete({
        where: {
          userId_questionId: {
            userId: user.id,
            questionId
          }
        }
      });
      action = 'removed';
    } else {
      await prisma.askedMatch.create({
        data: {
          userId: user.id,
          questionId
        }
      });
    }

    // Send real-time notification if validation was added
    if (action === 'added' && question.userId !== user.id) {
      await createAndSendNotification({
        userId: question.userId,
        type: 'validation',
        title: 'Question Validated',
        message: `${user.name} validated your question: "${question.title}"`,
        link: `/questions/${questionId}`,
      });
    }

    // Get count
    const askedCount = await prisma.askedMatch.count({
      where: { questionId }
    });

    // Invalidate caches
    try {
      await redis.del(`question:detail:${questionId}`);
      const keys = await redis.keys('questions:list:*');
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (err) {
      console.error('Redis cache invalidation error:', err);
    }

    return NextResponse.json({ action, askedCount }, { status: 200 });

  } catch (error) {
    console.error('Error toggling validation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
