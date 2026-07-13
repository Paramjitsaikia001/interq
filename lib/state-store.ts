import { create } from 'zustand';
import { User, mockUsers } from './mock-data';

export type AppState = 'normal' | 'loading' | 'empty' | 'error';
export type UserRole = 'guest' | 'user' | 'admin';

interface SimulationState {
  appState: AppState;
  userRole: UserRole;
  currentUser: User | null;
  authToken: string | null;
  setAppState: (state: AppState) => void;
  setUserRole: (role: UserRole) => void;
  setFirebaseUser: (user: User, role: UserRole, token: string) => void;
  updateUser: (updates: Partial<User>) => void;
  clearAuth: () => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  appState: 'normal',
  userRole: 'guest', // default is guest for actual Firebase Auth
  currentUser: null,
  authToken: null,
  setAppState: (appState) => set({ appState }),
  setUserRole: (userRole) => {
    // Keep this simulated role handler for testing/dev selector
    let currentUser: User | null = null;
    let authToken: string | null = null;
    if (userRole === 'user') {
      currentUser = mockUsers[1];
      authToken = 'mock-token-alex@gentek.org';
    } else if (userRole === 'admin') {
      currentUser = mockUsers[0];
      authToken = 'mock-token-sarah@skynet.com';
    }
    set({ userRole, currentUser, authToken });
  },
  setFirebaseUser: (user, role, token) => {
    set({ currentUser: user, userRole: role, authToken: token });
  },
  updateUser: (updates) => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null
  })),
  clearAuth: () => {
    set({ currentUser: null, userRole: 'guest', authToken: null });
  }
}));
