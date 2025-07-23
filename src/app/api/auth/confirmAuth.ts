"use server";

import { apiFetcher } from "@/app/api/utils/api-fetcher";
import { createSession } from "@/app/api/utils/session";
import type { LoginResponse } from "@/app/api/types/auth";

export const confirmAuth = async (authKey: string) => {
  if (!authKey) {
    return {
      success: false,
      message: "Auth key is required",
      data: null,
    };
  }

  const response = await apiFetcher<LoginResponse>(
    `identity/api/auth/confirm-auth?authKey=${authKey}`,
    {
      method: "GET",
      noAuth: true,
      fallbackErrorMessages: {
        400: "Invalid auth key provided",
        401: "Auth key expired or invalid",
        404: "Auth key not found",
        500: "Auth confirmation service temporarily unavailable",
      },
    }
  );

  if (
    response.success &&
    response.data?.accessToken &&
    response.data?.refreshToken
  ) {
    await createSession(response.data.accessToken, response.data.refreshToken);

    return {
      success: true,
      message: "Authentication confirmed successfully",
      data: response.data,
    };
  }

  return {
    success: false,
    message: response.errors || "Failed to confirm authentication",
    data: null,
  };
};
