import { getApps, initializeApp, cert, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const FIREBASE_ADMIN_APP_NAME = 'interq-firebase-admin';

function resolveProjectId(): string | undefined {
  return (
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
}

function initFirebaseAdmin(): App {
  const existing = getApps().find((app) => app.name === FIREBASE_ADMIN_APP_NAME);
  if (existing) {
    return existing;
  }

  const projectId = resolveProjectId();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    try {
      return initializeApp(
        {
          credential: cert({
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, '\n'),
          }),
        },
        FIREBASE_ADMIN_APP_NAME,
      );
    } catch (error) {
      console.warn(
        'Firebase Admin credential init failed; falling back to projectId-only app.',
        error,
      );
    }
  }

  if (!projectId) {
    throw new Error(
      'Firebase Admin is not configured. Set FIREBASE_PROJECT_ID (or NEXT_PUBLIC_FIREBASE_PROJECT_ID) and service account credentials in .env.',
    );
  }

  return initializeApp({ projectId }, FIREBASE_ADMIN_APP_NAME);
}

export const adminAuth = getAuth(initFirebaseAdmin());
