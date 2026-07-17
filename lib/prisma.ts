import { PrismaClient } from '../prisma/generated/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const accelerateUrl = process.env.DATABASE_URL;
if (!accelerateUrl) {
  throw new Error('DATABASE_URL environment variable is not set. This is required for Prisma Accelerate.');
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    accelerateUrl,
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
