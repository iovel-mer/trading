import { useCredentialsStore } from '@/lib/stores/credentials-store';
import { validateCredentials, sanitizeCredentials } from '@/lib/utils/credentials-utils';
import type { LoginCredentials } from '@/app/api/types/auth';

export const useCredentials = () => {
  const { 
    credentials, 
    setCredentials, 
    clearCredentials, 
    hasCredentials, 
    getCredentials 
  } = useCredentialsStore();

  const storeCredentials = (credentials: LoginCredentials) => {
    if (!validateCredentials(credentials)) {
      throw new Error('Invalid credentials provided');
    }
    setCredentials(sanitizeCredentials(credentials));
  };

  const getStoredCredentials = (): LoginCredentials | null => {
    const stored = getCredentials();
    if (!stored || !validateCredentials(stored)) {
      return null;
    }
    return stored;
  };

  const isCredentialsValid = (): boolean => {
    return hasCredentials() && validateCredentials(getCredentials());
  };

  return {
    credentials,
    storeCredentials,
    clearCredentials,
    hasCredentials: isCredentialsValid,
    getCredentials: getStoredCredentials,
  };
}; 