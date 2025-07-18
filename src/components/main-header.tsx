'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface MainHeaderProps {
  className?: string;
}

export const MainHeader: React.FC<MainHeaderProps> = ({ className = '' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const isHomePage = pathname === '/';

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

  const navigationItems = [
    { name: 'Markets', id: 'markets' },
    { name: 'Trade', id: 'hero' },
    { name: 'Futures', id: 'features' },
    { name: 'Security', id: 'security' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-xl border-b border-gray-800'
          : ''
      } ${className}`}
    >
      <div className='container mx-auto px-6 py-4'>
        <div className='flex items-center justify-between'>
          {/* Logo */}
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

          {/* Desktop Navigation */}
          {isHomePage && (
            <div className='hidden lg:flex items-center space-x-8'>
              {navigationItems.map(item => (
                <motion.button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className='text-gray-300 hover:text-white transition-colors cursor-pointer'
                  whileHover={{ scale: 1.05 }}
                >
                  {item.name}
                </motion.button>
              ))}
            </div>
          )}

          {/* Desktop Auth Buttons */}
          <div className='hidden lg:flex items-center space-x-4'>
            <Link href='/login'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='px-6 py-2 text-gray-300 hover:text-white transition-colors'
              >
                Log In
              </motion.button>
            </Link>
            <Link href='/register'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium'
              >
                Get Started
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='lg:hidden'
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
            className='lg:hidden bg-black/95 backdrop-blur-xl border-t border-gray-800'
          >
            <div className='container mx-auto px-6 py-4 space-y-4'>
              {isHomePage &&
                navigationItems.map(item => (
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
                    Log In
                  </button>
                </Link>
                <Link href='/register' className='block'>
                  <button className='w-full px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg'>
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
