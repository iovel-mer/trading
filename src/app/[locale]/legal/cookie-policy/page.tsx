'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MainHeader } from '@/components/main-header';
import { useTranslations, useLocale } from 'next-intl';

export default function CookiePolicyPage() {
  const locale = useLocale();
  const tLegal = useTranslations('legal');
  const tCookie = useTranslations('cookiePolicy');

  return (
    <div className='min-h-screen bg-black text-white'>
      <MainHeader />
      <div className='container mx-auto px-6 py-12 pt-30'>
        <div className='max-w-4xl mx-auto'>
          {/* Header */}
          <div className='mb-8'>
            <Link
              href={`/${locale}`}
              className='inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6'
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              {tLegal('backToHome')}
            </Link>
            <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
              {tCookie('title')}
            </h1>
          </div>

          {/* Content */}
          <div className='prose prose-invert max-w-none'>
            <div className='text-gray-300 leading-relaxed space-y-6'>
              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  {tCookie('whatAreCookies.title')}
                </h3>
                <p className='mb-4'>{tCookie('whatAreCookies.content')}</p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  {tCookie('typesOfCookies.title')}
                </h3>
                <p className='mb-4'>
                  <strong>Essential Cookies:</strong>{' '}
                  {tCookie('typesOfCookies.essential')}
                </p>
                <p className='mb-4'>
                  <strong>Analytics Cookies:</strong>{' '}
                  {tCookie('typesOfCookies.analytics')}
                </p>
                <p className='mb-4'>
                  <strong>Functional Cookies:</strong>{' '}
                  {tCookie('typesOfCookies.functional')}
                </p>
                <p className='mb-4'>
                  <strong>Marketing Cookies:</strong>{' '}
                  {tCookie('typesOfCookies.marketing')}
                </p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  {tCookie('thirdPartyCookies.title')}
                </h3>
                <p className='mb-4'>{tCookie('thirdPartyCookies.content')}</p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  {tCookie('managingCookies.title')}
                </h3>
                <p className='mb-4'>{tCookie('managingCookies.content')}</p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  {tCookie('cookieConsent.title')}
                </h3>
                <p className='mb-4'>{tCookie('cookieConsent.content')}</p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  {tCookie('updates.title')}
                </h3>
                <p className='mb-4'>{tCookie('updates.content')}</p>
              </div>

              <p className='text-sm text-gray-400 mt-8'>
                {tLegal('lastUpdated')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
