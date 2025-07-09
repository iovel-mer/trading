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
  console.log("🔍 [getCurrentUser] Function called");

  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    console.log("🔍 [getCurrentUser] Session cookie exists:", !!sessionCookie);

    if (!sessionCookie) {
      console.log("❌ [getCurrentUser] No session cookie found");
      return {
        success: false,
        message: "No session found",
        data: null,
      };
    }

    let sessionData: SessionData;
    try {
      sessionData = JSON.parse(sessionCookie.value);
      console.log("✅ [getCurrentUser] Session data parsed:", {
        hasToken: !!sessionData.token,
        hasRefreshToken: !!sessionData.refreshToken,
        hasUser: !!sessionData.user,
        userKeys: sessionData.user ? Object.keys(sessionData.user) : [],
        userEmail: sessionData.user?.email,
        createdAt: sessionData.createdAt,
      });
    } catch (error) {
      console.log("❌ [getCurrentUser] Failed to parse session data:", error);
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
      console.log(
        "✅ [getCurrentUser] Returning valid user from session:",
        sessionData.user.email
      );
      return {
        success: true,
        data: sessionData.user,
      };
    }

    console.log(
      "🔄 [getCurrentUser] No valid user in session, fetching from API..."
    );

    // Otherwise, fetch user data from API
    const userResponse = await getUserSettings();

    console.log("📡 [getCurrentUser] getUserSettings response:", {
      success: userResponse.success,
      hasData: !!userResponse.data,
      error: userResponse.errors,
      statusCode: userResponse.statusCode,
    });

    if (userResponse.success && userResponse.data) {
      console.log(
        "✅ [getCurrentUser] User data fetched successfully:",
        userResponse.data.email
      );

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

        console.log("✅ [getCurrentUser] Session updated with user data");
      } catch (updateError) {
        console.log(
          "⚠️ [getCurrentUser] Failed to update session:",
          updateError
        );
      }

      return {
        success: true,
        data: userResponse.data,
      };
    }

    console.log("❌ [getCurrentUser] Failed to get user data from API");
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
