'use client';

import { MainHeader } from '@/components/main-header';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function HelpCenterPage() {
  const locale = useLocale();
  const tLegal = useTranslations('legal');
  const tHelp = useTranslations('support.helpCenter');

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
            {tHelp('title')}
          </h1>
        </div>

        <div className='text-center space-y-4'>
          <h1 className='text-4xl font-bold tracking-tight'>
            {tHelp('title')}
          </h1>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            {tHelp('subtitle')}
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-6'>
          <div className='p-6 border rounded-lg text-center'>
            <h3 className='font-semibold mb-2'>{tHelp('liveChat.title')}</h3>
            <p className='text-sm text-muted-foreground mb-4'>
              {tHelp('liveChat.description')}
            </p>
            <p className='text-xs text-muted-foreground'>
              {tHelp('liveChat.availability')}
            </p>
          </div>
          <div className='p-6 border rounded-lg text-center'>
            <h3 className='font-semibold mb-2'>
              {tHelp('emailSupport.title')}
            </h3>
            <p className='text-sm text-muted-foreground mb-4'>
              {tHelp('emailSupport.description')}
            </p>
            <p className='text-xs text-muted-foreground'>
              {tHelp('emailSupport.email')}
            </p>
          </div>
          <div className='p-6 border rounded-lg text-center'>
            <h3 className='font-semibold mb-2'>
              {tHelp('phoneSupport.title')}
            </h3>
            <p className='text-sm text-muted-foreground mb-4'>
              {tHelp('phoneSupport.description')}
            </p>
            <p className='text-xs text-muted-foreground'>
              {tHelp('phoneSupport.phone')}
            </p>
          </div>
        </div>

        <div className='space-y-6'>
          <h2 className='text-2xl font-semibold'>{tHelp('faq.title')}</h2>
          <div className='space-y-4'>
            <details className='p-4 border rounded-lg'>
              <summary className='font-medium cursor-pointer'>
                {tHelp('faq.fundAccount.question')}
              </summary>
              <div className='mt-3 text-sm text-muted-foreground'>
                <p>{tHelp('faq.fundAccount.answer')}</p>
              </div>
            </details>

            <details className='p-4 border rounded-lg'>
              <summary className='font-medium cursor-pointer'>
                {tHelp('faq.tradingFees.question')}
              </summary>
              <div className='mt-3 text-sm text-muted-foreground'>
                <p>{tHelp('faq.tradingFees.answer')}</p>
              </div>
            </details>

            <details className='p-4 border rounded-lg'>
              <summary className='font-medium cursor-pointer'>
                {tHelp('faq.withdrawals.question')}
              </summary>
              <div className='mt-3 text-sm text-muted-foreground'>
                <p>{tHelp('faq.withdrawals.answer')}</p>
              </div>
            </details>

            <details className='p-4 border rounded-lg'>
              <summary className='font-medium cursor-pointer'>
                {tHelp('faq.insurance.question')}
              </summary>
              <div className='mt-3 text-sm text-muted-foreground'>
                <p>{tHelp('faq.insurance.answer')}</p>
              </div>
            </details>
          </div>
        </div>

        <div className='grid md:grid-cols-2 gap-8'>
          <div className='space-y-4'>
            <h3 className='text-xl font-semibold'>
              {tHelp('gettingStarted.title')}
            </h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <a href='#' className='text-primary hover:underline'>
                  {tHelp('gettingStarted.verification')}
                </a>
              </li>
              <li>
                <a href='#' className='text-primary hover:underline'>
                  {tHelp('gettingStarted.firstTrade')}
                </a>
              </li>
              <li>
                <a href='#' className='text-primary hover:underline'>
                  {tHelp('gettingStarted.orderTypes')}
                </a>
              </li>
              <li>
                <a href='#' className='text-primary hover:underline'>
                  {tHelp('gettingStarted.tutorials')}
                </a>
              </li>
            </ul>
          </div>
          <div className='space-y-4'>
            <h3 className='text-xl font-semibold'>
              {tHelp('advancedTopics.title')}
            </h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <a href='#' className='text-primary hover:underline'>
                  {tHelp('advancedTopics.marginTrading')}
                </a>
              </li>
              <li>
                <a href='#' className='text-primary hover:underline'>
                  {tHelp('advancedTopics.optionsStrategies')}
                </a>
              </li>
              <li>
                <a href='#' className='text-primary hover:underline'>
                  {tHelp('advancedTopics.apiDocs')}
                </a>
              </li>
              <li>
                <a href='#' className='text-primary hover:underline'>
                  {tHelp('advancedTopics.taxReporting')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='bg-muted p-6 rounded-lg'>
          <h3 className='text-lg font-semibold mb-2 text-gray-300'>
            {tHelp('cantFind.title')}
          </h3>
          <p className='text-muted-foreground mb-4 text-shadow-black'>
            {tHelp('cantFind.description')}
          </p>
          <Link href={`/${locale}/support/contact-us`}>
            <button className='bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90'>
              {tHelp('cantFind.contactButton')}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
