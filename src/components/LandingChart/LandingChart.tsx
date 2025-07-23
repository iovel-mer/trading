'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface TradingChartProps {
  symbol: string;
}

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

declare global {
  interface Window {
    LightweightCharts: any;
  }
}

export function CustomTradingChart({ symbol }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [libraryLoaded, setLibraryLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const pollingInterval = 5000;

  useEffect(() => {
    const loadLibrary = () => {
      if (window.LightweightCharts) {
        setLibraryLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src =
        'https://unpkg.com/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js';
      script.async = true;

      script.onload = () => {
        setLibraryLoaded(true);
      };

      script.onerror = () => {
        console.error('Failed to load TradingView library');
        setError('Failed to load charting library');
      };

      document.head.appendChild(script);
    };

    loadLibrary();
  }, []);

  const fetchChartData = useCallback(
    async (symbol: string, isPollingUpdate = false) => {
      try {
        if (!isPollingUpdate) {
          setIsLoading(true);
        }
        setError(null);

        const cleanSymbol = symbol.replace('/', '');
        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${cleanSymbol}&interval=1h&limit=100`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rawData = await response.json();

        const data: CandleData[] = rawData.map((kline: any[]) => ({
          time: Math.floor(kline[0] / 1000),
          open: Number.parseFloat(kline[1]),
          high: Number.parseFloat(kline[2]),
          low: Number.parseFloat(kline[3]),
          close: Number.parseFloat(kline[4]),
          volume: Number.parseFloat(kline[5]),
        }));

        if (!data || !Array.isArray(data) || data.length === 0) {
          throw new Error('No valid candle data received from API');
        }

        const candleData = data
          .map(candle => ({
            time: candle.time,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
          }))
          .sort((a, b) => a.time - b.time);

        // Calculate price change
        if (candleData.length >= 2) {
          const latest = candleData[candleData.length - 1];
          const previous = candleData[candleData.length - 2];
          setCurrentPrice(latest.close);
          setPriceChange(latest.close - previous.close);
        }

        setChartData(candleData);
        setLastUpdateTime(new Date());

        if (!isPollingUpdate) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
        setError(
          error instanceof Error ? error.message : 'Failed to fetch data'
        );
        if (!isPollingUpdate) {
          setIsLoading(false);
        }
      }
    },
    []
  );

  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    setIsPolling(true);
    pollingIntervalRef.current = setInterval(() => {
      if (symbol) {
        fetchChartData(symbol, true);
      }
    }, pollingInterval);
  }, [symbol, pollingInterval, fetchChartData]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleRefresh = () => {
    if (symbol) {
      fetchChartData(symbol, false);
    }
  };

  useEffect(() => {
    if (
      !chartContainerRef.current ||
      !libraryLoaded ||
      !window.LightweightCharts
    )
      return;

    try {
      const chart = window.LightweightCharts.createChart(
        chartContainerRef.current,
        {
          layout: {
            background: {
              type: window.LightweightCharts.ColorType.Solid,
              color: '#0a0a0a',
            },
            textColor: '#d1d4dc',
          },
          grid: {
            vertLines: { color: '#1a1a1a' },
            horzLines: { color: '#1a1a1a' },
          },
          crosshair: {
            mode: window.LightweightCharts.CrosshairMode.Normal,
          },
          rightPriceScale: {
            borderColor: '#2a2a2a',
            textColor: '#d1d4dc',
          },
          timeScale: {
            borderColor: '#2a2a2a',
            textColor: '#d1d4dc',
            timeVisible: true,
            secondsVisible: false,
          },
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        }
      );

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#00d4aa',
        downColor: '#ff4976',
        borderVisible: false,
        wickUpColor: '#00d4aa',
        wickDownColor: '#ff4976',
      });

      chartRef.current = chart;
      candlestickSeriesRef.current = candlestickSeries;

      const handleResize = () => {
        if (chartContainerRef.current && chart) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chart) {
          chart.remove();
        }
      };
    } catch (err) {
      console.error('Error initializing chart:', err);
      setError(`Failed to initialize chart: ${err}`);
    }
  }, [libraryLoaded]);

  useEffect(() => {
    if (symbol && libraryLoaded && chartRef.current) {
      stopPolling();
      fetchChartData(symbol, false);
      setTimeout(() => {
        startPolling();
      }, 1000);
    }
  }, [symbol, libraryLoaded, fetchChartData, startPolling, stopPolling]);

  useEffect(() => {
    if (chartData.length > 0 && candlestickSeriesRef.current) {
      try {
        candlestickSeriesRef.current.setData(chartData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error setting chart data:', error);
        setError(`Failed to render chart data: ${(error as Error).message}`);
      }
    }
  }, [chartData]);

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  if (!libraryLoaded) {
    return (
      <Card className='w-full'>
        <CardContent className='flex items-center justify-center h-96'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
            <div className='text-lg font-medium text-gray-300'>
              Loading Chart Library...
            </div>
            <div className='text-sm text-gray-500 mt-2'>
              Initializing TradingView...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className='w-full'>
        <CardContent className='flex items-center justify-center h-96'>
          <div className='text-center'>
            <div className='text-red-500 font-medium text-lg mb-2'>
              ⚠️ Chart Error
            </div>
            <div className='text-gray-400 text-sm mb-4'>{error}</div>
            <Button
              onClick={handleRefresh}
              className='bg-blue-600 hover:bg-blue-700'
            >
              <RefreshCw className='h-4 w-4 mr-2' />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'w-full'}`}
    >
      <Card className='w-full h-full border-gray-800 bg-gray-950'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <CardTitle className='text-xl font-bold text-white'>
                {symbol} Chart
              </CardTitle>
              {currentPrice && (
                <div className='flex items-center space-x-2'>
                  <span className='text-2xl font-bold text-white'>
                    {formatPrice(currentPrice)}
                  </span>
                  {priceChange !== null && (
                    <Badge
                      variant={priceChange >= 0 ? 'default' : 'destructive'}
                      className={`${
                        priceChange >= 0
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}
                    >
                      {priceChange >= 0 ? (
                        <TrendingUp className='h-3 w-3 mr-1' />
                      ) : (
                        <TrendingDown className='h-3 w-3 mr-1' />
                      )}
                      {priceChange >= 0 ? '+' : ''}
                      {formatPrice(Math.abs(priceChange))}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <div className='flex items-center space-x-2'>
              {isPolling && (
                <Badge
                  variant='outline'
                  className='bg-green-500/10 text-green-400 border-green-500/30'
                >
                  <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2'></div>
                  Live
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='relative'>
            {isLoading && (
              <div className='absolute inset-0 bg-black/80 flex items-center justify-center z-20 rounded-lg'>
                <div className='text-center'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3'></div>
                  <div className='text-gray-400'>Loading chart data...</div>
                </div>
              </div>
            )}

            <div
              ref={chartContainerRef}
              className={`w-full rounded-lg ${
                isFullscreen
                  ? 'h-screen'
                  : 'h-[70vh] min-h-[500px] max-h-[800px]'
              }`}
            />

            {lastUpdateTime && (
              <div className='absolute bottom-4 left-4 text-xs text-gray-400 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700'>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                  <span>
                    Last update: {lastUpdateTime.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
