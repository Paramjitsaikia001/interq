import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';


// GET /api/v1/bookmark - Gets all bookmarks for a user.
export async function GET(req: NextRequest) {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const bookmarks = await prisma.bookmark.findMany({
        where: { userId: user.id },
        include: {
          question: {
            include: {
              company: true,
              user: true,
              _count:true
            },
          },
        },
      });
      return NextResponse.json(bookmarks);
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      return NextResponse.json({ error: 'Failed to get bookmarks' }, { status: 500 });
    }
  }