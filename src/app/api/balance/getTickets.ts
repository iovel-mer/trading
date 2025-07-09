"use server";

import { apiFetcher } from "@/app/api/utils/api-fetcher";
import type { TicketDto, GetTicketsParams } from "@/app/api/types/trading";

export const getTickets = async (params?: GetTicketsParams) => {
  const searchParams = new URLSearchParams();

  if (params?.tradingAccountId) {
    searchParams.append("TradingAccountId", params.tradingAccountId);
  }
  if (params?.pageIndex !== undefined) {
    searchParams.append("PageIndex", params.pageIndex.toString());
  }
  if (params?.pageSize !== undefined) {
    searchParams.append("PageSize", params.pageSize.toString());
  }

  const queryString = searchParams.toString();
  const endpoint = `traiding/api/Ticket/tickets${
    queryString ? `?${queryString}` : ""
  }`;

  return apiFetcher<TicketDto[]>(endpoint, {
    method: "GET",
    fallbackErrorMessages: {
      401: "Authentication required to access tickets",
      403: "Access denied to tickets",
      404: "No tickets found",
      500: "Tickets service temporarily unavailable",
    },
  });
};
