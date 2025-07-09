"use server";

import { apiFetcher } from "@/app/api/utils/api-fetcher";
import type { CreateTicketRequest } from "@/app/api/types/trading";

export const postCreateTicket = async (ticketData: CreateTicketRequest) => {
  return apiFetcher<string>("traiding/api/Ticket/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: ticketData,
    fallbackErrorMessages: {
      400: "Invalid ticket data provided",
      401: "Authentication required to create tickets",
      403: "Access denied to create tickets",
      409: "Ticket creation conflict",
      500: "Ticket creation service temporarily unavailable",
    },
  });
};
