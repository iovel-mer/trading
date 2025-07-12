"use server";

import { apiFetcher } from "@/app/api/utils/api-fetcher";
import type { TradingAccountDto } from "@/app/api/types/trading";

export const getTradingAccounts = async () => {
  const response = await apiFetcher<TradingAccountDto[]>(
    "traiding/api/TradingAccounts/user",
    {
      method: "GET",
      fallbackErrorMessages: {
        401: "Authentication required to access trading accounts",
        403: "Access denied to trading accounts",
        404: "No trading accounts found",
        500: "Trading accounts service temporarily unavailable",
      },
    }
  );

  console.log(response, "-- - -- --");

  return response;
};
