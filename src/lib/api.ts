const BASE_URL = process.env.BASE_IDENTITY_URL || 'https://api.salesvault.dev';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add bearer token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`,
        };
      }
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data.message || data.error || 'An error occurred');
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        error: error.message,
        status: error.status,
      };
    }
    
    return {
      error: 'Network error occurred',
      status: 500,
    };
  }
}

// Auth API functions
export const authApi = {
  login: async (credentials: {
    emailOrUsername: string;
    password: string;
    twoFactorCode?: string;
    rememberMe?: boolean;
  }) => {
    return apiRequest('/identity/api/auth/client/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    phoneNumber: string;
  }) => {
    return apiRequest('/identity/api/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

    refresh: async (refreshToken: string) => {
    return apiRequest('/identity/api/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  getUserSettings: async () => {
    return apiRequest('/identity/api/users/settings', {
      method: 'GET',
    });
  },
};

// Types for API responses
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  username: string;
  email: string;
  password: string;
}

export interface UserSettings {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber: string;
  isEmailConfirmed: boolean;
  role: string;
  isTwoFactorEnabled: boolean;
}

// Trading API functions
export const tradingApi = {
  // Get user's trading accounts
  getTradingAccounts: async () => {
    return apiRequest<TradingAccountDto[]>('/traiding/api/TradingAccounts/user', {
      method: 'GET',
    });
  },

  // Get wallets for a trading account
  getWallets: async (tradingAccountId: string) => {
    return apiRequest<WalletDto[]>(`/traiding/api/Wallets/${tradingAccountId}`, {
      method: 'GET',
    });
  },

  // Get portfolio for a trading account
  getPortfolio: async (tradingAccountId: string) => {
    return apiRequest<PortfolioDto>(`/traiding/api/Wallets/${tradingAccountId}/portfolio`, {
      method: 'GET',
    });
  },

  // Create a ticket
  createTicket: async (ticketData: CreateTicketRequest) => {
    return apiRequest<string>('/traiding/api/Ticket/create', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  },

  // Get tickets
  getTickets: async (params?: {
    tradingAccountId?: string;
    pageIndex?: number;
    pageSize?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.tradingAccountId) searchParams.append('TradingAccountId', params.tradingAccountId);
    if (params?.pageIndex) searchParams.append('PageIndex', params.pageIndex.toString());
    if (params?.pageSize) searchParams.append('PageSize', params.pageSize.toString());

    const queryString = searchParams.toString();
    const url = `/traiding/api/Ticket/tickets${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest<TicketDto[]>(url, {
      method: 'GET',
    });
  },
};

// Trading-related types
export interface TradingAccountDto {
  id: string;
  userId: string;
  accountNumber: string;
  displayName: string;
  accountType: string;
  status: string;
  initialBalance: number;
  enableSpotTrading: boolean;
  enableFuturesTrading: boolean;
  maxLeverage: number;
  createdAt: string;
  verifiedAt: string | null;
  suspendedAt: string | null;
  suspensionReason: string | null;
}

export interface WalletDto {
  id: string;
  currency: string;
  availableBalance: number;
  lockedBalance: number;
  totalBalance: number;
  usdEquivalent: number;
  lastPriceUpdate: string;
}

export interface PortfolioDto {
  tradingAccountId: string;
  totalUsdValue: number;
  holdings: AssetHoldingDto[];
  timestamp: string;
}

export interface AssetHoldingDto {
  currency: string;
  balance: number;
  usdPrice: number;
  usdValue: number;
  percentage: number;
  change24h: number;
}

export interface CreateTicketRequest {
  walletId: string;
  type: TicketType;
  amount: number;
}

export interface TicketDto {
  id: string;
  ticketType: TicketType;
  amount: number;
  walletId: string;
  ticketStatus: TicketStatus;
}

export enum TicketType {
  Deposit = 0,
  Withdraw = 1,
}

export enum TicketStatus {
  Pending = 0,
  Processing = 1,
  Completed = 2,
  Cancelled = 3,
  Failed = 4,
  Rejected = 5,
} 