"use server";

import { apiFetcher } from "@/app/api/utils/api-fetcher";

export const postUserProfile = async (profileData: {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
}) => {
  const response = await apiFetcher<any>("identity/api/clients/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: profileData,
    fallbackErrorMessages: {
      401: "Authentication required to access user settings",
      403: "Access denied to user settings",
      404: "User settings not found",
      500: "User settings service temporarily unavailable",
    },
  });

  return response;
};
