import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { isRateLimited } from '@/lib/rate-limit';
import { getAuthenticatedUser } from '@/lib/auth';
import { getTrigramSimilarity } from '@/lib/similarity';

// GET: Retrieves a paginated list of active questions.
export async function GET(req: NextRequest) {
  try {
    // 1. Rate Limiting Check: 60 calls per minute per IP
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    const rateLimitKey = `ratelimit:${ip}:get_questions`;
    const limited = await isRateLimited(rateLimitKey, 60, 60);
    if (limited) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }

    // 2. Parse Query Params
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const companyId = searchParams.get('companyId') || undefined;
    const difficulty = searchParams.get('difficulty') || undefined;
    const tag = searchParams.get('tag') || undefined;
    const sort = searchParams.get('sort') || 'recent';
    const search = searchParams.get('search') || undefined;

    // 3. Cache Check: Redis TTL 10 minutes (600s)
    const cacheKey = `questions:list:${page}:${limit}:${companyId || 'all'}:${difficulty || 'all'}:${tag || 'all'}:${sort}:${search || 'none'}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        try {
          return NextResponse.json(JSON.parse(cached), { status: 200 });
        } catch (parseErr) {
          console.warn('Failed to parse cached questions data, re-fetching from DB:', parseErr);
        }
      }
    } catch (err) {
      console.error('Redis read error:', err);
    }

    // 4. Build Prisma Query Filters
    const where: any = {
      deletedAt: null,
    };

    if (companyId) {
      where.companyId = companyId;
    }
    if (difficulty) {
      where.difficulty = difficulty as any;
    }
    if (tag) {
      where.tags = {
        has: tag,
      };
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Build Sorting
    let orderBy: any = {};
    if (sort === 'recent') {
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'popular') {
      // Sort by number of answers (approximate popularity)
      orderBy = [
        {
          answers: {
            _count: 'desc',
          },
        },
        { createdAt: 'desc' },
      ];
    } else if (sort === 'validated') {
      orderBy = [
        {
          askedMatches: {
            _count: 'desc',
          },
        },
        { createdAt: 'desc' },
      ];
    } else {
      orderBy = { createdAt: 'desc' };
    }

    // 5. Execute DB Query
    const [totalItems, questions] = await prisma.$transaction([
      prisma.question.count({ where }),
      prisma.question.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              name: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
            },
          },
          _count: {
            select: {
              askedMatches: true,
              answers: { where: { deletedAt: null } },
            },
          },
        },
      }),
    ]);

    // Map DB output to API Response Spec
    const data = questions.map((q) => {
      return {
        id: q.id,
        title: q.title,
        content: q.content,
        role: q.role,
        difficulty: q.difficulty,
        tags: q.tags,
        askedYear: q.askedYear,
        company: q.company,
        userName: q.user?.name,
        upvotes: q.upvote,
        askedCount: q._count.askedMatches,
        answersCount: q._count.answers,
        createdAt: q.createdAt.toISOString(),
      };
    });

    const totalPages = Math.ceil(totalItems / limit);
    const responseBody = {
      data,
      pagination: {
        page,
        limit,
        totalPages,
        totalItems,
      },
    };

    // 6. Write Cache to Redis
    try {
      await redis.set(cacheKey, JSON.stringify(responseBody), 'EX', 600);
    } catch (err) {
      console.error('Redis write error:', err);
    }

    return NextResponse.json(responseBody, { status: 200 });

  } catch (error) {
    console.error('Error in GET questions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Creates a new interview question.
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Rate Limiting Check
    // - 10 write actions per minute per User ID
    const minRateLimitKey = `ratelimit:${user.id}:write_actions`;
    const minLimited = await isRateLimited(minRateLimitKey, 10, 60);
    if (minLimited) {
      return NextResponse.json({ error: 'Too Many Requests: Rate limit exceeded' }, { status: 429 });
    }
    // - 5 questions per hour per user
    const hourRateLimitKey = `ratelimit:${user.id}:create_question`;
    const hourLimited = await isRateLimited(hourRateLimitKey, 5, 3600);
    if (hourLimited) {
      return NextResponse.json({ error: 'Too Many Requests: Question creation limit exceeded' }, { status: 429 });
    }

    // 3. Parse and Validate Request Body
    const body = await req.json();
    const {
      title,
      content,
      role,
      companyId,
      experienceLevel,
      interviewRound,
      askedYear,
      difficulty,
      tags,
    } = body;

    // Field validations
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Bad Request: title is required' }, { status: 400 });
    }
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Bad Request: content is required' }, { status: 400 });
    }
    const currentYear = new Date().getFullYear();
    if (!askedYear || typeof askedYear !== 'number') {
      return NextResponse.json({ error: 'Bad Request: askedYear is required' }, { status: 400 });
    }
    if (!difficulty) {
      return NextResponse.json({ error: 'Bad Request: difficulty is required' }, { status: 400 });
    }
    if (!experienceLevel) {
      return NextResponse.json({ error: 'Bad Request: experienceLevel is required' }, { status: 400 });
    }
    if (!role || typeof role !== 'string' || role.trim().length === 0) {
      return NextResponse.json({ error: 'Bad Request: role is required' }, { status: 400 });
    }
    if (!companyId || typeof companyId !== 'string' || companyId.trim().length === 0) {
      return NextResponse.json({ error: 'Bad Request: target company is required' }, { status: 400 });
    }
    if (!interviewRound) {
      return NextResponse.json({ error: 'Bad Request: interviewRound is required' }, { status: 400 });
    }

    // Resolve target company (find or create)
    let company;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(companyId);
    if (isUuid) {
      company = await prisma.company.findUnique({
        where: { id: companyId },
      });
    } else {
      // Find case-insensitive match by name
      company = await prisma.company.findFirst({
        where: { name: { equals: companyId.trim(), mode: 'insensitive' } },
      });
      // If doesn't exist, create it dynamically
      if (!company) {
        const slug = companyId.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        company = await prisma.company.create({
          data: {
            name: companyId.trim(),
            slug: slug || `company-${Date.now()}`,
            description: `${companyId.trim()} description`,
            website: `https://www.google.com/search?q=${encodeURIComponent(companyId.trim())}`,
            industry: 'Technology',
            location: 'Remote',
            employeeCount: '1-10',
            rating: 4.0
          }
        });
      }
    }

    if (!company) {
      return NextResponse.json({ error: 'Bad Request: Company does not exist and could not be created' }, { status: 400 });
    }

    const resolvedCompanyId = company.id;

    // 4. Duplicate Check
    const { searchParams } = new URL(req.url);
    const bypass = searchParams.get('bypass') === 'true';

    if (!bypass) {
      // Find all active questions at the same company
      const activeQuestions = await prisma.question.findMany({
        where: {
          companyId: resolvedCompanyId,
          deletedAt: null,
        },
        select: {
          id: true,
          title: true,
        },
      });

      const duplicates = activeQuestions
        .map((q) => ({
          id: q.id,
          title: q.title,
          similarity: getTrigramSimilarity(title, q.title),
        }))
        .filter((q) => q.similarity >= 0.65);

      if (duplicates.length > 0) {
        return NextResponse.json(
          {
            error: 'Conflict: Trigram similarity warning',
            duplicates,
          },
          { status: 409 }
        );
      }
    }

    // 5. Create Question
    const question = await prisma.question.create({
      data: {
        title,
        content,
        role,
        companyId: resolvedCompanyId,
        experienceLevel,
        interviewRound,
        askedYear,
        difficulty,
        tags: Array.isArray(tags) ? tags : [],
        userId: user.id,
      },
    });

    // 6. Invalidate List Cache
    try {
      const keys = await redis.keys('questions:list:*');
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (err) {
      console.error('Redis invalidation error:', err);
    }

    return NextResponse.json(
      {
        id: question.id,
        title: question.title,
        createdAt: question.createdAt.toISOString(),
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error in POST question:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
