"use server";

import { apiFetcher } from "@/app/api/utils/api-fetcher";
import type { LoginCredentials } from "@/app/api/types/auth";

export const postLoginForRedirect = async (credentials: LoginCredentials) => {
  const redirectCredentials = {
    emailOrUsername: credentials.emailOrUsername,
    password: credentials.password,
  };

  const response = await apiFetcher<string>(
    "identity/api/auth/login-for-direct",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: redirectCredentials,
      noAuth: true,
      fallbackErrorMessages: {
        401: "Invalid credentials provided",
        429: "Too many login attempts, please try again later",
        500: "Login service temporarily unavailable",
      },
    }
  );

  return response;
}; 