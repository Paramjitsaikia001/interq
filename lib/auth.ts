import { NextRequest } from 'next/server';
import { adminAuth } from '@/server/firebase-admin';
import { prisma } from '@/lib/prisma';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

/**
 * Validates the Authorization Bearer token, checks expiration, and retrieves
 * the user record and role from PostgreSQL database.
 */
export async function getAuthenticatedUser(req: NextRequest): Promise<AuthenticatedUser | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split('Bearer ')[1];
  let decodedToken;

  try {
    decodedToken = await adminAuth.verifyIdToken(token);

    // Session Hijacking Guard
    const currentEpoch = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentEpoch) {
      return null;
    }

    // Role Elevation Protection: Determine role via PostgreSQL lookup, not token claims
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.uid }
    });

    if (!user || user.deletedAt) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'user' | 'admin'
    };
  } catch (error) {
    console.error('Error verifying authorization token:', error);
    return null;
  }
}
