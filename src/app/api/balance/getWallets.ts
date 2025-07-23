"use server";

import { apiFetcher } from "@/app/api/utils/api-fetcher";
import type { WalletDto } from "@/app/api/types/trading";

export const getWallets = async (tradingAccountId: string) => {
  return apiFetcher<WalletDto[]>(`traiding/api/Wallets/${tradingAccountId}`, {
    method: "GET",
    fallbackErrorMessages: {
      401: "Authentication required to access wallets",
      403: "Access denied to wallets",
      404: "Trading account or wallets not found",
      500: "Wallets service temporarily unavailable",
    },
  });
};
