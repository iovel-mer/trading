import type { LoginCredentials } from '@/app/api/types/auth';

/**
 * Validates if the provided credentials are complete and valid
 */
export const validateCredentials = (credentials: LoginCredentials | null): boolean => {
  if (!credentials) return false;
  
  return !!(
    credentials.emailOrUsername &&
    credentials.password &&
    credentials.emailOrUsername.trim() !== '' &&
    credentials.password.trim() !== ''
  );
};

/**
 * Sanitizes credentials by removing sensitive fields that shouldn't be persisted
 */
export const sanitizeCredentials = (credentials: LoginCredentials): LoginCredentials => {
  const { emailOrUsername, password, rememberMe } = credentials;
  return {
    emailOrUsername,
    password,
    ...(rememberMe && { rememberMe }),
  };
};

/**
 * Checks if credentials are expired (for remember me functionality)
 * This is a placeholder - implement actual expiration logic as needed
 */
export const areCredentialsExpired = (credentials: LoginCredentials): boolean => {
  // For now, we'll assume credentials don't expire
  // You can implement actual expiration logic here based on your requirements
  return false;
}; 