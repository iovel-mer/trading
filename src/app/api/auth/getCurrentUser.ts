"use server";

import { cookies } from "next/headers";
import { getUserSettings } from "@/app/api/user-settings/getUserSettings";

interface SessionData {
  token: string;
  refreshToken: string;
  user?: any;
  createdAt: string;
  updatedAt?: string;
}

export const getCurrentUser = async () => {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
      return {
        success: false,
        message: "No session found",
        data: null,
      };
    }

    let sessionData: SessionData;
    try {
      sessionData = JSON.parse(sessionCookie.value);
    } catch (error) {
      return {
        success: false,
        message: "Invalid session data",
        data: null,
      };
    }

    const hasValidUserData =
      sessionData.user &&
      typeof sessionData.user === "object" &&
      Object.keys(sessionData.user).length > 0 &&
      sessionData.user.email;

    if (hasValidUserData) {
      return {
        success: true,
        data: sessionData.user,
      };
    }

    // Otherwise, fetch user data from API
    const userResponse = await getUserSettings();

    if (userResponse.success && userResponse.data) {
      // Update the session with the user data
      try {
        const updatedSessionData = {
          ...sessionData,
          user: userResponse.data,
          updatedAt: new Date().toISOString(),
        };

        cookieStore.set("session", JSON.stringify(updatedSessionData), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
        });
      } catch (updateError) {}

      return {
        success: true,
        data: userResponse.data,
      };
    }

    return {
      success: false,
      message: userResponse.errors || "Failed to get user data",
      data: null,
    };
  } catch (error) {
    console.error("💥 [getCurrentUser] Unexpected error:", error);
    return {
      success: false,
      message: "Failed to get user data",
      data: null,
    };
  }
};
