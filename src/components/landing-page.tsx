'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Shield,
  Zap,
  Globe,
  Lock,
  Smartphone,
  ChevronDown,
  Menu,
  X,
  Check,
  Bitcoin,
  Bot,
  Coins,
  Key,
} from 'lucide-react';
import Footer from '../components/Footer/Footer';
import { getTradingPairs, getTicker } from '@/app/api/binance/getBinance';
import type {
  TradingPair as BinanceTradingPair,
  Ticker as BinanceTicker,
} from '@/app/api/types/binance';
import RealisticTradingPlatform from './Animation/Animation';
import { MainHeader } from './main-header';
import { useLocale, useTranslations } from 'next-intl';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const tNavbar = useTranslations('navbar');
  const tHero = useTranslations('hero');
  const tStats = useTranslations('stats');
  const tFeatures = useTranslations('features');
  const tMarkets = useTranslations('markets');
  const tSecurity = useTranslations('security');
  const tCta = useTranslations('cta');

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
  const locale = useLocale();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const pairsResponse = await getTradingPairs('', 6, 0);
        const pairs = pairsResponse.success ? pairsResponse.data || [] : [];

        const popularSymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT'];
        const tickerPromises = popularSymbols.map(async symbol => {
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

        const transformedMarketData = validTickers.map(ticker => ({
          symbol: ticker.symbol.replace('USDT', ''),
          price: Number.parseFloat(ticker.lastPrice),
          change: Number.parseFloat(ticker.priceChangePercent),
          volume: ticker.quoteVolume,
        }));

        const transformedPairs = pairs
          .slice(0, 6)
          .map((pair: BinanceTradingPair, index: number) => {
            const seed = index * 98765;
            const volume =
              (((seed * 9301 + 49297) % 233280) / 233280) * 1000000000;
            return {
              base: pair.baseAsset,
              quote: pair.quoteAsset,
              volume: formatVolume(volume),
            };
          });

        setMarketData(transformedMarketData);
        setTradingPairs(transformedPairs);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch market data:', err);
        setError(tHero('loadingError'));
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [tHero]);

  useEffect(() => {
    if (marketData.length === 0) return;

    const interval = setInterval(async () => {
      try {
        const symbols = marketData.map(coin => `${coin.symbol}USDT`);
        const tickerPromises = symbols.map(async symbol => {
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
          const updatedMarketData = validTickers.map(ticker => ({
            symbol: ticker.symbol.replace('USDT', ''),
            price: Number.parseFloat(ticker.lastPrice),
            change: Number.parseFloat(ticker.priceChangePercent),
            volume: ticker.quoteVolume,
          }));
          setMarketData(updatedMarketData);
        }
      } catch (err) {
        console.warn('Failed to update market data:', err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [marketData]);

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(1)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`;
    return volume.toFixed(0);
  };

  const formatPrice = (price: number) => {
    if (price >= 1000) return price.toFixed(2);
    if (price >= 1) return price.toFixed(4);
    return price.toFixed(6);
  };

  const features = [
    {
      icon: <BarChart3 className='w-8 h-8' />,
      title: tFeatures('advancedTools'),
      description: tFeatures('advancedToolsDesc'),
      image:
        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    },
    {
      icon: <Shield className='w-8 h-8' />,
      title: tFeatures('bankSecurity'),
      description: tFeatures('bankSecurityDesc'),
      image:
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    },
    {
      icon: <Zap className='w-8 h-8' />,
      title: tFeatures('fastExecution'),
      description: tFeatures('fastExecutionDesc'),
      image:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    },
    {
      icon: <Globe className='w-8 h-8' />,
      title: tFeatures('globalAccess'),
      description: tFeatures('globalAccessDesc'),
      image:
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
    },
  ];

  const navigationItems = [
    { name: tNavbar('markets'), id: 'markets' },
    { name: tNavbar('trade'), id: 'hero' },
    { name: tNavbar('futures'), id: 'features' },
    { name: tNavbar('security'), id: 'security' },
  ];

  const statsData = [
    { value: '$2.8B+', label: tStats('dailyVolume') },
    { value: '500K+', label: tStats('activeTraders') },
    { value: '180+', label: tStats('countriesSupported') },
    { value: '0.05%', label: tStats('lowestFees') },
  ];

  const securityFeatures = [
    {
      icon: <Shield />,
      title: tSecurity('coldStorage'),
      desc: tSecurity('coldStorageDesc'),
    },
    {
      icon: <Lock />,
      title: tSecurity('multiSig'),
      desc: tSecurity('multiSigDesc'),
    },
    {
      icon: <Smartphone />,
      title: tSecurity('2fa'),
      desc: tSecurity('2faDesc'),
    },
    {
      icon: <Bot />,
      title: tSecurity('aiMonitoring'),
      desc: tSecurity('aiMonitoringDesc'),
    },
  ];

  return (
    <div className='min-h-screen bg-black text-white overflow-hidden'>
      {/* Background Effects */}
      <div className='fixed inset-0 opacity-20'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20' />
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black to-black' />
      </div>

      {/* Animated Background Particles */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        {[...Array(50)].map((_, i) => {
          const seed = i * 12345;
          const x1 = (((seed * 9301 + 49297) % 233280) / 233280) * 1200;
          const y1 = ((((seed + 1) * 9301 + 49297) % 233280) / 233280) * 800;
          const x2 = ((((seed + 2) * 9301 + 49297) % 233280) / 233280) * 1200;
          const y2 = ((((seed + 3) * 9301 + 49297) % 233280) / 233280) * 800;
          const duration =
            20 + (((seed * 9301 + 49297) % 233280) / 233280) * 20;

          return (
            <motion.div
              key={i}
              className='absolute w-1 h-1 bg-blue-500/30 rounded-full'
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
                repeat: Number.POSITIVE_INFINITY,
                ease: 'linear',
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
            ? 'bg-black/90 backdrop-blur-xl border-b border-gray-800'
            : ''
        }`}
      >
        <div className='container mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className='w-10 h-10 rounded-xl flex items-center justify-center'
              >
                <Image
                  src='/Vector.png'
                  alt='SalesVault'
                  width={30}
                  height={30}
                />
              </motion.div>
              <span className='text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                SalesVault
              </span>
            </div>

            <MainHeader />

            <div className='hidden lg:flex items-center space-x-4'>
              <Link href={`${locale}/login`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='px-6 py-2 text-gray-300 hover:text-white transition-colors'
                >
                  {tNavbar('login')}
                </motion.button>
              </Link>
              <Link href={`${locale}/register`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium'
                >
                  {tNavbar('getStarted')}
                </motion.button>
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='lg:hidden'
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='lg:hidden bg-black/95 backdrop-blur-xl border-t border-gray-800'
            >
              <div className='container mx-auto px-6 py-4 space-y-4'>
                {navigationItems.map(item => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.id)}
                    className='block text-gray-300 hover:text-white transition-colors py-2 w-full text-left'
                  >
                    {item.name}
                  </button>
                ))}
                <div className='pt-4 space-y-2'>
                  <Link href='/login' className='block'>
                    <button className='w-full px-6 py-2 border border-gray-700 rounded-lg'>
                      {tNavbar('login')}
                    </button>
                  </Link>
                  <Link href={`${locale}/register`} className='block'>
                    <button className='w-full px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg'>
                      {tNavbar('getStarted')}
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
        id='hero'
        className='relative min-h-screen flex items-center justify-center px-6 pt-20'
      >
        <div className='container mx-auto'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className='text-5xl lg:text-7xl font-bold mb-6'>
                {tHero('title')}
                <span className='block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>
                  {tHero('subtitle')}
                </span>
              </h1>
              <p className='text-xl text-gray-400 mb-8'>
                {tHero('description')}
              </p>

              <div className='mb-8 p-4 bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800'>
                {loading ? (
                  <div className='flex items-center justify-center py-4'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
                    <span className='ml-2 text-gray-400'>
                      {tHero('loading')}
                    </span>
                  </div>
                ) : error ? (
                  <div className='text-center py-4 text-red-400'>{error}</div>
                ) : (
                  <div className='grid grid-cols-2 gap-4'>
                    {marketData.slice(0, 4).map((coin, i) => (
                      <motion.div
                        key={coin.symbol}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className='flex items-center justify-between'
                      >
                        <div className='flex items-center space-x-2'>
                          <Bitcoin className='w-5 h-5 text-yellow-500' />
                          <span className='font-medium'>{coin.symbol}</span>
                        </div>
                        <div className='text-right'>
                          <div className='font-mono'>
                            ${formatPrice(coin.price)}
                          </div>
                          <div
                            className={`text-sm ${
                              coin.change >= 0
                                ? 'text-green-400'
                                : 'text-red-400'
                            }`}
                          >
                            {coin.change >= 0 ? '+' : ''}
                            {coin.change.toFixed(2)}%
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div className='flex flex-col sm:flex-row gap-4'>
                <Link href={`${locale}/register`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-medium text-lg flex items-center justify-center space-x-2 w-full sm:w-auto'
                  >
                    <span>{tHero('startTrading')}</span>
                    <ArrowRight className='w-5 h-5' />
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            <RealisticTradingPlatform />
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className='absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer'
          onClick={() => scrollToSection('stats')}
        >
          <ChevronDown className='w-8 h-8 text-gray-400 hover:text-white transition-colors' />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section id='stats' className='py-20 px-6 relative'>
        <div className='container mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='grid grid-cols-2 lg:grid-cols-4 gap-8'
          >
            {statsData.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className='text-center'
              >
                <div className='text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                  {stat.value}
                </div>
                <div className='text-gray-400 mt-2'>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='py-20 px-6 relative'>
        <div className='container mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <h2 className='text-4xl lg:text-5xl font-bold mb-4'>
              {tFeatures('title')}
              <span className='block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                {tFeatures('subtitle')}
              </span>
            </h2>
            <p className='text-xl text-gray-400 max-w-3xl mx-auto'>
              {tFeatures('description')}
            </p>
          </motion.div>

          <div className='grid lg:grid-cols-2 gap-8'>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='space-y-6'
            >
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  whileHover={{ x: 10 }}
                  onClick={() => setActiveFeature(i)}
                  className={`p-6 rounded-xl cursor-pointer transition-all ${
                    activeFeature === i
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/50'
                      : 'bg-gray-900/50 border border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className='flex items-start space-x-4'>
                    <div
                      className={`p-3 rounded-lg ${
                        activeFeature === i
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                          : 'bg-gray-800'
                      }`}
                    >
                      {feature.icon}
                    </div>
                    <div className='flex-1'>
                      <h3 className='text-xl font-semibold mb-2'>
                        {feature.title}
                      </h3>
                      <p className='text-gray-400'>{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='relative h-[600px] rounded-2xl overflow-hidden'
            >
              <AnimatePresence mode='wait'>
                <motion.img
                  key={activeFeature}
                  src={features[activeFeature].image}
                  alt={features[activeFeature].title}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className='absolute inset-0 w-full h-full object-cover'
                />
              </AnimatePresence>
              <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent' />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Markets Section */}
      <section id='markets' className='py-20 px-6 relative'>
        <div className='container mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <h2 className='text-4xl lg:text-5xl font-bold mb-4'>
              {tMarkets('title')}
            </h2>
            <p className='text-xl text-gray-400'>{tMarkets('description')}</p>
          </motion.div>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {tradingPairs.map((pair, i) => (
              <motion.div
                key={`${pair.base}/${pair.quote}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className='p-6 bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all'
              >
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center space-x-3'>
                    <Coins className='w-10 h-10 text-yellow-500' />
                    <div>
                      <div className='font-semibold text-lg'>
                        {pair.base}/{pair.quote}
                      </div>
                      <div className='text-sm text-gray-400'>
                        {tMarkets('volume24h')}
                      </div>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='text-2xl font-bold'>${pair.volume}</div>
                  </div>
                </div>
                <Link href={`${locale}/register`}>
                  <button className='w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors'>
                    {tMarkets('tradeNow')}
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id='security' className='py-20 px-6 relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10' />
        <div className='container mx-auto relative'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className='text-4xl lg:text-5xl font-bold mb-6'>
                {tSecurity('title')}
                <span className='block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                  {tSecurity('subtitle')}
                </span>
              </h2>
              <p className='text-xl text-gray-400 mb-8'>
                {tSecurity('description')}
              </p>

              <div className='space-y-6'>
                {securityFeatures.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className='flex items-start space-x-4'
                  >
                    <div className='p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg'>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className='font-semibold text-lg mb-1'>
                        {item.title}
                      </h3>
                      <p className='text-gray-400'>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='relative'
            >
              <div className='relative w-full h-[500px]'>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'linear',
                  }}
                  className='absolute inset-0 flex items-center justify-center'
                >
                  <div className='w-80 h-80 rounded-full border border-blue-500/20' />
                  <div className='absolute w-60 h-60 rounded-full border border-purple-500/20' />
                  <div className='absolute w-40 h-40 rounded-full border border-pink-500/20' />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className='absolute'
                  >
                    <Shield className='w-20 h-20 text-blue-400' />
                  </motion.div>
                </motion.div>

                {[Lock, Key, Shield, Smartphone].map((Icon, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [-20, 20, -20],
                      x: [-10, 10, -10],
                    }}
                    transition={{
                      duration: 4 + i,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.5,
                    }}
                    className={`absolute ${
                      i === 0
                        ? 'top-10 left-10'
                        : i === 1
                        ? 'top-10 right-10'
                        : i === 2
                        ? 'bottom-10 left-10'
                        : 'bottom-10 right-10'
                    }`}
                  >
                    <Icon className='w-8 h-8 text-gray-600' />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id='cta' className='py-20 px-6 relative'>
        <div className='container mx-auto'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className='relative p-12 lg:p-20 rounded-3xl overflow-hidden'
          >
            <div className='absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600' />
            <div className='absolute inset-0 bg-black/20' />
            <div className='absolute inset-0 opacity-10'>
              <div
                className='absolute inset-0'
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                }}
              />
            </div>

            <div className='relative text-center'>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className='text-4xl lg:text-6xl font-bold mb-6'
              >
                {tCta('title')}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className='text-xl lg:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto'
              >
                {tCta('description')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className='flex flex-col sm:flex-row gap-4 justify-center'
              >
                <Link href={`${locale}/register`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='px-8 py-4 bg-white text-black rounded-xl font-medium text-lg hover:bg-gray-100 transition-colors'
                  >
                    {tCta('createAccount')}
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className='mt-8 flex items-center justify-center space-x-6 text-sm'
              >
                <div className='flex items-center space-x-2'>
                  <Check className='w-5 h-5 text-green-400' />
                  <span>{tCta('noCreditCard')}</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <Check className='w-5 h-5 text-green-400' />
                  <span>{tCta('quickStart')}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
