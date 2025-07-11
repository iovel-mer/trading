"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Shield,
  Zap,
  Globe,
  Users,
  TrendingUp,
  Lock,
  Smartphone,
  Clock,
  DollarSign,
  ChevronDown,
  Menu,
  X,
  Star,
  Check,
  Bitcoin,
  Banknote,
  Wallet,
  LineChart,
  Bot,
  Coins,
  Key,
} from "lucide-react";
import Footer from "../components/Footer/Footer";
import {
  getTradingPairs,
  getTicker,
  getAllTickers,
  get24hrTickerStats,
  getPrice,
  getOrderBook,
  getRecentTrades,
  getExchangeInfo,
} from "@/app/api/binance/getBinance";
import type {
  TradingPair as BinanceTradingPair,
  Ticker as BinanceTicker,
} from "@/app/api/types/binance";
import ModernTradingAnimation from "./Animation/Animation";
import UltraModernTradingInterface from "./Animation/Animation";
import RealisticTradingPlatform from "./Animation/Animation";

const modalContent = {
  terms: {
    title: "Terms of Service",
    content: `
        <h3>1. Acceptance of Terms</h3>
        <p>By accessing and using SalesVault, you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h3>2. Trading Services</h3>
        <p>SalesVault provides cryptocurrency trading services. All trades are executed at your own risk.</p>
        
        <h3>3. Account Security</h3>
        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
        
        <h3>4. Risk Disclosure</h3>
        <p>Cryptocurrency trading involves substantial risk of loss and is not suitable for all investors. Past performance is not indicative of future results.</p>
        
        <h3>5. Fees and Charges</h3>
        <p>Trading fees apply to all transactions. Fee schedules are available on our website and may be updated from time to time.</p>
        
        <h3>6. Prohibited Activities</h3>
        <p>Users may not engage in market manipulation, money laundering, or any other illegal activities on our platform.</p>
        
        <h3>7. Limitation of Liability</h3>
        <p>SalesVault shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</p>
        
        <h3>8. Termination</h3>
        <p>We reserve the right to terminate or suspend your account at any time for violation of these terms.</p>
      `,
  },
  privacy: {
    title: "Privacy Policy",
    content: `
        <h3>1. Information We Collect</h3>
        <p>We collect information you provide directly to us, such as when you create an account, make trades, or contact us for support.</p>
        
        <h3>2. How We Use Your Information</h3>
        <p>We use your information to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
        
        <h3>3. Information Sharing</h3>
        <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
        
        <h3>4. Data Security</h3>
        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        
        <h3>5. Cookies and Tracking</h3>
        <p>We use cookies and similar technologies to enhance your experience, analyze usage patterns, and personalize content.</p>
        
        <h3>6. Data Retention</h3>
        <p>We retain your information for as long as necessary to provide services and comply with legal obligations.</p>
        
        <h3>7. Your Rights</h3>
        <p>You have the right to access, update, or delete your personal information. Contact us to exercise these rights.</p>
        
        <h3>8. International Transfers</h3>
        <p>Your information may be transferred to and processed in countries other than your own, subject to appropriate safeguards.</p>
      `,
  },
  cookies: {
    title: "Cookie Policy",
    content: `
        <h3>1. What Are Cookies</h3>
        <p>Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience.</p>
        
        <h3>2. Types of Cookies We Use</h3>
        <p><strong>Essential Cookies:</strong> Required for the website to function properly, including authentication and security features.</p>
        <p><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website by collecting anonymous information.</p>
        <p><strong>Functional Cookies:</strong> Enable enhanced functionality and personalization, such as remembering your preferences.</p>
        <p><strong>Marketing Cookies:</strong> Used to track visitors across websites to display relevant advertisements.</p>
        
        <h3>3. Third-Party Cookies</h3>
        <p>We may use third-party services that set cookies on your device, including Google Analytics and advertising partners.</p>
        
        <h3>4. Managing Cookies</h3>
        <p>You can control cookies through your browser settings. However, disabling certain cookies may affect website functionality.</p>
        
        <h3>5. Cookie Consent</h3>
        <p>By continuing to use our website, you consent to our use of cookies as described in this policy.</p>
        
        <h3>6. Updates to This Policy</h3>
        <p>We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated revision date.</p>
      `,
  },
};

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Live market data states
  type MarketData = {
    symbol: string;
    price: number;
    change: number;
    volume: string;
  };
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  type TradingPair = { base: string; quote: string; volume: string };
  const [tradingPairs, setTradingPairs] = useState<TradingPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    // Close mobile menu if open
    setMobileMenuOpen(false);
  };

  // Fetch initial market data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Fetch popular trading pairs
        const pairsResponse = await getTradingPairs("", 6, 0);
        const pairs = pairsResponse.success ? pairsResponse.data || [] : [];

        // Get ticker data for popular pairs
        const popularSymbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT"];
        const tickerPromises = popularSymbols.map(async (symbol) => {
          try {
            const response = await getTicker(symbol);
            return response.success ? response.data : null;
          } catch (err) {
            console.warn(`Failed to fetch ticker for ${symbol}:`, err);
            return null;
          }
        });

        const tickers = await Promise.all(tickerPromises);
        const validTickers = tickers.filter(
          (ticker): ticker is BinanceTicker =>
            ticker !== null && ticker !== undefined
        );

        // Transform ticker data for display
        const transformedMarketData = validTickers.map((ticker) => ({
          symbol: ticker.symbol.replace("USDT", ""),
          price: parseFloat(ticker.lastPrice),
          change: parseFloat(ticker.priceChangePercent),
          volume: ticker.quoteVolume,
        }));

        // Transform pairs data for trading pairs section
        const transformedPairs = pairs
          .slice(0, 6)
          .map((pair: BinanceTradingPair, index: number) => {
            // Use deterministic volume based on index to avoid hydration mismatch
            const seed = index * 98765;
            const volume =
              (((seed * 9301 + 49297) % 233280) / 233280) * 1000000000;
            return {
              base: pair.baseAsset,
              quote: pair.quoteAsset,
              volume: formatVolume(volume), // Deterministic volume formatting
            };
          });

        setMarketData(transformedMarketData);
        setTradingPairs(transformedPairs);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch market data:", err);
        setError("Failed to load market data");

        // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Update market data periodically
  useEffect(() => {
    if (marketData.length === 0) return;

    const interval = setInterval(async () => {
      try {
        const symbols = marketData.map((coin) => `${coin.symbol}USDT`);
        const tickerPromises = symbols.map(async (symbol) => {
          try {
            const response = await getTicker(symbol);
            return response.success ? response.data : null;
          } catch (err) {
            console.warn(`Failed to fetch ticker for ${symbol}:`, err);
            return null;
          }
        });

        const tickers = await Promise.all(tickerPromises);
        const validTickers = tickers.filter(
          (ticker): ticker is BinanceTicker =>
            ticker !== null && ticker !== undefined
        );

        if (validTickers.length > 0) {
          const updatedMarketData = validTickers.map((ticker) => ({
            symbol: ticker.symbol.replace("USDT", ""),
            price: parseFloat(ticker.lastPrice),
            change: parseFloat(ticker.priceChangePercent),
            volume: ticker.quoteVolume,
          }));

          setMarketData(updatedMarketData);
        }
      } catch (err) {
        console.warn("Failed to update market data:", err);
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [marketData]);

  // Helper function to format volume
  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(1)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`;
    return volume.toFixed(0);
  };

  // Helper function to format price
  const formatPrice = (price: number) => {
    if (price >= 1000) return price.toFixed(2);
    if (price >= 1) return price.toFixed(4);
    return price.toFixed(6);
  };

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Trading Tools",
      description:
        "Professional charting, technical indicators, and real-time market data",
      image:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Bank-Grade Security",
      description:
        "Multi-signature wallets, 2FA, and cold storage for maximum protection",
      image:
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast Execution",
      description:
        "Ultra-low latency matching engine processing millions of orders per second",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Markets Access",
      description:
        "Trade 500+ cryptocurrencies across spot and futures markets",
      image:
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
    },
  ];

  const plans = [
    {
      name: "Starter",
      price: "Free",
      features: [
        "Spot Trading",
        "Basic Charts",
        "Mobile App",
        "Email Support",
        "0.1% Trading Fee",
      ],
    },
    {
      name: "Pro",
      price: "$29",
      popular: true,
      features: [
        "Everything in Starter",
        "Futures Trading (10x)",
        "Advanced Charts",
        "API Access",
        "Priority Support",
        "0.075% Trading Fee",
      ],
    },
    {
      name: "Enterprise",
      price: "$99",
      features: [
        "Everything in Pro",
        "Futures Trading (100x)",
        "Custom Trading Bots",
        "Dedicated Manager",
        "VIP Support",
        "0.05% Trading Fee",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black to-black" />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => {
          // Use deterministic values based on index to avoid hydration mismatch
          const seed = i * 12345; // Simple seed for deterministic randomness
          const x1 = (((seed * 9301 + 49297) % 233280) / 233280) * 1200;
          const y1 = ((((seed + 1) * 9301 + 49297) % 233280) / 233280) * 800;
          const x2 = ((((seed + 2) * 9301 + 49297) % 233280) / 233280) * 1200;
          const y2 = ((((seed + 3) * 9301 + 49297) % 233280) / 233280) * 800;
          const duration =
            20 + (((seed * 9301 + 49297) % 233280) / 233280) * 20;

          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-500/30 rounded-full"
              initial={{
                x: x1,
                y: y1,
              }}
              animate={{
                x: x2,
                y: y2,
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          );
        })}
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black/90 backdrop-blur-xl border-b border-gray-800"
            : ""
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center"
              >
                <Image
                  src="/Vector.png"
                  alt="SalesVault"
                  width={30}
                  height={30}
                />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SalesVault
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {[
                { name: "Markets", id: "markets" },
                { name: "Trade", id: "hero" },
                { name: "Futures", id: "features" },
                { name: "Earn", id: "pricing" },
                { name: "Learn", id: "security" },
              ].map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  {item.name}
                </motion.button>
              ))}
            </div>

            <div className="hidden lg:flex items-center space-x-4">
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Log In
                </motion.button>
              </Link>
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium"
                >
                  Get Started
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-gray-800"
            >
              <div className="container mx-auto px-6 py-4 space-y-4">
                {[
                  { name: "Markets", id: "markets" },
                  { name: "Trade", id: "hero" },
                  { name: "Futures", id: "features" },
                  { name: "Earn", id: "pricing" },
                  { name: "Learn", id: "security" },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.id)}
                    className="block text-gray-300 hover:text-white transition-colors py-2 w-full text-left"
                  >
                    {item.name}
                  </button>
                ))}
                <div className="pt-4 space-y-2">
                  <Link href="/login" className="block">
                    <button className="w-full px-6 py-2 border border-gray-700 rounded-lg">
                      Log In
                    </button>
                  </Link>
                  <Link href="/register" className="block">
                    <button className="w-full px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                      Get Started
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center px-6 pt-20"
      >
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                Trade Crypto
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Like a Pro
                </span>
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Experience the future of cryptocurrency trading with advanced
                tools, lightning-fast execution, and institutional-grade
                security.
              </p>

              {/* Live Market Ticker */}
              <div className="mb-8 p-4 bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800">
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-gray-400">
                      Loading market data...
                    </span>
                  </div>
                ) : error ? (
                  <div className="text-center py-4 text-red-400">{error}</div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {marketData.slice(0, 4).map((coin, i) => (
                      <motion.div
                        key={coin.symbol}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <Bitcoin className="w-5 h-5 text-yellow-500" />
                          <span className="font-medium">{coin.symbol}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-mono">
                            ${formatPrice(coin.price)}
                          </div>
                          <div
                            className={`text-sm ${
                              coin.change >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {coin.change >= 0 ? "+" : ""}
                            {coin.change.toFixed(2)}%
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-medium text-lg flex items-center justify-center space-x-2 w-full sm:w-auto"
                  >
                    <span>Start Trading Now</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            <RealisticTradingPlatform />
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={() => scrollToSection("stats")}
        >
          <ChevronDown className="w-8 h-8 text-gray-400 hover:text-white transition-colors" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-6 relative">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { value: "$2.8B+", label: "Daily Trading Volume" },
              { value: "500K+", label: "Active Traders" },
              { value: "180+", label: "Countries Supported" },
              { value: "0.05%", label: "Lowest Fees" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-400 mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 relative">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Everything You Need to
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Trade Successfully
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Professional trading tools, real-time data, and advanced features
              designed for both beginners and experts
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Feature Showcase */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  whileHover={{ x: 10 }}
                  onClick={() => setActiveFeature(i)}
                  className={`p-6 rounded-xl cursor-pointer transition-all ${
                    activeFeature === i
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/50"
                      : "bg-gray-900/50 border border-gray-800 hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-lg ${
                        activeFeature === i
                          ? "bg-gradient-to-r from-blue-500 to-purple-500"
                          : "bg-gray-800"
                      }`}
                    >
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Feature Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[600px] rounded-2xl overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeFeature}
                  src={features[activeFeature].image}
                  alt={features[activeFeature].title}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trading Pairs */}
      <section id="markets" className="py-20 px-6 relative">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Trade Top Cryptocurrencies
            </h2>
            <p className="text-xl text-gray-400">
              Access the most liquid markets with tight spreads
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tradingPairs.map((pair, i) => (
              <motion.div
                key={`${pair.base}/${pair.quote}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Coins className="w-10 h-10 text-yellow-500" />
                    <div>
                      <div className="font-semibold text-lg">
                        {pair.base}/{pair.quote}
                      </div>
                      <div className="text-sm text-gray-400">24h Volume</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">${pair.volume}</div>
                  </div>
                </div>
                <Link href="/register">
                  <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                    Trade Now
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />

        <div className="container mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Your Security is Our
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Top Priority
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                We employ industry-leading security measures to ensure your
                funds and data remain safe at all times.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: <Shield />,
                    title: "Cold Storage",
                    desc: "95% of funds stored offline",
                  },
                  {
                    icon: <Lock />,
                    title: "Multi-Sig Wallets",
                    desc: "Multiple signatures required",
                  },
                  {
                    icon: <Smartphone />,
                    title: "2FA Protection",
                    desc: "Two-factor authentication",
                  },
                  {
                    icon: <Bot />,
                    title: "AI Monitoring",
                    desc: "24/7 threat detection",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-400">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative w-full h-[500px]">
                {/* Security Shield Animation */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-80 h-80 rounded-full border border-blue-500/20" />
                  <div className="absolute w-60 h-60 rounded-full border border-purple-500/20" />
                  <div className="absolute w-40 h-40 rounded-full border border-pink-500/20" />

                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute"
                  >
                    <Shield className="w-20 h-20 text-blue-400" />
                  </motion.div>
                </motion.div>

                {/* Floating Security Icons */}
                {[Lock, Key, Shield, Smartphone].map((Icon, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [-20, 20, -20],
                      x: [-10, 10, -10],
                    }}
                    transition={{
                      duration: 4 + i,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                    className={`absolute ${
                      i === 0
                        ? "top-10 left-10"
                        : i === 1
                        ? "top-10 right-10"
                        : i === 2
                        ? "bottom-10 left-10"
                        : "bottom-10 right-10"
                    }`}
                  >
                    <Icon className="w-8 h-8 text-gray-600" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 px-6 relative">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-12 lg:p-20 rounded-3xl overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
            <div className="absolute inset-0 bg-black/20" />

            {/* Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
                  backgroundSize: "40px 40px",
                }}
              />
            </div>

            <div className="relative text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl lg:text-6xl font-bold mb-6"
              >
                Ready to Start Trading?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-xl lg:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto"
              >
                Join over 500,000 traders who trust our platform for their
                cryptocurrency trading needs
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white text-black rounded-xl font-medium text-lg hover:bg-gray-100 transition-colors"
                  >
                    Create Free Account
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex items-center justify-center space-x-6 text-sm"
              >
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Start trading in minutes</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="py-20 px-6 border-t border-gray-800">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <LineChart className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold">SalesVault</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-sm">
                The most trusted cryptocurrency trading platform with advanced
                tools and security.
              </p>
              <div className="flex space-x-4">
                {["Twitter", "Discord", "Telegram", "GitHub"].map((social) => (
                  <motion.a
                    key={social}
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <Star className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {[
              {
                title: "Products",
                links: [
                  "Spot Trading",
                  "Futures Trading",
                  "Options",
                  "Staking",
                ],
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Security"],
              },
              {
                title: "Support",
                links: ["Help Center", "Contact Us"],
              },
            ].map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">
                © 2024 SalesVault. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer> */}
      <Footer />
    </div>
  );
};

export default LandingPage;
