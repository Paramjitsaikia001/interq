import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET() {
  const status: Record<string, any> = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      redis: 'unknown',
    },
  };

  let hasError = false;

  // Check Database
  try {
    await prisma.$queryRaw`SELECT 1`;
    status.services.database = 'healthy';
  } catch (error: any) {
    status.services.database = 'unhealthy';
    status.services.databaseError = error.message || String(error);
    hasError = true;
  }

  // Check Redis
  try {
    const pingStatus = await redis.ping();
    if (pingStatus === 'PONG') {
      status.services.redis = 'healthy';
    } else {
      status.services.redis = 'unhealthy';
      hasError = true;
    }
  } catch (error: any) {
    status.services.redis = 'unhealthy';
    status.services.redisError = error.message || String(error);
    hasError = true;
  }

  if (hasError) {
    status.status = 'unhealthy';
    return NextResponse.json(status, { status: 503 });
  }

  return NextResponse.json(status, { status: 200 });
}
