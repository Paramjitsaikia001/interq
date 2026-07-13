import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const UpdateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).optional(),
  bio: z.string().max(500).optional(),
  company: z.string().max(100).optional(),
  title: z.string().max(100).optional(),
  avatarUrl: z.string().url('Invalid Avatar URL').optional().or(z.literal('')),
});

export async function PUT(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parseResult = UpdateProfileSchema.safeParse(body);
    
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    const updatedUser = await prisma.user.update({
      where: { id: authUser.id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.company !== undefined && { company: data.company }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        bio: true,
        company: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/v1/profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
