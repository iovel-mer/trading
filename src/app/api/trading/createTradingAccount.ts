'use server';

import { apiFetcher } from '@/app/api/utils/api-fetcher';
import type { TradingAccountDto } from '@/app/api/types/trading';

export interface CreateTradingAccountRequest {
  displayName: string;
}

export const createTradingAccount = async (
  request: CreateTradingAccountRequest
) => {
  if (!request.displayName?.trim()) {
    return {
      success: false,
      error: 'Display name is required',
      data: null,
      statusCode: 400,
    };
  }

  return apiFetcher<TradingAccountDto>('traiding/api/TradingAccounts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      displayName: request.displayName.trim(),
    },
    fallbackErrorMessages: {
      400: 'Invalid account data provided',
      401: 'Authentication required to create trading accounts',
      403: 'Access denied to create trading accounts',
      409: 'Trading account with this name already exists',
      500: 'Trading account creation service temporarily unavailable',
    },
  });
};
