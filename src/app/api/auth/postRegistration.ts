"use server";

import { apiFetcher } from "@/app/api/utils/api-fetcher";
import type { RegisterUserData, RegisterResponse } from "@/app/api/types/auth";

export const postRegistration = async (userData: RegisterUserData) => {
  return apiFetcher<RegisterResponse>("identity/api/clients/create-client-via-web", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
    noAuth: true,
    fallbackErrorMessages: {
      400: "Invalid registration data provided",
      409: "User with this email or username already exists",
      500: "Registration service temporarily unavailable",
    },
  });
};
