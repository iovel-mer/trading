'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MainHeader } from '@/components/main-header';
import { useTranslations, useLocale } from 'next-intl';

export default function TermsOfServicePage() {
  const locale = useLocale();
  const tLegal = useTranslations('legal');
  const tTerms = useTranslations('termsOfService');

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
              {tTerms('title')}
            </h1>
          </div>

          {/* Content */}
          <div className='prose prose-invert max-w-none'>
            <div className='text-gray-300 leading-relaxed space-y-6'>
              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  {tTerms('acceptance.title')}
                </h3>
                <p className='mb-4'>{tTerms('acceptance.content')}</p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  {tTerms('tradingServices.title')}
                </h3>
                <p className='mb-4'>{tTerms('tradingServices.content')}</p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  {tTerms('accountSecurity.title')}
                </h3>
                <p className='mb-4'>{tTerms('accountSecurity.content')}</p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  {tTerms('riskDisclosure.title')}
                </h3>
                <p className='mb-4'>{tTerms('riskDisclosure.content')}</p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  {tTerms('feesAndCharges.title')}
                </h3>
                <p className='mb-4'>{tTerms('feesAndCharges.content')}</p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  {tTerms('prohibitedActivities.title')}
                </h3>
                <p className='mb-4'>{tTerms('prohibitedActivities.content')}</p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  {tTerms('limitationOfLiability.title')}
                </h3>
                <p className='mb-4'>
                  {tTerms('limitationOfLiability.content')}
                </p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  {tTerms('termination.title')}
                </h3>
                <p className='mb-4'>{tTerms('termination.content')}</p>
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
