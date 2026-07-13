import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { sanitizeMarkdown } from '@/lib/sanitize';

// PATCH /api/v1/questions/:id/answers/:answerId - Updates an existing answer.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; answerId: string }> }
) {
  try {
    const { id: questionId, answerId } = await params;

    // 1. Authenticate user
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch answer
    const answer = await prisma.answer.findUnique({
      where: { id: answerId }
    });
    if (!answer || answer.deletedAt || answer.questionId !== questionId) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 });
    }

    // 3. Block edits if parent question is soft-deleted
    const question = await prisma.question.findUnique({
      where: { id: questionId }
    });
    if (!question || question.deletedAt) {
      return NextResponse.json({ error: 'Bad Request: Cannot edit answers of a deleted question' }, { status: 400 });
    }

    // 4. Validate ownership or admin
    if (answer.userId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 5. Parse and Validate Body
    const body = await req.json();
    const { content } = body;
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Bad Request: Content is required' }, { status: 400 });
    }

    const sanitizedContent = sanitizeMarkdown(content);

    // 6. Update Answer
    await prisma.answer.update({
      where: { id: answerId },
      data: { content: sanitizedContent }
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Error editing answer:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/v1/questions/:id/answers/:answerId - Soft-deletes an answer.
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; answerId: string }> }
) {
  try {
    const { id: questionId, answerId } = await params;

    // 1. Authenticate user
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch answer
    const answer = await prisma.answer.findUnique({
      where: { id: answerId }
    });
    if (!answer || answer.deletedAt || answer.questionId !== questionId) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 });
    }

    // 3. Validate ownership or admin
    if (answer.userId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 4. Soft-delete answer and update author's reputation
    await prisma.$transaction(async (tx) => {
      // Set deletedAt
      await tx.answer.update({
        where: { id: answerId },
        data: { deletedAt: new Date() }
      });

      // Get upvotes count on the deleted answer
      const upvotesCount = answer.upvote;

      // Subtract upvotes count from author's reputation index
      if (upvotesCount > 0) {
        const author = await tx.user.findUnique({ where: { id: answer.userId } });
        if (author) {
          const newReputation = Math.max(0, author.reputation - upvotesCount);
          await tx.user.update({
            where: { id: answer.userId },
            data: { reputation: newReputation }
          });
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Answer soft-deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error soft-deleting answer:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
