"use server";

import { apiFetcher } from "@/app/api/utils/api-fetcher";
import type { LoginCredentials, LoginResponse } from "@/app/api/types/auth";
import { createSession } from "@/app/api/utils/session";

export const postLogin = async (credentials: LoginCredentials) => {
  const response = await apiFetcher<LoginResponse>(
    "identity/api/auth/client/login",

    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: credentials,
      noAuth: true,
      fallbackErrorMessages: {
        401: "Invalid credentials provided",
        429: "Too many login attempts, please try again later",
        500: "Login service temporarily unavailable",
      },
    }
  );

  if (response.success && response.data?.accessToken) {
    await createSession(response.data.accessToken, response.data.refreshToken, {
      rememberMe: credentials.rememberMe,
    });
  }

  return response;
};
