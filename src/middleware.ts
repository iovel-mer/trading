import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { postRefreshToken } from '@/app/api/auth/postRefreshToken';
import { COOKIE_CONFIG } from './app/api/const/session';
import createIntlMiddleware from 'next-intl/middleware';

const parseJwtSync = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

const isJWTExpiredSync = (token: string): boolean => {
  const payload = parseJwtSync(token);
  if (!payload || !payload.exp) return true;
  return Date.now() >= payload.exp * 1000;
};

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'es', 'de'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export async function middleware(request: NextRequest) {
  console.log('Middleware called for:', request.nextUrl.pathname);

  const url = new URL(request.url);
  const pathname = url.pathname;

  const intlResponse = intlMiddleware(request);

  if (intlResponse && intlResponse.status >= 300 && intlResponse.status < 400) {
    console.log('Middleware - Intl redirect:', intlResponse.status);
    return intlResponse;
  }

  const segments = pathname.split('/');
  const locales = ['en', 'es', 'de'];
  const locale = locales.includes(segments[1]) ? segments[1] : 'en';
  const pathnameWithoutLocale = locales.includes(segments[1])
    ? '/' + segments.slice(2).join('/')
    : pathname;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.url);
  requestHeaders.set('x-origin', url.origin);
  requestHeaders.set('x-pathname', pathname);
  requestHeaders.set('x-locale', locale);

  const publicPaths = ['/login', '/register', '/'];
  const protectedPaths = ['/dashboard', '/trading', '/finance'];
  const authPaths = ['/login', '/register'];

  const isProtectedPath = protectedPaths.some(path =>
    pathnameWithoutLocale.startsWith(path)
  );
  const isAuthPath = authPaths.some(path =>
    pathnameWithoutLocale.startsWith(path)
  );

  const authkey = url.searchParams.get('authkey');
  if (authkey && pathnameWithoutLocale === '/dashboard') {
    console.log(
      '\x1b[43m\x1b[30m[AUTHKEY DETECTED]\x1b[0m Allowing dashboard access for auth confirmation'
    );
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (isAuthPath) {
    const sessionCookie = request.cookies.get(COOKIE_CONFIG.SESSION.name);
    if (sessionCookie) {
      try {
        const sessionData = JSON.parse(sessionCookie.value);
        const { token } = sessionData;
        if (token && !isJWTExpiredSync(token)) {
          const dashboardUrl = `/${locale}/dashboard`;
          return NextResponse.redirect(new URL(dashboardUrl, request.url));
        }
      } catch {}
    }
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (!isProtectedPath) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const cookie = request.cookies.get(COOKIE_CONFIG.SESSION.name);
  if (!cookie) {
    console.log(
      '\x1b[41m\x1b[97m[NO SESSION COOKIE]\x1b[0m Redirecting to /login'
    );
    const loginUrl = `/${locale}/login`;
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }

  let sessionData;
  try {
    sessionData = JSON.parse(cookie.value);
  } catch {
    console.log(
      '\x1b[41m\x1b[97m[INVALID SESSION DATA]\x1b[0m Redirecting to /login'
    );
    const loginUrl = `/${locale}/login`;
    const response = NextResponse.redirect(new URL(loginUrl, request.url));
    response.cookies.delete(COOKIE_CONFIG.SESSION.name);
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    return response;
  }

  const { token, refreshToken } = sessionData;

  const needsRefresh = isJWTExpiredSync(token);
  if (needsRefresh) {
    console.log('\x1b[44m\x1b[97m[TOKEN EXPIRED]\x1b[0m Trying refresh...');
    if (!refreshToken) {
      console.log(
        '\x1b[41m\x1b[97m[NO REFRESH TOKEN]\x1b[0m Redirecting to /login'
      );
      const loginUrl = `/${locale}/login`;
      const response = NextResponse.redirect(new URL(loginUrl, request.url));
      response.cookies.delete(COOKIE_CONFIG.SESSION.name);
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
    }

    const refreshed = await postRefreshToken(token, refreshToken);
    if (
      !refreshed.success ||
      !refreshed.data?.accessToken ||
      !refreshed.data?.refreshToken
    ) {
      console.log(
        '\x1b[41m\x1b[97m[REFRESH FAILED]\x1b[0m Invalid refresh token'
      );
      const loginUrl = `/${locale}/login`;
      const response = NextResponse.redirect(new URL(loginUrl, request.url));
      response.cookies.delete(COOKIE_CONFIG.SESSION.name);
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
    }

    console.log('\x1b[42m\x1b[30m[REFRESH SUCCESSFUL]\x1b[0m Token updated!');

    const updatedSession = {
      ...sessionData,
      token: refreshed.data.accessToken,
      refreshToken: refreshed.data.refreshToken,
      updatedAt: new Date().toISOString(),
    };

    const nextResponse = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    nextResponse.cookies.set(
      COOKIE_CONFIG.SESSION.name,
      JSON.stringify(updatedSession),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      }
    );

    nextResponse.cookies.set('accessToken', refreshed.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15, // 15 minutes
      path: '/',
    });

    nextResponse.cookies.set('refreshToken', refreshed.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return nextResponse;
  }

  console.log('\x1b[32m[TOKEN VALID]\x1b[0m Continuing request');
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
