import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { redis } from '@/lib/redis';

// GET /api/v1/admin/questions - Retrieves all questions (optionally including soft-deleted ones)
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    const where: any = {};
    if (!includeDeleted) {
      where.deletedAt = null;
    }

    const dbQuestions = await prisma.question.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          }
        },
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          }
        },
        _count: {
          select: {
            answers: true,
            askedMatches: true,
          }
        }
      }
    });

    return NextResponse.json(dbQuestions, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin questions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH /api/v1/admin/questions - Approve, soft-delete, or restore a question
export async function PATCH(req: NextRequest) {
  try {
    const adminUser = await getAuthenticatedUser(req);
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { questionId, action } = body;

    if (!questionId || !action) {
      return NextResponse.json({ error: 'Bad Request: questionId and action are required' }, { status: 400 });
    }

    const targetQuestion = await prisma.question.findUnique({
      where: { id: questionId }
    });

    if (!targetQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    let updatedQuestion;

    if (action === 'approve') {
      // Just record approval log
      updatedQuestion = targetQuestion;
    } else if (action === 'soft_delete') {
      updatedQuestion = await prisma.question.update({
        where: { id: questionId },
        data: { deletedAt: new Date() }
      });
    } else if (action === 'restore') {
      updatedQuestion = await prisma.question.update({
        where: { id: questionId },
        data: { deletedAt: null }
      });
    } else {
      return NextResponse.json({ error: 'Bad Request: Invalid action' }, { status: 400 });
    }

    // Log moderation action
    await prisma.moderationLog.create({
      data: {
        adminId: adminUser.id,
        action: action === 'soft_delete' ? 'delete_question' : action === 'restore' ? 'restore_question' : 'approve_question',
        details: {
          targetQuestionId: questionId,
          title: targetQuestion.title,
          action
        }
      }
    });

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

    return NextResponse.json({ success: true, question: updatedQuestion }, { status: 200 });
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
