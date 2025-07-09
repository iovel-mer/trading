"use server";

import { apiFetcher } from "@/app/api/utils/api-fetcher";
import { AccountInfo, CreateOrderRequest, ExchangeInfo, KlineData, Order, OrderBook, Ticker, Trade, TradingPair } from "../types/binance";

// Trading Pairs
export const getTradingPairs = async (
  search?: string,
  pageSize?: number,
  pageIndex?: number
) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (pageSize) params.append('pageSize', pageSize.toString());
  if (pageIndex) params.append('pageIndex', pageIndex.toString());

  const queryString = params.toString();
  const endpoint = queryString ? `binance/api/Binance/trading-pairs?${queryString}` : `binance/api/Binance/trading-pairs`;

  return apiFetcher<TradingPair[]>(
    endpoint,
    {
      method: "GET",
      fallbackErrorMessages: {
        400: "Invalid parameters provided",
        404: "Trading pairs not found",
        500: "Trading pairs service temporarily unavailable",
      },
    }
  );
};

// Single Ticker
export const getTicker = async (symbol: string) => {
  return apiFetcher<Ticker>(
    `binance/api/Binance/ticker/${symbol}`,
    {
      method: "GET",
      fallbackErrorMessages: {
        400: "Invalid symbol provided",
        404: "Ticker not found for symbol",
        500: "Ticker service temporarily unavailable",
      },
    }
  );
};

// All Tickers
export const getAllTickers = async () => {
  return apiFetcher<Ticker[]>(
    `binance/api/Binance/tickers`,
    {
      method: "GET",
      fallbackErrorMessages: {
        404: "No tickers found",
        500: "Tickers service temporarily unavailable",
      },
    }
  );
};

// Order Book
export const getOrderBook = async (symbol: string, limit: number = 100) => {
  const endpoint = `binance/api/Binance/orderbook/${symbol}?limit=${limit}`;

  return apiFetcher<OrderBook>(
    endpoint,
    {
      method: "GET",
      fallbackErrorMessages: {
        400: "Invalid symbol or limit provided",
        404: "Order book not found for symbol",
        500: "Order book service temporarily unavailable",
      },
    }
  );
};

// Historical Data (Klines)
export const getHistoricalData = async (
  symbol: string,
  interval: string = "1h",
  limit: number = 500
) => {
  const endpoint = `binance/api/Binance/historical-data/${symbol}?interval=${interval}&limit=${limit}`;

  return apiFetcher<KlineData[]>(
    endpoint,
    {
      method: "GET",
      fallbackErrorMessages: {
        400: "Invalid parameters provided",
        404: "Historical data not found for symbol",
        500: "Historical data service temporarily unavailable",
      },
    }
  );
};

// Recent Trades
export const getRecentTrades = async (symbol: string, limit: number = 500) => {
  const endpoint = `binance/api/Binance/trades/${symbol}?limit=${limit}`;

  return apiFetcher<Trade[]>(
    endpoint,
    {
      method: "GET",
      fallbackErrorMessages: {
        400: "Invalid symbol or limit provided",
        404: "Recent trades not found for symbol",
        500: "Recent trades service temporarily unavailable",
      },
    }
  );
};

// Exchange Information
export const getExchangeInfo = async () => {
  return apiFetcher<ExchangeInfo>(
    `binance/api/Binance/exchange-info`,
    {
      method: "GET",
      fallbackErrorMessages: {
        404: "Exchange information not found",
        500: "Exchange information service temporarily unavailable",
      },
    }
  );
};

// Account Information
export const getAccountInfo = async () => {
  return apiFetcher<AccountInfo>(
    `binance/api/Binance/account`,
    {
      method: "GET",
      fallbackErrorMessages: {
        401: "Authentication required to access account information",
        403: "Access denied to account information",
        404: "Account information not found",
        500: "Account information service temporarily unavailable",
      },
    }
  );
};

// Create Order
export const createOrder = async (orderRequest: CreateOrderRequest) => {
  return apiFetcher<Order>(
    `binance/api/Binance/order`,
    {
      method: "POST",
      body: orderRequest,
      fallbackErrorMessages: {
        400: "Invalid order parameters",
        401: "Authentication required to create order",
        403: "Insufficient balance or trading not allowed",
        404: "Symbol not found",
        429: "Rate limit exceeded",
        500: "Order creation service temporarily unavailable",
      },
    }
  );
};

// Get Order Status
export const getOrderStatus = async (symbol: string, orderId: number) => {
  return apiFetcher<Order>(
    `binance/api/Binance/order/${symbol}/${orderId}`,
    {
      method: "GET",
      fallbackErrorMessages: {
        400: "Invalid symbol or order ID",
        401: "Authentication required to access order",
        404: "Order not found",
        500: "Order status service temporarily unavailable",
      },
    }
  );
};

// Cancel Order
export const cancelOrder = async (symbol: string, orderId: number) => {
  return apiFetcher<Order>(
    `binance/api/Binance/order/${symbol}/${orderId}`,
    {
      method: "DELETE",
      fallbackErrorMessages: {
        400: "Invalid symbol or order ID",
        401: "Authentication required to cancel order",
        404: "Order not found",
        500: "Order cancellation service temporarily unavailable",
      },
    }
  );
};

// Get Open Orders
export const getOpenOrders = async (symbol?: string) => {
  const endpoint = symbol ? `binance/api/Binance/open-orders?symbol=${symbol}` : `binance/api/Binance/open-orders`;

  return apiFetcher<Order[]>(
    endpoint,
    {
      method: "GET",
      fallbackErrorMessages: {
        401: "Authentication required to access open orders",
        404: "No open orders found",
        500: "Open orders service temporarily unavailable",
      },
    }
  );
};

// Get Order History
export const getOrderHistory = async (
  symbol?: string,
  orderId?: number,
  limit: number = 500
) => {
  const params = new URLSearchParams();
  if (symbol) params.append('symbol', symbol);
  if (orderId) params.append('orderId', orderId.toString());
  if (limit) params.append('limit', limit.toString());

  const queryString = params.toString();
  const endpoint = queryString ? `binance/api/Binance/order-history?${queryString}` : `binance/api/Binance/order-history`;

  return apiFetcher<Order[]>(
    endpoint,
    {
      method: "GET",
      fallbackErrorMessages: {
        401: "Authentication required to access order history",
        404: "Order history not found",
        500: "Order history service temporarily unavailable",
      },
    }
  );
};

// Get My Trades
export const getMyTrades = async (
  symbol?: string,
  limit: number = 500
) => {
  const params = new URLSearchParams();
  if (symbol) params.append('symbol', symbol);
  if (limit) params.append('limit', limit.toString());

  const queryString = params.toString();
  const endpoint = queryString ? `binance/api/Binance/my-trades?${queryString}` : `binance/api/Binance/my-trades`;

  return apiFetcher<Trade[]>(
    endpoint,
    {
      method: "GET",
      fallbackErrorMessages: {
        401: "Authentication required to access trade history",
        404: "Trade history not found",
        500: "Trade history service temporarily unavailable",
      },
    }
  );
};

// Get 24hr Ticker Statistics
export const get24hrTickerStats = async (symbol?: string) => {
  const endpoint = symbol
    ? `binance/api/Binance/24hr-stats/${symbol}`
    : `binance/api/Binance/24hr-stats`;

  return apiFetcher<Ticker[]>(
    endpoint,
    {
      method: "GET",
      fallbackErrorMessages: {
        400: "Invalid symbol provided",
        404: "24hr statistics not found",
        500: "24hr statistics service temporarily unavailable",
      },
    }
  );
};

// Get Price
export const getPrice = async (symbol?: string) => {
  const endpoint = symbol
    ? `binance/api/Binance/price/${symbol}`
    : `binance/api/Binance/prices`;

  return apiFetcher<{ symbol: string; price: string }[]>(
    endpoint,
    {
      method: "GET",
      fallbackErrorMessages: {
        400: "Invalid symbol provided",
        404: "Price not found",
        500: "Price service temporarily unavailable",
      },
    }
  );
};

// Get Book Ticker
export const getBookTicker = async (symbol?: string) => {
  const endpoint = symbol
    ? `binance/api/Binance/book-ticker/${symbol}`
    : `binance/api/Binance/book-tickers`;

  return apiFetcher<{
    symbol: string;
    bidPrice: string;
    bidQty: string;
    askPrice: string;
    askQty: string;
  }[]>(
    endpoint,
    {
      method: "GET",
      fallbackErrorMessages: {
        400: "Invalid symbol provided",
        404: "Book ticker not found",
        500: "Book ticker service temporarily unavailable",
      },
    }
  );
};
