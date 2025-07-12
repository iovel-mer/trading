"use server";

import { apiFetcher } from "@/app/api/utils/api-fetcher";
import type { PortfolioDto } from "@/app/api/types/trading";

export const getPortfolio = async (tradingAccountId: string) => {
  const response = await apiFetcher<PortfolioDto>(
    `traiding/api/Wallets/${tradingAccountId}/portfolio`,
    {
      method: "GET",
      fallbackErrorMessages: {
        401: "Authentication required to access portfolio",
        403: "Access denied to portfolio",
        404: "Trading account or portfolio not found",
        500: "Portfolio service temporarily unavailable",
      },
    }
  );

  return response;
};
