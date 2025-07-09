// Client-side cookie utilities
export const clientCookies = {
  set: (name: string, value: string, options: { maxAge?: number; path?: string } = {}) => {
    if (typeof window === 'undefined') return;
    
    const { maxAge = 24 * 60 * 60, path = '/' } = options;
    document.cookie = `${name}=${value}; path=${path}; max-age=${maxAge}`;
  },

  get: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  },

  remove: (name: string, path: string = '/') => {
    if (typeof window === 'undefined') return;
    
    document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },
};

// Server-side cookie utilities (for use in API routes)
export const serverCookies = {
  parse: (cookieHeader: string | null): Record<string, string> => {
    if (!cookieHeader) return {};
    
    return cookieHeader
      .split(';')
      .map(cookie => cookie.trim().split('='))
      .reduce((acc, [key, value]) => {
        if (key && value) {
          acc[key] = decodeURIComponent(value);
        }
        return acc;
      }, {} as Record<string, string>);
  },

  serialize: (name: string, value: string, options: { maxAge?: number; path?: string; httpOnly?: boolean } = {}) => {
    const { maxAge = 24 * 60 * 60, path = '/', httpOnly = false } = options;
    
    let cookie = `${name}=${encodeURIComponent(value)}; Path=${path}; Max-Age=${maxAge}`;
    
    if (httpOnly) {
      cookie += '; HttpOnly';
    }
    
    return cookie;
  },
}; 