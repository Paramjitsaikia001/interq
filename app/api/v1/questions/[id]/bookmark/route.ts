import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

// POST /api/v1/questions/:id/bookmark - Toggles saving a question.
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

    // Toggle Bookmark
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_questionId: {
          userId: user.id,
          questionId
        }
      }
    });

    let isBookmarked = false;
    if (existing) {
      await prisma.bookmark.delete({
        where: {
          userId_questionId: {
            userId: user.id,
            questionId
          }
        }
      });
    } else {
      await prisma.bookmark.create({
        data: {
          userId: user.id,
          questionId
        }
      });
      isBookmarked = true;
    }

    return NextResponse.json({ isBookmarked }, { status: 200 });

  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
