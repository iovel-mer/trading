"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmAuth } from "@/app/api/auth/confirmAuth";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface AuthConfirmerProps {
  onAuthConfirmed?: () => void;
}

export function AuthConfirmer({ onAuthConfirmed }: AuthConfirmerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<
    "checking" | "success" | "error" | "none"
  >("none");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const authKey = searchParams.get("authkey");

    if (authKey) {
      console.log("🔑 [AuthConfirmer] Found authkey in URL:", authKey);
      handleAuthConfirmation(authKey);
    }
  }, [searchParams]);

  const handleAuthConfirmation = async (authKey: string) => {
    try {
      setStatus("checking");
      setMessage("Confirming authentication...");

      console.log("🔄 [AuthConfirmer] Confirming auth with key:", authKey);

      const result = await confirmAuth(authKey);

      if (result.success) {
        console.log("✅ [AuthConfirmer] Auth confirmed successfully");
        setStatus("success");
        setMessage("Authentication confirmed! Loading dashboard...");

        // Clean the URL by removing the authkey parameter
        const url = new URL(window.location.href);
        url.searchParams.delete("authkey");
        window.history.replaceState({}, "", url.toString());

        // Call the callback if provided
        if (onAuthConfirmed) {
          onAuthConfirmed();
        }

        // Force a page reload to ensure the new session is recognized
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.log(
          "❌ [AuthConfirmer] Auth confirmation failed:",
          result.message
        );
        setStatus("error");

        // Redirect to login after error
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (error) {
      console.error(
        "💥 [AuthConfirmer] Error during auth confirmation:",
        error
      );
      setStatus("error");
      setMessage("An unexpected error occurred");

      // Redirect to login after error
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  };

  if (status === "none") {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        {status === "checking" && (
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-semibold mb-2">
              Processing Authentication
            </h3>
            <p className="text-gray-600">
              Please wait while we verify your access...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-4 text-green-600" />
            <h3 className="text-lg font-semibold mb-2 text-green-800">
              Authentication Successful
            </h3>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
            <h3 className="text-lg font-semibold mb-2 text-red-800">
              Authentication Failed
            </h3>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">
              Redirecting to login page...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
