import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginCredentials } from '@/app/api/types/auth';
import { validateCredentials, sanitizeCredentials } from '@/lib/utils/credentials-utils';

interface CredentialsState {
  credentials: LoginCredentials | null;
  setCredentials: (credentials: LoginCredentials) => void;
  clearCredentials: () => void;
  hasCredentials: () => boolean;
  getCredentials: () => LoginCredentials | null;
}

export const useCredentialsStore = create<CredentialsState>()(
  persist(
    (set, get) => ({
      credentials: null,
      setCredentials: (credentials: LoginCredentials) => {
        // Validate and sanitize credentials before storing
        if (!validateCredentials(credentials)) {
          console.warn('Invalid credentials provided to store');
          return;
        }
        const sanitizedCredentials = sanitizeCredentials(credentials);
        set({ credentials: sanitizedCredentials });
      },
      clearCredentials: () => set({ credentials: null }),
      hasCredentials: () => {
        const { credentials } = get();
        return validateCredentials(credentials);
      },
      getCredentials: () => {
        const { credentials } = get();
        return credentials;
      },
    }),
    {
      name: 'web-trader-credentials',
      // Only persist the essential fields, exclude sensitive data like 2FA codes
      partialize: (state) => ({
        credentials: state.credentials ? sanitizeCredentials(state.credentials) : null,
      }),
    }
  )
); 