export interface User {
  id: string;
  name: string;
  email: string;
  role: 'guest' | 'user' | 'admin';
  avatarUrl?: string;
  bio?: string;
  title?: string;
  company?: string;
  joinedDate: string;
  reputation: number;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  website: string;
  industry: string;
  location: string;
  employeeCount: string;
  interviewDifficulty: 'Easy' | 'Medium' | 'Hard';
  questionCount: number;
  rating: number; // out of 5
}

export interface Question {
  id: string;
  title: string;
  content: string;
  role: string; // e.g., Software Engineer (L5)
  companyId: string;
  companyName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  askedCount: number; // "I was asked this" count
  upvotes: number;
  answersCount: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
  isSaved?: boolean;
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userTitle?: string;
  upvotes: number;
  isAccepted: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'upvote' | 'answer' | 'validation' | 'moderation';
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
}

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Sarah Connor',
    email: 'sarah@skynet.com',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    bio: 'Lead Platform Architect & Security Researcher. Helping interview candidates find their path.',
    title: 'Senior Staff Engineer',
    company: 'Cyberdyne Systems',
    joinedDate: 'Jan 2025',
    reputation: 2450
  },
  {
    id: 'u2',
    name: 'Alex Mercer',
    email: 'alex@gentek.org',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    bio: 'Backend specialist interested in distributed systems and systems performance.',
    title: 'Software Engineer II',
    company: 'Google',
    joinedDate: 'Mar 2025',
    reputation: 980
  },
  {
    id: 'u3',
    name: 'Elena Rostova',
    email: 'elena@rostov.io',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    bio: 'Frontend enthusiast. Loves CSS tricks, animation, and building accessible products.',
    title: 'Senior Frontend Engineer',
    company: 'Stripe',
    joinedDate: 'May 2025',
    reputation: 1540
  }
];

export const mockCompanies: Company[] = [
  {
    id: 'c1',
    name: 'Google',
    slug: 'google',
    logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=150',
    description: 'Google’s mission is to organize the world’s information and make it universally accessible and useful.',
    website: 'https://google.com',
    industry: 'Technology / Internet',
    location: 'Mountain View, CA',
    employeeCount: '100,000+',
    interviewDifficulty: 'Hard',
    questionCount: 42,
    rating: 4.5
  },
  {
    id: 'c2',
    name: 'Stripe',
    slug: 'stripe',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
    description: 'Stripe is a financial infrastructure platform for the internet. Millions of companies use Stripe to accept payments.',
    website: 'https://stripe.com',
    industry: 'Financial Technology',
    location: 'San Francisco, CA',
    employeeCount: '5,000 - 10,000',
    interviewDifficulty: 'Hard',
    questionCount: 18,
    rating: 4.6
  },
  {
    id: 'c3',
    name: 'Meta',
    slug: 'meta',
    logo: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=150',
    description: 'Meta builds technologies that help people connect, find communities, and grow businesses.',
    website: 'https://meta.com',
    industry: 'Social Technology',
    location: 'Menlo Park, CA',
    employeeCount: '50,000 - 100,000',
    interviewDifficulty: 'Hard',
    questionCount: 31,
    rating: 4.2
  },
  {
    id: 'c4',
    name: 'Netflix',
    slug: 'netflix',
    logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8edd86?w=150',
    description: 'Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, and more.',
    website: 'https://netflix.com',
    industry: 'Entertainment / Media',
    location: 'Los Gatos, CA',
    employeeCount: '10,000+',
    interviewDifficulty: 'Medium',
    questionCount: 12,
    rating: 4.4
  }
];

export const mockQuestions: Question[] = [
  {
    id: 'q1',
    title: 'Design a high-throughput, low-latency distributed rate limiter',
    content: 'We need to design a system that can limit API requests across multiple regional data centers. The rate limiter needs to support millions of active users, handle rules per tier, and maintain <5ms latency overhead.',
    role: 'Staff Software Engineer',
    companyId: 'c1',
    companyName: 'Google',
    difficulty: 'Hard',
    tags: ['System Design', 'Redis', 'Concurrency'],
    askedCount: 154,
    upvotes: 42,
    answersCount: 3,
    userId: 'u1',
    userName: 'Sarah Connor',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    createdAt: '2026-06-15T10:30:00Z',
    isSaved: true
  },
  {
    id: 'q2',
    title: 'Merge K Sorted Lists containing millions of elements',
    content: 'Implement a function to merge `k` sorted lists of numbers. Assume the total size of all lists fits in memory, but discuss optimizations if the lists are stored across multiple disk blocks or servers.',
    role: 'Software Engineer II',
    companyId: 'c1',
    companyName: 'Google',
    difficulty: 'Medium',
    tags: ['Algorithms', 'Divide & Conquer', 'Heap'],
    askedCount: 89,
    upvotes: 21,
    answersCount: 1,
    userId: 'u2',
    userName: 'Alex Mercer',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    createdAt: '2026-06-20T14:45:00Z',
    isSaved: false
  },
  {
    id: 'q3',
    title: 'Implement custom middleware to handle idempotent API requests',
    content: 'Explain how to design an idempotency key database schema and middleware that prevents duplicate form submissions. How do you handle cases where a client retries while the first request is still running?',
    role: 'Senior Software Engineer',
    companyId: 'c2',
    companyName: 'Stripe',
    difficulty: 'Hard',
    tags: ['Backend', 'HTTP', 'API Design'],
    askedCount: 64,
    upvotes: 38,
    answersCount: 2,
    userId: 'u3',
    userName: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    createdAt: '2026-06-25T08:15:00Z',
    isSaved: true
  },
  {
    id: 'q4',
    title: 'Reverse a Linked List in place',
    content: 'Given the head of a singly linked list, reverse the list in-place and return the new head. Explain both iterative and recursive implementations with their space complexities.',
    role: 'Frontend Engineer',
    companyId: 'c3',
    companyName: 'Meta',
    difficulty: 'Easy',
    tags: ['Algorithms', 'Linked List'],
    askedCount: 210,
    upvotes: 12,
    answersCount: 0,
    userId: 'u2',
    userName: 'Alex Mercer',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    createdAt: '2026-07-01T16:20:00Z',
    isSaved: false
  }
];

export const mockAnswers: Answer[] = [
  {
    id: 'a1',
    questionId: 'q1',
    content: 'To design a low-latency distributed rate limiter, we can use **Redis cluster with Sliding Window Counter**. \n\n### 1. Algorithm selection\nWe can use Redis Sorted Sets (ZSET) where the member is a unique UUID/timestamp and the score is the epoch millisecond. For each request:\n1. Run `ZREMRANGEBYSCORE key 0 (now - window_size)` to drop old requests.\n2. Run `ZCARD key` to see the current count.\n3. If `ZCARD` is below threshold, run `ZADD key now uuid` and expire the key.\n\n### 2. Scaling & Low Latency\n- Use **Redis Sentinel/Cluster** for high availability.\n- Use **Local Memory Caching** with a token bucket for an initial layer of fast rejects (90% requests blocked before reaching Redis).',
    userId: 'u2',
    userName: 'Alex Mercer',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    userTitle: 'Software Engineer II at Google',
    upvotes: 24,
    isAccepted: true,
    createdAt: '2026-06-16T11:00:00Z'
  },
  {
    id: 'a2',
    questionId: 'q1',
    content: 'Another approach is to use the **Token Bucket** algorithm utilizing Redis Hash fields. \n\nInstead of saving every request, we store two fields: `last_updated_time` and `tokens_count`. When a request comes in, we calculate the newly generated tokens based on the time elapsed since `last_updated_time`, cap it at the max capacity, check if tokens > 0, decrement, and update Redis. This requires a single round-trip using Lua scripts to ensure atomicity.',
    userId: 'u3',
    userName: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    userTitle: 'Senior Frontend Engineer at Stripe',
    upvotes: 18,
    isAccepted: false,
    createdAt: '2026-06-17T15:20:00Z'
  },
  {
    id: 'a3',
    questionId: 'q3',
    content: 'To enforce idempotency, Stripe uses an `Idempotency-Key` header:\n\n1. **Middleware Filter**: Intercept incoming requests with the key.\n2. **Database Lookup**: Check if the key exists in a fast storage like Redis/PostgreSQL. If the key exists, return the cached response immediately.\n3. **Locking**: If the key is not in db but a request is currently processing, hold subsequent requests for up to a timeout using a distributed lock (e.g. Redlock).',
    userId: 'u1',
    userName: 'Sarah Connor',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    userTitle: 'Senior Staff Engineer at Cyberdyne Systems',
    upvotes: 45,
    isAccepted: true,
    createdAt: '2026-06-26T09:30:00Z'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'answer',
    title: 'New Answer Provided',
    message: 'Alex Mercer answered your question: "Design a high-throughput, low-latency distributed rate limiter"',
    link: '/questions/q1',
    read: false,
    createdAt: '2026-07-10T12:00:00Z'
  },
  {
    id: 'n2',
    type: 'upvote',
    title: 'Upvote Received',
    message: 'Your answer to "Implement custom middleware to handle idempotent API requests" received 10 upvotes.',
    link: '/questions/q3',
    read: false,
    createdAt: '2026-07-09T18:30:00Z'
  },
  {
    id: 'n3',
    type: 'validation',
    title: 'I Was Asked This',
    message: '5 users validated that they were asked the question: "Reverse a Linked List in place"',
    link: '/questions/q4',
    read: true,
    createdAt: '2026-07-08T10:15:00Z'
  }
];
