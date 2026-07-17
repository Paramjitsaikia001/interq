import { PrismaClient } from '../prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(databaseUrl: string) {
  const isAccelerate =
    databaseUrl.startsWith('prisma://') || databaseUrl.startsWith('prisma+postgres://');

  if (isAccelerate) {
    return new PrismaClient({
      accelerateUrl: databaseUrl,
      log: ['error', 'warn'],
    });
  }

  const adapter = new PrismaPg({ connectionString: databaseUrl });
  return new PrismaClient({
    adapter,
    log: ['error', 'warn'],
  });
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set.');
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient(databaseUrl);

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
