'use client';

import { MainHeader } from '@/components/main-header';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function SecurityPage() {
  const locale = useLocale();
  const tLegal = useTranslations('legal');
  const tSecurity = useTranslations('support.security');

  return (
    <div className='container mx-auto px-4 py-12 max-w-4xl'>
      <MainHeader />
      <div className='space-y-8 pt-30'>
        <div className='mb-8'>
          <Link
            href={`/${locale}`}
            className='inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            {tLegal('backToHome')}
          </Link>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
            {tSecurity('title')}
          </h1>
        </div>

        <div className='text-center space-y-4'>
          <h1 className='text-4xl font-bold tracking-tight'>
            {tSecurity('title')}
          </h1>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            {tSecurity('subtitle')}
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-8'>
          <div className='space-y-6'>
            <h2 className='text-2xl font-semibold'>
              {tSecurity('assetProtection.title')}
            </h2>
            <div className='space-y-4'>
              <div className='p-4 border rounded-lg'>
                <h3 className='font-medium mb-2'>
                  {tSecurity('assetProtection.coldStorage.title')}
                </h3>
                <p className='text-sm text-muted-foreground'>
                  {tSecurity('assetProtection.coldStorage.description')}
                </p>
              </div>
              <div className='p-4 border rounded-lg'>
                <h3 className='font-medium mb-2'>
                  {tSecurity('assetProtection.insurance.title')}
                </h3>
                <p className='text-sm text-muted-foreground'>
                  {tSecurity('assetProtection.insurance.description')}
                </p>
              </div>
              <div className='p-4 border rounded-lg'>
                <h3 className='font-medium mb-2'>
                  {tSecurity('assetProtection.segregatedAccounts.title')}
                </h3>
                <p className='text-sm text-muted-foreground'>
                  {tSecurity('assetProtection.segregatedAccounts.description')}
                </p>
              </div>
            </div>
          </div>

          <div className='space-y-6'>
            <h2 className='text-2xl font-semibold'>
              {tSecurity('technicalSecurity.title')}
            </h2>
            <div className='space-y-4'>
              <div className='p-4 border rounded-lg'>
                <h3 className='font-medium mb-2'>
                  {tSecurity('technicalSecurity.multiSig.title')}
                </h3>
                <p className='text-sm text-muted-foreground'>
                  {tSecurity('technicalSecurity.multiSig.description')}
                </p>
              </div>
              <div className='p-4 border rounded-lg'>
                <h3 className='font-medium mb-2'>
                  {tSecurity('technicalSecurity.encryption.title')}
                </h3>
                <p className='text-sm text-muted-foreground'>
                  {tSecurity('technicalSecurity.encryption.description')}
                </p>
              </div>
              <div className='p-4 border rounded-lg'>
                <h3 className='font-medium mb-2'>
                  {tSecurity('technicalSecurity.monitoring.title')}
                </h3>
                <p className='text-sm text-muted-foreground'>
                  {tSecurity('technicalSecurity.monitoring.description')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          <h2 className='text-2xl font-semibold'>
            {tSecurity('compliance.title')}
          </h2>
          <div className='grid md:grid-cols-3 gap-4'>
            <div className='text-center p-4 border rounded-lg'>
              <h3 className='font-semibold'>{tSecurity('compliance.fca')}</h3>
              <p className='text-xs text-muted-foreground'>
                {tSecurity('compliance.fcaDesc')}
              </p>
            </div>
            <div className='text-center p-4 border rounded-lg'>
              <h3 className='font-semibold'>{tSecurity('compliance.cftc')}</h3>
              <p className='text-xs text-muted-foreground'>
                {tSecurity('compliance.cftcDesc')}
              </p>
            </div>
            <div className='text-center p-4 border rounded-lg'>
              <h3 className='font-semibold'>{tSecurity('compliance.mas')}</h3>
              <p className='text-xs text-muted-foreground'>
                {tSecurity('compliance.masDesc')}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-blue-50 border border-blue-200 p-6 rounded-lg'>
          <h3 className='text-lg font-semibold mb-3 text-black'>
            {tSecurity('securityTips.title')}
          </h3>
          <ul className='space-y-2 text-sm text-blue-800'>
            <li>• {tSecurity('securityTips.tip1')}</li>
            <li>• {tSecurity('securityTips.tip2')}</li>
            <li>• {tSecurity('securityTips.tip3')}</li>
            <li>• {tSecurity('securityTips.tip4')}</li>
            <li>• {tSecurity('securityTips.tip5')}</li>
          </ul>
        </div>

        <div className='text-center'>
          <h3 className='text-lg font-semibold mb-2'>
            {tSecurity('audits.title')}
          </h3>
          <p className='text-muted-foreground'>
            {tSecurity('audits.description')}
          </p>
        </div>
      </div>
    </div>
  );
}
