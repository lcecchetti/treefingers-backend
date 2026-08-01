import { CookieOptions } from 'express';

export const AUTH_COOKIE_NAME = 'token';

// browser-only: a future non-browser client (e.g. a native app) authenticates
// via the Authorization header instead, see jwt.strategy.ts
export const getAuthCookieOptions = (
  isDev: boolean,
  maxAge?: number,
): CookieOptions => ({
  httpOnly: true,
  secure: !isDev,
  sameSite: 'strict',
  path: '/',
  ...(maxAge !== undefined && { maxAge }),
});
