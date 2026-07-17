'use client';

import * as React from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useSimulationStore } from '@/lib/state-store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setFirebaseUser, clearAuth } = useSimulationStore();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          
          // Sync with database
          const response = await fetch('/api/v1/auth/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
            }),
          });

          if (response.ok) {
            const dbUser = await response.json();
            setFirebaseUser({
              id: dbUser.id,
              name: dbUser.name,
              email: dbUser.email,
              role: dbUser.role,
              avatarUrl: firebaseUser.photoURL || undefined,
              joinedDate: new Date(dbUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
              reputation: dbUser.reputation,
            }, dbUser.role, token);
          } else {
            const errorBody = await response.text().catch(() => '');
            console.error('Failed to sync auth user', response.status, errorBody);
            clearAuth();
          }
        } catch (error) {
          console.error('Error in onAuthStateChanged sync:', error);
          clearAuth();
        }
      } else {
        clearAuth();
      }
    });

    return () => unsubscribe();
  }, [setFirebaseUser, clearAuth]);

  return <>{children}</>;
}
