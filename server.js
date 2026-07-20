import { config as loadEnv } from 'dotenv';

loadEnv();

import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import Redis from 'ioredis';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

function initSocketFirebaseAdmin() {
  if (getApps().some((app) => app.name === '[DEFAULT]')) {
    return getAuth();
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    try {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
      return getAuth();
    } catch (error) {
      console.warn(
        'Firebase Admin credential init failed; falling back to projectId-only app.',
        error,
      );
    }
  }

  if (!projectId) {
    throw new Error(
      'Firebase Admin is not configured. Set FIREBASE_PROJECT_ID and service account credentials in .env.',
    );
  }

  initializeApp({ projectId });
  return getAuth();
}

app.prepare().then(() => {
  const adminAuth = initSocketFirebaseAdmin();
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Redis Clients for pub/sub
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  const subClient = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 3) return null;
      return Math.min(times * 100, 1000);
    },
  });

  subClient.on('error', (err) => {
    console.error('Socket server Redis error:', err);
  });

  // Socket Connection handling
  io.on('connection', (socket) => {
    console.log('Socket client connected:', socket.id);

    // Authenticate user via token to register their room
    socket.on('register', async (token) => {
      try {
        if (!token) return;

        let uid;
        const decoded = await adminAuth.verifyIdToken(token);
        uid = decoded.uid;

        if (uid) {
          socket.join(uid);
          console.log(`Socket ${socket.id} joined room (userId): ${uid}`);
          socket.emit('registered', { success: true, userId: uid });
        }
      } catch (err) {
        console.error('Socket authentication failed:', err);
        socket.emit('registered', { success: false, error: 'Authentication failed' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket client disconnected:', socket.id);
    });
  });

  // Subscribe to Redis notifications channel
  subClient.subscribe('notifications', (err) => {
    if (err) {
      console.error('Failed to subscribe to Redis notifications:', err);
    } else {
      console.log('Subscribed to Redis "notifications" channel');
    }
  });

  subClient.on('message', (channel, message) => {
    if (channel === 'notifications') {
      try {
        const notification = JSON.parse(message);
        const { userId } = notification;
        if (userId) {
          // Send notification to the user's room
          io.to(userId).emit('notification', notification);
          console.log(`Dispatched real-time notification to user: ${userId}`);
        }
      } catch (err) {
        console.error('Error parsing Redis notification message:', err);
      }
    }
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
