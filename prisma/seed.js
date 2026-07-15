import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from './generated';
const prisma = process.env.DATABASE_URL.startsWith('postgres')
  ? new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } })
  : new PrismaClient({ accelerateUrl: process.env.DATABASE_URL });

const UUID_MAP = {
  c1: '11111111-1111-1111-1111-111111111111',
  c2: '22222222-2222-2222-2222-222222222222',
  c3: '33333333-3333-3333-3333-333333333333',
  c4: '44444444-4444-4444-4444-444444444444',
  q1: '55555555-5555-5555-5555-555555555555',
  q2: '66666666-6666-6666-6666-666666666666',
  q3: '77777777-7777-7777-7777-777777777777',
  q4: '88888888-8888-8888-8888-888888888888',
  a1: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  a2: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  a3: 'cccccccc-cccc-cccc-cccc-cccccccccccc'
};

const USER_MAP = {
  u1: 'mock-uid-sarah',
  u2: 'mock-uid-alex',
  u3: 'mock-uid-elena'
};

async function main() {
  console.log('Seeding database...');

  // Clear existing data in reverse order of dependencies
  await prisma.askedMatch.deleteMany({});
  await prisma.bookmark.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.moderationLog.deleteMany({});
  await prisma.answer.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Cleared existing data.');

  // 1. Seed Users
  const users = [
    {
      id: USER_MAP.u1,
      email: 'sarah@skynet.com',
      name: 'Sarah Connor',
      role: 'admin',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      bio: 'Lead Platform Architect & Security Researcher. Helping interview candidates find their path.',
      title: 'Senior Staff Engineer',
      company: 'Cyberdyne Systems',
      reputation: 2450
    },
    {
      id: USER_MAP.u2,
      email: 'alex@gentek.org',
      name: 'Alex Mercer',
      role: 'user',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      bio: 'Backend specialist interested in distributed systems and systems performance.',
      title: 'Software Engineer II',
      company: 'Google',
      reputation: 980
    },
    {
      id: USER_MAP.u3,
      email: 'elena@rostov.io',
      name: 'Elena Rostova',
      role: 'user',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      bio: 'Frontend enthusiast. Loves CSS tricks, animation, and building accessible products.',
      title: 'Senior Frontend Engineer',
      company: 'Stripe',
      reputation: 1540
    }
  ];

  for (const u of users) {
    await prisma.user.create({ data: u });
  }
  console.log('Seeded users.');

  // 2. Seed Companies
  const companies = [
    {
      id: UUID_MAP.c1,
      name: 'Google',
      slug: 'google',
      logoUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=150',
      description: 'Google’s mission is to organize the world’s information and make it universally accessible and useful.',
      website: 'https://google.com',
      industry: 'Technology / Internet',
      location: 'Mountain View, CA',
      employeeCount: '100,000+',
      rating: 4.5
    },
    {
      id: UUID_MAP.c2,
      name: 'Stripe',
      slug: 'stripe',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      description: 'Stripe is a financial infrastructure platform for the internet. Millions of companies use Stripe to accept payments.',
      website: 'https://stripe.com',
      industry: 'Financial Technology',
      location: 'San Francisco, CA',
      employeeCount: '5,000 - 10,000',
      rating: 4.6
    },
    {
      id: UUID_MAP.c3,
      name: 'Meta',
      slug: 'meta',
      logoUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=150',
      description: 'Meta builds technologies that help people connect, find communities, and grow businesses.',
      website: 'https://meta.com',
      industry: 'Social Technology',
      location: 'Menlo Park, CA',
      employeeCount: '50,000 - 100,000',
      rating: 4.2
    },
    {
      id: UUID_MAP.c4,
      name: 'Netflix',
      slug: 'netflix',
      logoUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8edd86?w=150',
      description: 'Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, and more.',
      website: 'https://netflix.com',
      industry: 'Entertainment / Media',
      location: 'Los Gatos, CA',
      employeeCount: '10,000+',
      rating: 4.4
    }
  ];

  for (const c of companies) {
    await prisma.company.create({ data: c });
  }
  console.log('Seeded companies.');

  // 3. Seed Questions
  const questions = [
    {
      id: UUID_MAP.q1,
      title: 'Design a high-throughput, low-latency distributed rate limiter',
      content: 'We need to design a system that can limit API requests across multiple regional data centers. The rate limiter needs to support millions of active users, handle rules per tier, and maintain <5ms latency overhead.',
      role: 'Staff Software Engineer',
      companyId: UUID_MAP.c1,
      experienceLevel: 'staff',
      interviewRound: 'System Design',
      askedYear: 2026,
      difficulty: 'Hard',
      tags: ['System Design', 'Redis', 'Concurrency'],
      userId: USER_MAP.u1
    },
    {
      id: UUID_MAP.q2,
      title: 'Merge K Sorted Lists containing millions of elements',
      content: 'Implement a function to merge k sorted lists of numbers. Assume the total size of all lists fits in memory, but discuss optimizations if the lists are stored across multiple disk blocks or servers.',
      role: 'Software Engineer II',
      companyId: UUID_MAP.c1,
      experienceLevel: 'mid',
      interviewRound: 'Coding Round',
      askedYear: 2026,
      difficulty: 'Medium',
      tags: ['Algorithms', 'Divide & Conquer', 'Heap'],
      userId: USER_MAP.u2
    },
    {
      id: UUID_MAP.q3,
      title: 'Implement custom middleware to handle idempotent API requests',
      content: 'Explain how to design an idempotency key database schema and middleware that prevents duplicate form submissions. How do you handle cases where a client retries while the first request is still running?',
      role: 'Senior Software Engineer',
      companyId: UUID_MAP.c2,
      experienceLevel: 'senior',
      interviewRound: 'Backend Design',
      askedYear: 2026,
      difficulty: 'Hard',
      tags: ['Backend', 'HTTP', 'API Design'],
      userId: USER_MAP.u3
    },
    {
      id: UUID_MAP.q4,
      title: 'Reverse a Linked List in place',
      content: 'Given the head of a singly linked list, reverse the list in-place and return the new head. Explain both iterative and recursive implementations with their space complexities.',
      role: 'Frontend Engineer',
      companyId: UUID_MAP.c3,
      experienceLevel: 'entry',
      interviewRound: 'Technical Interview',
      askedYear: 2026,
      difficulty: 'Easy',
      tags: ['Algorithms', 'Linked List'],
      userId: USER_MAP.u2
    }
  ];

  for (const q of questions) {
    await prisma.question.create({ data: q });
  }
  console.log('Seeded questions.');

  // 4. Seed Answers
  const answers = [
    {
      id: UUID_MAP.a1,
      questionId: UUID_MAP.q1,
      content: 'To design a low-latency distributed rate limiter, we can use **Redis cluster with Sliding Window Counter**. \n\n### 1. Algorithm selection\nWe can use Redis Sorted Sets (ZSET) where the member is a unique UUID/timestamp and the score is the epoch millisecond. For each request:\n1. Run `ZREMRANGEBYSCORE key 0 (now - window_size)` to drop old requests.\n2. Run `ZCARD key` to see the current count.\n3. If `ZCARD` is below threshold, run `ZADD key now uuid` and expire the key.\n\n### 2. Scaling & Low Latency\n- Use **Redis Sentinel/Cluster** for high availability.\n- Use **Local Memory Caching** with a token bucket for an initial layer of fast rejects (90% requests blocked before reaching Redis).',
      userId: USER_MAP.u2,
      isAccepted: true,
      upvote: 2,
      upvoteUserIds: [USER_MAP.u1, USER_MAP.u3]
    },
    {
      id: UUID_MAP.a2,
      questionId: UUID_MAP.q1,
      content: 'Another approach is to use the **Token Bucket** algorithm utilizing Redis Hash fields. \n\nInstead of saving every request, we store two fields: `last_updated_time` and `tokens_count`. When a request comes in, we calculate the newly generated tokens based on the time elapsed since `last_updated_time`, cap it at the max capacity, check if tokens > 0, decrement, and update Redis. This requires a single round-trip using Lua scripts to ensure atomicity.',
      userId: USER_MAP.u3,
      isAccepted: false,
      upvote: 0,
      upvoteUserIds: []
    },
    {
      id: UUID_MAP.a3,
      questionId: UUID_MAP.q3,
      content: 'To enforce idempotency, Stripe uses an `Idempotency-Key` header:\n\n1. **Middleware Filter**: Intercept incoming requests with the key.\n2. **Database Lookup**: Check if the key exists in a fast storage like Redis/PostgreSQL. If the key exists, return the cached response immediately.\n3. **Locking**: If the key is not in db but a request is currently processing, hold subsequent requests for up to a timeout using a distributed lock (e.g. Redlock).',
      userId: USER_MAP.u1,
      isAccepted: true,
      upvote: 1,
      upvoteUserIds: [USER_MAP.u2]
    }
  ];

  for (const a of answers) {
    await prisma.answer.create({ data: a });
  }
  console.log('Seeded answers.');

  // 5. Seed Asked Matches (Validations)
  await prisma.askedMatch.create({
    data: {
      userId: USER_MAP.u2,
      questionId: UUID_MAP.q1
    }
  });
  await prisma.askedMatch.create({
    data: {
      userId: USER_MAP.u3,
      questionId: UUID_MAP.q1
    }
  });
  console.log('Seeded validations (asked matches).');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
