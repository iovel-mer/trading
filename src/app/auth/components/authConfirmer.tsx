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
      handleAuthConfirmation(authKey);
    }
  }, [searchParams]);

  const handleAuthConfirmation = async (authKey: string) => {
    try {
      setStatus("checking");
      setMessage("Confirming authentication...");

      const result = await confirmAuth(authKey);

      if (result.success) {
        setStatus("success");
        setMessage("Authentication confirmed! Loading dashboard...");

        const url = new URL(window.location.href);
        url.searchParams.delete("authkey");
        window.history.replaceState({}, "", url.toString());

        if (onAuthConfirmed) {
          onAuthConfirmed();
        }

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setStatus("error");

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
