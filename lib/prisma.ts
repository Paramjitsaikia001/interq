import { PrismaClient } from '../prisma/generated/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL || 'prisma+postgres://localhost:51213/?api_key=placeholder',
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
