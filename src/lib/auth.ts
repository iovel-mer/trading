import { authApi } from './api';
import { clientCookies } from './cookies';

export class AuthManager {
  private static instance: AuthManager;
  private refreshPromise: Promise<any> | null = null;

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  }

  setTokens(accessToken: string, refreshToken: string, rememberMe: boolean = false): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('authToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
    clientCookies.set('authToken', accessToken, { maxAge });
    clientCookies.set('refreshToken', refreshToken, { maxAge });
  }

  clearTokens(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    clientCookies.remove('authToken');
    clientCookies.remove('refreshToken');
  }

  async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    // Prevent multiple refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = authApi.refresh(refreshToken).then(response => {
      if (response.error) {
        this.clearTokens();
        throw new Error(response.error);
      }

      if (response.data?.accessToken) {
        this.setTokens(response.data.accessToken, response.data.refreshToken);
        return response.data.accessToken;
      }

      throw new Error('Invalid refresh response');
    }).finally(() => {
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const authManager = AuthManager.getInstance(); 