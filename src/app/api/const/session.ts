export const COOKIE_CONFIG = {
  SESSION: {
    name: "session",
  },
  ACCESS_TOKEN: {
    name: "accessToken",
    maxAge: 60 * 15, // 15 minutes
  },
  REFRESH_TOKEN: {
    name: "refreshToken",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
} as const;
