'use client';

import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

declare global {
  interface Window {
    __FIREBASE_CONFIG__?: FirebaseOptions;
  }
}

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;

function initFirebase(): Auth {
  if (firebaseAuth) {
    return firebaseAuth;
  }

  const config = window.__FIREBASE_CONFIG__;
  if (!config?.apiKey) {
    throw new Error(
      'Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* variables to .env and restart the dev server.',
    );
  }

  firebaseApp = getApps().length > 0 ? getApp() : initializeApp(config);
  firebaseAuth = getAuth(firebaseApp);
  return firebaseAuth;
}

export function getFirebaseAuth(): Auth {
  return initFirebase();
}

export function getFirebaseApp(): FirebaseApp {
  initFirebase();
  return firebaseApp!;
}
