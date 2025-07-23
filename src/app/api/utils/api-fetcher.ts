"use server";
import { logApiError, errorCodes } from "@/app/api/utils";
import { cookies } from "next/headers";

/**
 * API Fetcher - A utility for making API requests in Next.js server actions
 *
 * This utility handles common API request patterns including:
 * - Setting the base URL from environment variables
 * - Adding language headers based on user preferences
 * - Handling JSON request/response bodies
 * - Consistent error handling with fallbacks
 * - Type-safe responses
 *
 * @template T - The expected data type of a successful response
 * @param {string} endpoint - The API endpoint path (will be appended to BASE_URL)
 * @param {FetcherOptions} options - Request options
 * @returns {Promise<ApiResponse<T>>} - A standardized response object
 *
 * @example
 * // Basic GET request
 * const response = await apiFetcher('/api/users');
 *
 * @example
 * // POST request with body
 * const response = await apiFetcher('/api/users', {
 *   method: 'POST',
 *   body: { name: 'John', email: 'john@example.com' }
 * });
 *
 * @example
 * // With custom error messages
 * const response = await apiFetcher('/api/auth/login', {
 *   method: 'POST',
 *   body: { username, password },
 *   fallbackErrorMessages: {
 *     401: 'Invalid username or password',
 *     429: 'Too many login attempts, please try again later'
 *   }
 * });
 */

export type FetcherOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
  noAuth?: boolean;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  fallbackErrorMessages?: Record<number, string>;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  statusCode: number;
  errors?: string[];
};

export const apiFetcher = async <T = unknown>(
  endpoint: string,
  options: FetcherOptions = {}
): Promise<ApiResponse<T>> => {
  let accessToken = null;
  if (!options.noAuth) {
    const cookieStore = await cookies();
    accessToken = cookieStore.get("accessToken")?.value || null;
  }
  const baseUrl = process.env.API_URL;
  const defaultOptions: FetcherOptions = {
    method: "GET",
    headers: {
      ...(!options.noAuth ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    fallbackErrorMessages: errorCodes,
  };
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
    fallbackErrorMessages: {
      ...defaultOptions.fallbackErrorMessages,
      ...options.fallbackErrorMessages,
    },
  };

  const { fallbackErrorMessages, ...fetchOptions } = mergedOptions;

  if (
    fetchOptions.body &&
    !(fetchOptions.body instanceof FormData) &&
    typeof fetchOptions.body === "object"
  ) {
    fetchOptions.body = JSON.stringify(fetchOptions.body);
  }

  try {
    const url = `${baseUrl}/${endpoint}`;
    const res = await fetch(url, fetchOptions as RequestInit);
    const statusCode = res.status;

    if (res.ok) {
      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      return {
        success: true,
        message: "Success",
        data,
        statusCode,
      };
    } else {
    }

    try {
      let errorData;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        errorData = await res.json();
      } else {
        const rawText = await res.text();
        errorData = {
          nonJsonResponse: true,
          message: "Non-JSON error response",
          rawResponse: rawText,
        };
      }
      logApiError({
        endpoint,
        options,
        response: res,
        rawErrorData: errorData,
        fallbackMessage: fallbackErrorMessages[res.status],
      });
      return {
        success: false,
        statusCode: res.status,
      };
    } catch (parseError) {
      console.error("Failed to parse error response:", parseError);
      return {
        success: false,
        message: fallbackErrorMessages?.[statusCode] || "Unknown error",
        statusCode,
      };
    }
  } catch (networkError) {
    await logApiError({
      endpoint,
      options: fetchOptions,
      rawErrorData: networkError,
      fallbackMessage: "Network or runtime error",
    });

    return {
      success: false,
      message: "Failed to complete request",
      statusCode: 500,
    };
  }
};
