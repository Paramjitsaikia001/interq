import { PrismaClient } from '../prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
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

  const pool = globalForPrisma.pgPool ?? new Pool({ connectionString: databaseUrl });
  if (!globalForPrisma.pgPool) {
    globalForPrisma.pgPool = pool;
  }

  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: ['error', 'warn'],
  });
}

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }

  globalForPrisma.prisma = createPrismaClient(databaseUrl);
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, client);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
