import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { sanitizeMarkdown } from '@/lib/sanitize';

// GET /api/v1/questions/:questionId/answers - Retrieves answers for a question.
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: questionId } = await params;

    // 1. Authentication Required: Guests are blocked
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Guests are blocked from viewing solutions' }, { status: 401 });
    }

    // 2. Fetch Answers
    const answers = await prisma.answer.findMany({
      where: {
        questionId,
        deletedAt: null
      },
      include: {
        user: {
          select: {
            name: true,
            avatarUrl: true
          }
        }
      },
      orderBy: [
        { isAccepted: 'desc' },
        { upvote: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    const response = answers.map((ans) => ({
      id: ans.id,
      content: sanitizeMarkdown(ans.content),
      upvotes: ans.upvote,
      isAccepted: ans.isAccepted,
      author: {
        name: ans.user.name,
        avatarUrl: ans.user.avatarUrl
      },
      createdAt: ans.createdAt.toISOString()
    }));

    return NextResponse.json({ answers: response }, { status: 200 });

  } catch (error) {
    console.error('Error getting answers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/v1/questions/:questionId/answers - Submits an answer solution.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: questionId } = await params;

    // 1. Authenticate user
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Check if question exists and is not soft-deleted
    const question = await prisma.question.findUnique({
      where: { id: questionId }
    });
    if (!question || question.deletedAt) {
      return NextResponse.json({ error: 'Bad Request: Question not found or blocked' }, { status: 404 });
    }

    // 3. Parse Request Body
    const body = await req.json();
    const { content } = body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Bad Request: Content is required' }, { status: 400 });
    }

    // 4. Duplicate Answer Guard: One active answer per user per question
    const existing = await prisma.answer.findFirst({
      where: {
        questionId,
        userId: user.id,
        deletedAt: null
      }
    });
    if (existing) {
      return NextResponse.json({ error: 'Conflict: You have already submitted an answer to this question. Please edit your existing answer.' }, { status: 409 });
    }

    // 5. Sanitize Content
    const sanitizedContent = sanitizeMarkdown(content);

    // 6. Create Answer
    const answer = await prisma.answer.create({
      data: {
        content: sanitizedContent,
        questionId,
        userId: user.id
      }
    });

    return NextResponse.json({ id: answer.id, success: true }, { status: 201 });

  } catch (error) {
    console.error('Error submitting answer:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
