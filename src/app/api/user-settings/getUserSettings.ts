"use server";

import { apiFetcher } from "@/app/api/utils/api-fetcher";
import type { UserSettings } from "@/app/api/types/auth";

export const getUserSettings = async () => {
  console.log("📡 [getUserSettings] Function called");

  const response = await apiFetcher<UserSettings>(
    "identity/api/users/settings",
    {
      method: "GET",
      fallbackErrorMessages: {
        401: "Authentication required to access user settings",
        403: "Access denied to user settings",
        404: "User settings not found",
        500: "User settings service temporarily unavailable",
      },
    }
  );

  console.log("📡 [getUserSettings] API response:", {
    success: response.success,
    statusCode: response.statusCode,
    hasData: !!response.data,
    error: response.errors,
    dataPreview: response.data ? { email: response.data.email } : null,
  });

  return response;
};
