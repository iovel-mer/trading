'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MainHeader } from '@/components/main-header';
import { useTranslations, useLocale } from 'next-intl';

export default function PrivacyPolicyPage() {
  const locale = useLocale();
  const tLegal = useTranslations('legal');
  const tPrivacy = useTranslations('privacyPolicy');

  return (
    <div className='min-h-screen bg-black text-white'>
      <MainHeader />
      <div className='container mx-auto px-6 py-12 pt-30'>
        <div className='max-w-4xl mx-auto'>
          <div className='mb-8'>
            <Link
              href={`/${locale}`}
              className='inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6'
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              {tLegal('backToHome')}
            </Link>
            <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
              {tPrivacy('title')}
            </h1>
          </div>

          {/* Content */}
          <div className='prose prose-invert max-w-none'>
            <div className='text-gray-300 leading-relaxed space-y-6'>
              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  {tPrivacy('informationWeCollect.title')}
                </h3>
                <p className='mb-4'>
                  {tPrivacy('informationWeCollect.content')}
                </p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  {tPrivacy('howWeUseInfo.title')}
                </h3>
                <p className='mb-4'>{tPrivacy('howWeUseInfo.content')}</p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  {tPrivacy('informationSharing.title')}
                </h3>
                <p className='mb-4'>{tPrivacy('informationSharing.content')}</p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  {tPrivacy('dataSecurity.title')}
                </h3>
                <p className='mb-4'>{tPrivacy('dataSecurity.content')}</p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  {tPrivacy('cookiesAndTracking.title')}
                </h3>
                <p className='mb-4'>{tPrivacy('cookiesAndTracking.content')}</p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  {tPrivacy('dataRetention.title')}
                </h3>
                <p className='mb-4'>{tPrivacy('dataRetention.content')}</p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  {tPrivacy('yourRights.title')}
                </h3>
                <p className='mb-4'>{tPrivacy('yourRights.content')}</p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  {tPrivacy('internationalTransfers.title')}
                </h3>
                <p className='mb-4'>
                  {tPrivacy('internationalTransfers.content')}
                </p>
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
