import { redis } from './redis';

export async function isRateLimited(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  try {
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, windowSeconds);
    }
    return current > limit;
  } catch (error) {
    // If Redis is down, log error and allow request as fallback
    console.error(`Rate limiting error for key ${key}:`, error);
    return false;
  }
}
