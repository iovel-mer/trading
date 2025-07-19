'use client';

import { MainHeader } from '@/components/main-header';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function AboutUsPage() {
  const locale = useLocale();
  const tLegal = useTranslations('legal');
  const tAbout = useTranslations('support.aboutUs');

  return (
    <div className='container mx-auto px-4 py-12 max-w-4xl'>
      <MainHeader />
      <div className='space-y-12 pt-30'>
        <div className='mb-8'>
          <Link
            href={`/${locale}`}
            className='inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            {tLegal('backToHome')}
          </Link>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
            {tAbout('title')}
          </h1>
        </div>

        <div className='text-center space-y-4'>
          <h1 className='text-4xl font-bold tracking-tight'>
            {tAbout('title')}
          </h1>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            {tAbout('subtitle')}
          </p>
        </div>

        <div className='space-y-8'>
          <div>
            <h2 className='text-2xl font-semibold mb-4'>
              {tAbout('mission.title')}
            </h2>
            <p className='text-muted-foreground leading-relaxed'>
              {tAbout('mission.content')}
            </p>
          </div>

          <div className='grid md:grid-cols-2 gap-8'>
            <div>
              <h3 className='text-xl font-semibold mb-3'>
                {tAbout('founded.title')}
              </h3>
              <p className='text-muted-foreground'>
                {tAbout('founded.content')}
              </p>
            </div>
            <div>
              <h3 className='text-xl font-semibold mb-3'>
                {tAbout('globalReach.title')}
              </h3>
              <p className='text-muted-foreground'>
                {tAbout('globalReach.content')}
              </p>
            </div>
          </div>

          <div className='bg-muted p-6 rounded-lg'>
            <h3 className='text-xl font-semibold mb-4'>
              {tAbout('values.title')}
            </h3>
            <div className='grid md:grid-cols-3 gap-4'>
              <div>
                <h4 className='font-medium mb-2'>
                  {tAbout('values.transparency.title')}
                </h4>
                <p className='text-sm text-muted-foreground'>
                  {tAbout('values.transparency.description')}
                </p>
              </div>
              <div>
                <h4 className='font-medium mb-2'>
                  {tAbout('values.innovation.title')}
                </h4>
                <p className='text-sm text-muted-foreground'>
                  {tAbout('values.innovation.description')}
                </p>
              </div>
              <div>
                <h4 className='font-medium mb-2'>
                  {tAbout('values.security.title')}
                </h4>
                <p className='text-sm text-muted-foreground'>
                  {tAbout('values.security.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
