"use server";

import { apiFetcher } from "@/app/api/utils/api-fetcher";
import type { UserSettings } from "@/app/api/types/auth";

export const getUserSettings = async () => {
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

  return response;
};
