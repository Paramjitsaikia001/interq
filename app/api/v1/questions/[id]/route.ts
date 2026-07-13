import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { getAuthenticatedUser } from '@/lib/auth';

// GET: Retrieves detailed metadata for a single question.
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // 1. Check Merge Redirection
    const mergeLogs = await prisma.moderationLog.findMany({
      where: { action: 'merge' }
    });
    const mergeLog = mergeLogs.find(l => {
      const d = l.details as any;
      return d && d.from === id;
    });

    if (mergeLog) {
      const targetId = (mergeLog.details as any).to;
      return NextResponse.redirect(new URL(`/questions/${targetId}`, req.nextUrl.origin), 308);
    }

    // 2. Try Cache First (caches core/public detail)
    const cacheKey = `question:detail:${id}`;
    let coreDetail: any = null;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        coreDetail = JSON.parse(cached);
      }
    } catch (err) {
      console.error('Redis cache read error:', err);
    }

    if (!coreDetail) {
      const question = await prisma.question.findUnique({
        where: { id },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logoUrl: true
            }
          },
          _count: {
            select: {
              askedMatches: true
            }
          }
        }
      });

      if (!question) {
        return NextResponse.json({ error: 'Question not found' }, { status: 404 });
      }

      coreDetail = {
        id: question.id,
        title: question.title,
        content: question.content,
        role: question.role,
        difficulty: question.difficulty,
        tags: question.tags,
        askedYear: question.askedYear,
        company: question.company,
        upvotes: question.upvote,
        askedCount: question._count.askedMatches,
        createdAt: question.createdAt.toISOString(),
        deletedAt: question.deletedAt ? question.deletedAt.toISOString() : null,
        userId: question.userId,
        upvoteUserIds: question.upvoteUserIds
      };

      try {
        await redis.set(cacheKey, JSON.stringify(coreDetail), 'EX', 3600);
      } catch (err) {
        console.error('Redis cache write error:', err);
      }
    }

    // 3. Hydrate User-Specific Flags Dynamically (Not Cached)
    let isBookmarked = false;
    let isValidated = false;
    let isVoted = false;

    const user = await getAuthenticatedUser(req);
    if (user) {
      const [bookmark, askedMatch] = await Promise.all([
        prisma.bookmark.findUnique({
          where: {
            userId_questionId: {
              userId: user.id,
              questionId: id
            }
          }
        }),
        prisma.askedMatch.findUnique({
          where: {
            userId_questionId: {
              userId: user.id,
              questionId: id
            }
          }
        })
      ]);
      isBookmarked = !!bookmark;
      isValidated = !!askedMatch;
      isVoted = coreDetail.upvoteUserIds?.includes(user.id) || false;
    }

    return NextResponse.json({
      id: coreDetail.id,
      title: coreDetail.title,
      content: coreDetail.content,
      role: coreDetail.role,
      difficulty: coreDetail.difficulty,
      tags: coreDetail.tags,
      askedYear: coreDetail.askedYear,
      company: coreDetail.company,
      upvotes: coreDetail.upvotes,
      askedCount: coreDetail.askedCount,
      isBookmarked,
      isValidated,
      isVoted,
      createdAt: coreDetail.createdAt,
      deletedAt: coreDetail.deletedAt
    }, { status: 200 });

  } catch (error) {
    console.error('Error getting question detail:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH: Updates an existing question.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const question = await prisma.question.findUnique({
      where: { id }
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    if (question.userId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { title, content, role, difficulty, experienceLevel, askedYear, tags } = body;

    const data: any = {};
    if (title !== undefined) {
      if (typeof title !== 'string' || title.length < 10 || title.length > 255) {
        return NextResponse.json({ error: 'Bad Request: title must be between 10 and 255 characters' }, { status: 400 });
      }
      data.title = title;
    }
    if (content !== undefined) {
      if (typeof content !== 'string' || content.length < 50) {
        return NextResponse.json({ error: 'Bad Request: content must be at least 50 characters' }, { status: 400 });
      }
      data.content = content;
    }
    if (role !== undefined) {
      data.role = role;
    }
    if (difficulty !== undefined) {
      if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
        return NextResponse.json({ error: 'Bad Request: difficulty must be Easy, Medium, or Hard' }, { status: 400 });
      }
      data.difficulty = difficulty;
    }
    if (experienceLevel !== undefined) {
      if (!['entry', 'mid', 'senior', 'staff'].includes(experienceLevel)) {
        return NextResponse.json({ error: 'Bad Request: experienceLevel must be entry, mid, senior, or staff' }, { status: 400 });
      }
      data.experienceLevel = experienceLevel;
    }
    if (askedYear !== undefined) {
      const currentYear = new Date().getFullYear();
      if (typeof askedYear !== 'number' || askedYear < 2000 || askedYear > currentYear + 1) {
        return NextResponse.json({ error: 'Bad Request: invalid askedYear' }, { status: 400 });
      }
      data.askedYear = askedYear;
    }
    if (tags !== undefined) {
      data.tags = Array.isArray(tags) ? tags : [];
    }

    await prisma.question.update({
      where: { id },
      data
    });

    // Invalidate Cache
    try {
      await redis.del(`question:detail:${id}`);
      const keys = await redis.keys('questions:list:*');
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (err) {
      console.error('Redis cache invalidation error:', err);
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Soft-deletes a question.
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const question = await prisma.question.findUnique({
      where: { id }
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    if (question.userId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.question.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    // Invalidate Cache
    try {
      await redis.del(`question:detail:${id}`);
      const keys = await redis.keys('questions:list:*');
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (err) {
      console.error('Redis cache invalidation error:', err);
    }

    return NextResponse.json({
      success: true,
      message: 'Question soft-deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error soft-deleting question:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
