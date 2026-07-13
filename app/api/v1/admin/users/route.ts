import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

// GET /api/v1/admin/users - Retrieves all users
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const roleFilter = searchParams.get('role');
    const includeBanned = searchParams.get('includeBanned') === 'true';

    const where: any = {};
    if (roleFilter && ['user', 'admin'].includes(roleFilter)) {
      where.role = roleFilter;
    }
    if (!includeBanned) {
      where.deletedAt = null;
    }

    const dbUsers = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(dbUsers, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH /api/v1/admin/users - Update user role or ban/unban status
export async function PATCH(req: NextRequest) {
  try {
    const adminUser = await getAuthenticatedUser(req);
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { userId, action } = body;

    if (!userId || !action) {
      return NextResponse.json({ error: 'Bad Request: userId and action are required' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (targetUser.id === adminUser.id && action === 'ban') {
      return NextResponse.json({ error: 'Bad Request: You cannot ban yourself' }, { status: 400 });
    }

    let updatedUser;

    if (action === 'toggle_role') {
      const nextRole = targetUser.role === 'admin' ? 'user' : 'admin';
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role: nextRole }
      });
    } else if (action === 'ban') {
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { deletedAt: new Date() }
      });
    } else if (action === 'unban') {
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { deletedAt: null }
      });
    } else {
      return NextResponse.json({ error: 'Bad Request: Invalid action' }, { status: 400 });
    }

    // Log moderation action
    await prisma.moderationLog.create({
      data: {
        adminId: adminUser.id,
        action: action,
        details: {
          targetUserId: userId,
          targetEmail: targetUser.email,
          previousRole: targetUser.role,
          newRole: updatedUser.role,
          banned: updatedUser.deletedAt !== null
        }
      }
    });

    return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
