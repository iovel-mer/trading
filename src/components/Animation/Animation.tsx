import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
    <div className="w-full h-[600px] bg-gray-900 flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 1000 400">
        {/* Simple grid background */}
        <defs>
          <pattern
            id="grid"
            width="50"
            height="25"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 25"
              fill="none"
              stroke="#374151"
              strokeWidth="0.5"
              opacity="0.2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Candlesticks flowing left to right */}
        {candleData.map((candle, i) => {
          const x = i * 40 + 50;
          const isGreen = candle.close > candle.open;

          // Normalize prices for display
          const priceRange =
            Math.max(...candleData.map((c) => c.high)) -
            Math.min(...candleData.map((c) => c.low));
          const minPrice = Math.min(...candleData.map((c) => c.low));

          const high = 350 - ((candle.high - minPrice) / priceRange) * 300;
          const low = 350 - ((candle.low - minPrice) / priceRange) * 300;
          const openY = 350 - ((candle.open - minPrice) / priceRange) * 300;
          const closeY = 350 - ((candle.close - minPrice) / priceRange) * 300;
          const bodyTop = Math.min(openY, closeY);
          const bodyHeight = Math.abs(closeY - openY);

          return (
            <motion.g
              key={candle.id}
              initial={{ x: 1000, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
              }}
            >
              {/* Candlestick Wick */}
              <motion.line
                x1={x}
                y1={high}
                x2={x}
                y2={low}
                stroke={isGreen ? "#10B981" : "#EF4444"}
                strokeWidth="2"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              />

              {/* Candlestick Body */}
              <motion.rect
                x={x - 12}
                y={bodyTop}
                width="24"
                height={Math.max(bodyHeight, 2)}
                fill={isGreen ? "#10B981" : "#EF4444"}
                stroke={isGreen ? "#059669" : "#DC2626"}
                strokeWidth="1"
                initial={{ scaleY: 0, y: 350 }}
                animate={{ scaleY: 1, y: bodyTop }}
                transition={{ delay: 0.5, duration: 0.5 }}
              />
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
};

export default SimpleCandlestickAnimation;
