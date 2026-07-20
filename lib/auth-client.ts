import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';

/**
 * Performs Google sign-in using Firebase Auth, retrieves ID token.
 * The AuthProvider's onAuthStateChanged listener will handle syncing
 * with the backend and updating Zustand state.
 *
 * @returns The Firebase ID token for the signed‑in user.
 */
export async function loginWithGoogle(): Promise<string> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(getFirebaseAuth(), provider);
  const firebaseUser = result.user;
  // Force refresh to ensure we have a fresh token
  const idToken = await firebaseUser.getIdToken(true);
  return idToken;
}
