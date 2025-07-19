'use client';

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import type { LoginCredentials } from '@/app/api/types/auth';
import { postLogin } from '@/app/api/auth/postLogin';
import { useCredentials } from '@/hooks/use-credentials';
import { useLocale, useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('login');
  const locale = useLocale();
  const { storeCredentials } = useCredentials();

  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
    twoFactorCode: '',
    rememberMe: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const credentials: LoginCredentials = {
      emailOrUsername: formData.emailOrUsername,
      password: formData.password,
      ...(showTwoFactor && { twoFactorCode: formData.twoFactorCode }),
      ...(formData.rememberMe && { rememberMe: formData.rememberMe }),
    };

    const response = await postLogin(credentials);

    if (!response.success) {
      setError(response.message || 'Login failed');
      setIsLoading(false);
      return;
    }

    storeCredentials(credentials);
    window.location.href = '/dashboard';
  };

  return (
    <div className='min-h-screen flex bg-[#1b1f7b]'>
      <div className='flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 xl:px-12'>
        <div className='mx-auto w-full max-w-sm'>
          <Link
            href={`/${locale}/`}
            className='inline-flex items-center text-sm text-gray-400 hover:text-white mb-8 transition-colors'
          >
            <ChevronLeft className='h-4 w-4 mr-1' />
            {t('backToHome')}
          </Link>

          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-white mb-2'>{t('title')}</h1>
            <p className='text-gray-400'>{t('subtitle')}</p>
          </div>

          {error && (
            <div className='mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg'>
              <p className='text-red-400 text-sm'>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label
                htmlFor='emailOrUsername'
                className='block text-sm font-medium text-gray-300 mb-1'
              >
                {t('emailOrUsername')}
              </label>
              <input
                type='text'
                id='emailOrUsername'
                name='emailOrUsername'
                value={formData.emailOrUsername}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className='w-full px-3 py-2 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-800 disabled:cursor-not-allowed bg-[#1b1f7b] placeholder-gray-500'
                placeholder={t('emailOrUsernamePlaceholder')}
              />
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-300 mb-1'
              >
                {t('password')}
              </label>
              <input
                type='password'
                id='password'
                name='password'
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className='w-full px-3 py-2 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-800 disabled:cursor-not-allowed bg-[#1b1f7b] placeholder-gray-500'
                placeholder={t('passwordPlaceholder')}
              />
            </div>

            {showTwoFactor && (
              <div>
                <label
                  htmlFor='twoFactorCode'
                  className='block text-sm font-medium text-gray-300 mb-1'
                >
                  {t('twoFactorCode')}
                </label>
                <input
                  type='text'
                  id='twoFactorCode'
                  name='twoFactorCode'
                  value={formData.twoFactorCode}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className='w-full px-3 py-2 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-800 disabled:cursor-not-allowed bg-[#1b1f7b] placeholder-gray-500'
                  placeholder={t('twoFactorCodePlaceholder')}
                />
              </div>
            )}

            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='rememberMe'
                  name='rememberMe'
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className='h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-700 rounded disabled:cursor-not-allowed bg-gray-900'
                />
                <label
                  htmlFor='rememberMe'
                  className='ml-2 block text-sm text-gray-300'
                >
                  {t('rememberMe')}
                </label>
              </div>
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-gradient-to-r mt-3 cursor-pointer from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:cursor-not-allowed'
            >
              {isLoading ? (
                <div className='flex items-center justify-center'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                  {t('signingIn')}
                </div>
              ) : (
                t('signIn')
              )}
            </button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-400'>
              {t('dontHaveAccount')}{' '}
              <Link
                href='/register'
                className='text-blue-400 hover:text-blue-300 font-medium transition-colors'
              >
                {t('signUp')}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Background */}
      <div className='hidden lg:block relative flex-1'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20' />
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black to-black' />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

        <div className='relative h-full flex items-center justify-center p-12'>
          <div className='max-w-md'>
            <h2 className='text-3xl font-bold text-white mb-6'>
              {t('rightSide.title')}
            </h2>

            <div className='space-y-4 text-gray-400'>
              <div className='flex items-start space-x-3'>
                <div className='flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5'>
                  <div className='w-2 h-2 rounded-full bg-blue-500' />
                </div>
                <p>{t('rightSide.feature1')}</p>
              </div>

              <div className='flex items-start space-x-3'>
                <div className='flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5'>
                  <div className='w-2 h-2 rounded-full bg-blue-500' />
                </div>
                <p>{t('rightSide.feature2')}</p>
              </div>

              <div className='flex items-start space-x-3'>
                <div className='flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5'>
                  <div className='w-2 h-2 rounded-full bg-blue-500' />
                </div>
                <p>{t('rightSide.feature3')}</p>
              </div>

              <div className='flex items-start space-x-3'>
                <div className='flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5'>
                  <div className='w-2 h-2 rounded-full bg-blue-500' />
                </div>
                <p>{t('rightSide.feature4')}</p>
              </div>
            </div>

            <div className='mt-10 pt-10 border-t border-gray-700'>
              <div className='flex items-center justify-between text-sm'>
                <div>
                  <p className='text-gray-400'>{t('rightSide.totalVolume')}</p>
                  <p className='text-2xl font-bold text-white'>
                    {t('rightSide.totalVolumeValue')}
                  </p>
                </div>
                <div>
                  <p className='text-gray-400'>
                    {t('rightSide.activeTraders')}
                  </p>
                  <p className='text-2xl font-bold text-white'>
                    {t('rightSide.activeTradersValue')}
                  </p>
                </div>
                <div>
                  <p className='text-gray-400'>{t('rightSide.countries')}</p>
                  <p className='text-2xl font-bold text-white'>
                    {t('rightSide.countriesValue')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
