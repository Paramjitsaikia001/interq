import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

// POST /api/v1/bookmark/[questionId] - Toggle bookmark for a question.
export async function POST(req: NextRequest, { params }: { params: Promise<{ questionId: string }> }) {
  try {
    const { questionId } = await params;
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    const bookmark = await prisma.bookmark.findUnique({
      where: { userId_questionId: { userId: user.id, questionId: questionId } },
    });
    if (bookmark) {
      await prisma.bookmark.delete({ where: { userId_questionId: { userId: user.id, questionId: questionId } } });
      return NextResponse.json({
        isBookmarked: false,
        message: 'Bookmark removed successfully',
      });
    } else {
      await prisma.bookmark.create({ data: { userId: user.id, questionId: questionId } });
      return NextResponse.json({
        isBookmarked: true,
        message: 'Bookmark added successfully',
      });
    }
  } catch (error) {
    console.error('Error bookmarking question:', error);
    return NextResponse.json({ error: 'Failed to bookmark question' }, { status: 500 });
  }
}

