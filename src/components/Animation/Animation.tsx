import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BTCTradingChart, {
  CustomTradingChart,
} from '../LandingChart/LandingChart';

type Candle = {
  id: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

const SimpleCandlestickAnimation = () => {
  const [candleData, setCandleData] = useState<Candle[]>([]);

  // Initialize and continuously add candlesticks
  useEffect(() => {
    // Generate initial candlestick data
    const generateCandleData = () => {
      const candles = [];
      let basePrice = 43200;

      for (let i = 0; i < 20; i++) {
        const volatility = 0.02;
        const change = (Math.random() - 0.5) * volatility;
        const open = basePrice;
        const close = basePrice * (1 + change);
        const high = Math.max(open, close) * (1 + Math.random() * 0.01);
        const low = Math.min(open, close) * (1 - Math.random() * 0.01);

        candles.push({
          id: i,
          open,
          high,
          low,
          close,
        });

        basePrice = close;
      }
      return candles;
    };

    setCandleData(generateCandleData());

    // Add new candles continuously
    const interval = setInterval(() => {
      setCandleData((prev: any) => {
        const lastCandle = prev[prev.length - 1];
        const volatility = 0.015;
        const change = (Math.random() - 0.5) * volatility;
        const open = lastCandle.close;
        const close = open * (1 + change);
        const high = Math.max(open, close) * (1 + Math.random() * 0.008);
        const low = Math.min(open, close) * (1 - Math.random() * 0.008);

        const newCandle = {
          id: Date.now(),
          open,
          high,
          low,
          close,
        };

        // Keep only the last 25 candles and add new one
        return [...prev.slice(-24), newCandle];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='w-full h-[600px] bg-gray-900 flex items-center justify-center'>
      <CustomTradingChart symbol='BTC/USDT' />
    </div>
  );
};

export default SimpleCandlestickAnimation;
