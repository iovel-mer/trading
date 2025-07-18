'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

const BTCTradingChart = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number | null>(null);
  const [chartData, setChartData] = useState<CandleData[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const POLLING_INTERVAL = 5000;
  const BACKGROUND_POLLING_INTERVAL = 5000;

  const fetchBTCData = useCallback(
    async (isBackgroundUpdate = false): Promise<CandleData[]> => {
      try {
        if (!isBackgroundUpdate) {
          setIsLoading(true);
        }

        const response = await fetch(
          'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=48'
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('No data received from API');
        }

        const candlestickData: CandleData[] = data.map((kline: any[]) => ({
          time: Math.floor(kline[0] / 1000),
          open: Number.parseFloat(kline[1]),
          high: Number.parseFloat(kline[2]),
          low: Number.parseFloat(kline[3]),
          close: Number.parseFloat(kline[4]),
        }));

        if (candlestickData.length >= 2) {
          const current = candlestickData[candlestickData.length - 1].close;
          const previous = candlestickData[candlestickData.length - 2].close;
          setLastPrice(current);
          setPriceChange(((current - previous) / previous) * 100);
        }

        setChartData(candlestickData);
        setLastUpdateTime(new Date());
        setError(null);

        if (!isBackgroundUpdate) {
          setIsLoading(false);
        }

        return candlestickData;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load chart data';
        setError(errorMessage);

        if (!isBackgroundUpdate) {
          setIsLoading(false);
        }

        return [];
      }
    },
    []
  );

  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    setIsPolling(true);

    const getPollingInterval = () => {
      return document.hidden ? BACKGROUND_POLLING_INTERVAL : POLLING_INTERVAL;
    };

    const poll = () => {
      fetchBTCData(true);

      pollingIntervalRef.current = setTimeout(() => {
        poll();
      }, getPollingInterval());
    };

    poll();
  }, [fetchBTCData, POLLING_INTERVAL, BACKGROUND_POLLING_INTERVAL]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearTimeout(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isPolling) {
        stopPolling();
        startPolling();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPolling, startPolling, stopPolling]);

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx || chartData.length === 0) {
      return;
    }

    setIsDrawing(true);

    try {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const width = rect.width || 800;
      const height = rect.height || 400;

      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const padding = 60;
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;

      ctx.fillStyle = '#1F2937';
      ctx.fillRect(0, 0, width, height);

      const prices = chartData.flatMap(d => [d.high, d.low]);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const priceRange = maxPrice - minPrice || 1;

      ctx.strokeStyle = 'rgba(75, 85, 99, 0.2)';
      ctx.lineWidth = 1;

      for (let i = 0; i <= 5; i++) {
        const y = padding + (i * chartHeight) / 5;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();

        const price = maxPrice - (i * priceRange) / 5;
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '12px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(
          `$${Math.round(price).toLocaleString()}`,
          padding - 10,
          y + 4
        );
      }

      const timeStep = Math.max(1, Math.floor(chartData.length / 8));
      for (let i = 0; i < chartData.length; i += timeStep) {
        const x = padding + (i * chartWidth) / (chartData.length - 1);
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
      }

      const candleSpacing = chartWidth / Math.max(chartData.length - 1, 1);
      const candleWidth = Math.max(2, candleSpacing * 0.8);

      chartData.forEach((candle, index) => {
        const x =
          padding + (index * chartWidth) / Math.max(chartData.length - 1, 1);

        const openY =
          height -
          padding -
          ((candle.open - minPrice) / priceRange) * chartHeight;
        const closeY =
          height -
          padding -
          ((candle.close - minPrice) / priceRange) * chartHeight;
        const highY =
          height -
          padding -
          ((candle.high - minPrice) / priceRange) * chartHeight;
        const lowY =
          height -
          padding -
          ((candle.low - minPrice) / priceRange) * chartHeight;

        const isGreen = candle.close >= candle.open;
        const color = isGreen ? '#10B981' : '#EF4444';

        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();

        ctx.fillStyle = color;
        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.max(Math.abs(closeY - openY), 1);
        const bodyLeft = x - candleWidth / 2;

        ctx.fillRect(bodyLeft, bodyTop, candleWidth, bodyHeight);

        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.strokeRect(bodyLeft, bodyTop, candleWidth, bodyHeight);
      });

      if (lastPrice) {
        const currentPriceY =
          height -
          padding -
          ((lastPrice - minPrice) / priceRange) * chartHeight;
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(padding, currentPriceY);
        ctx.lineTo(width - padding, currentPriceY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#3B82F6';
        ctx.fillRect(width - padding - 100, currentPriceY - 12, 95, 24);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          `$${Math.round(lastPrice).toLocaleString()}`,
          width - padding - 52,
          currentPriceY + 4
        );
      }

      if (isPolling) {
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(width - 20, 20, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    } catch (err) {
      console.error('Error drawing chart:', err);
    } finally {
      setIsDrawing(false);
    }
  }, [chartData, lastPrice, isPolling]);

  const initializeChart = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await fetchBTCData(false);
      setIsLoading(false);

      startPolling();
    } catch (err) {
      setError('Failed to load chart data');
      setIsLoading(false);
    }
  }, [fetchBTCData, startPolling]);

  useEffect(() => {
    if (chartData.length > 0 && !isLoading) {
      setTimeout(drawChart, 100);
    }
  }, [chartData, drawChart, isLoading]);

  useEffect(() => {
    const timer = setTimeout(initializeChart, 500);
    return () => clearTimeout(timer);
  }, [initializeChart]);

  useEffect(() => {
    const handleResize = () => {
      if (chartData.length > 0) {
        setTimeout(drawChart, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawChart, chartData]);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  const handleRefresh = useCallback(() => {
    fetchBTCData(false);
  }, [fetchBTCData]);

  if (error) {
    return (
      <div className='w-full h-full flex items-center justify-center bg-gray-900/50 rounded-xl border border-gray-800'>
        <div className='text-center p-6'>
          <div className='text-red-400 mb-2 text-lg'>⚠️ Chart Error</div>
          <div className='text-gray-400 text-sm mb-4'>{error}</div>
          <button
            onClick={() => {
              setError(null);
              initializeChart();
            }}
            className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='relative w-full h-full bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden'>
      {isLoading && (
        <div className='absolute inset-0 bg-gray-900/80 flex items-center justify-center z-20'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3'></div>
            <div className='text-gray-400'>Loading BTC Chart...</div>
            <div className='text-xs text-gray-500 mt-1'>
              Fetching market data...
            </div>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className='w-full h-full'
        style={{ minHeight: '400px' }}
      >
        <canvas
          ref={canvasRef}
          className='w-full h-full block'
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
          }}
        />
      </div>

      {isPolling && lastUpdateTime && (
        <div className='absolute bottom-2 left-2 text-xs text-gray-500 bg-black/30 backdrop-blur-sm rounded px-2 py-1'>
          Last update: {lastUpdateTime.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default BTCTradingChart;
