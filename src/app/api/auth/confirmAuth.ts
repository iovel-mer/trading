"use server";

import { apiFetcher } from "@/app/api/utils/api-fetcher";
import { createSession } from "@/app/api/utils/session";
import type { LoginResponse } from "@/app/api/types/auth";

export const confirmAuth = async (authKey: string) => {
  console.log("🔑 [confirmAuth] Confirming auth with key:", authKey);

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

  console.log("🔑 [confirmAuth] API response:", {
    success: response.success,
    statusCode: response.statusCode,
    hasData: !!response.data,
    error: response.errors,
  });

  if (
    response.success &&
    response.data?.accessToken &&
    response.data?.refreshToken
  ) {
    console.log("✅ [confirmAuth] Auth confirmed, creating session...");

    // Create session with the new tokens
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
