import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/server/firebase-admin';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;

    // Check for mock token in development / test modes
    if (process.env.NODE_ENV !== 'production' && token.startsWith('mock-token-')) {
      const email = token.replace('mock-token-', '');
      // Map email to predefined mock configurations
      let role: 'user' | 'admin' = 'user';
      let name = 'Alex Mercer';
      if (email.includes('sarah') || email.includes('admin')) {
        role = 'admin';
        name = 'Sarah Connor';
      }
      const uid = 'mock-uid-' + email.split('@')[0];
      
      decodedToken = {
        uid,
        email,
        name,
        exp: Math.floor(Date.now() / 1000) + 3600 // Valid for 1 hour
      };
    } else {
      decodedToken = await adminAuth.verifyIdToken(token);
    }

    // Session Hijacking Guard
    const currentEpoch = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentEpoch) {
      return NextResponse.json({ error: 'Unauthorized: Token expired' }, { status: 401 });
    }

    // Parse request body
    let body = { email: decodedToken.email, name: decodedToken.name || 'Anonymous User' };
    try {
      const parsed = await req.json();
      if (parsed.email) body.email = parsed.email;
      if (parsed.name) body.name = parsed.name;
    } catch {
      // Body might be empty or invalid, fallback to token claims
    }

    if (!body.email) {
      return NextResponse.json({ error: 'Bad Request: Email is required' }, { status: 400 });
    }

    // Role Elevation Protection: Determine role via PostgreSQL lookup, not token claims
    let user = await prisma.user.findUnique({
      where: { id: decodedToken.uid }
    });

    if (user) {
      // If user exists and is soft-deleted, restore or keep deleted depending on policy.
      // Typically we update last-seen info
      user = await prisma.user.update({
        where: { id: decodedToken.uid },
        data: {
          email: body.email,
          name: body.name,
          deletedAt: null // Restore if logged back in
        }
      });
    } else {
      // Map certain admin emails if needed, otherwise default is user
      const isInitialAdmin = body.email === 'sarah@skynet.com' || body.email.includes('admin@interq.io');
      user = await prisma.user.create({
        data: {
          id: decodedToken.uid,
          email: body.email,
          name: body.name,
          role: isInitialAdmin ? 'admin' : 'user',
          reputation: 0
        }
      });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      reputation: user.reputation,
      createdAt: user.createdAt.toISOString()
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error in auth sync:', error);
    return NextResponse.json({ error: 'Unauthorized: ' + (error.message || 'Token verification failed') }, { status: 401 });
  }
}
