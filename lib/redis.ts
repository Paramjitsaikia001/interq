import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Configure ioredis client with reconnect strategies and silent failure modes to not block the main request
export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    if (times > 3) {
      return null;
    }
    return Math.min(times * 100, 1000);
  },
});

redis.on('error', (err) => {
  console.error('Redis client error:', err);
});
