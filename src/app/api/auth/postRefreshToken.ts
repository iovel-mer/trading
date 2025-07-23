"use server";

import { apiFetcher } from "@/app/api/utils/api-fetcher";
import type { LoginResponse } from "@/app/api/types/auth";

export const postRefreshToken = async (
  accessToken: string,
  refreshToken: string
) => {
  if (!refreshToken) {
    return {
      success: false,
      message: "No refresh token provided",
      statusCode: 401,
      data: null,
      error: "No refresh token provided",
    };
  }

  const response = await apiFetcher<LoginResponse>(
    "identity/api/auth/refresh-token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: { accessToken, refreshToken },
      noAuth: true,
      fallbackErrorMessages: {
        401: "Invalid or expired refresh token",
        500: "Token refresh service temporarily unavailable",
      },
    }
  );

  return response;
};
