'use client';

import { MainHeader } from '@/components/main-header';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function ContactUsPage() {
  const locale = useLocale();
  const tLegal = useTranslations('legal');
  const tContact = useTranslations('support.contactUs');

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
            {tContact('title')}
          </h1>
        </div>

        <div className='text-center space-y-4'>
          <h1 className='text-4xl font-bold tracking-tight'>
            {tContact('title')}
          </h1>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            {tContact('subtitle')}
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-8'>
          <div className='space-y-6'>
            <h2 className='text-2xl font-semibold'>{tContact('getInTouch')}</h2>
            <div className='space-y-4'>
              <div className='p-4 border rounded-lg'>
                <h3 className='font-medium mb-2'>
                  {tContact('customerSupport.title')}
                </h3>
                <p className='text-sm text-muted-foreground mb-2'>
                  {tContact('customerSupport.description')}
                </p>
                <p className='text-sm'>{tContact('customerSupport.email')}</p>
                <p className='text-sm'>{tContact('customerSupport.phone')}</p>
                <p className='text-xs text-muted-foreground'>
                  {tContact('customerSupport.availability')}
                </p>
              </div>

              <div className='p-4 border rounded-lg'>
                <h3 className='font-medium mb-2'>
                  {tContact('businessInquiries.title')}
                </h3>
                <p className='text-sm text-muted-foreground mb-2'>
                  {tContact('businessInquiries.description')}
                </p>
                <p className='text-sm'>{tContact('businessInquiries.email')}</p>
                <p className='text-sm'>{tContact('businessInquiries.phone')}</p>
                <p className='text-xs text-muted-foreground'>
                  {tContact('businessInquiries.availability')}
                </p>
              </div>

              <div className='p-4 border rounded-lg'>
                <h3 className='font-medium mb-2'>
                  {tContact('complianceLegal.title')}
                </h3>
                <p className='text-sm text-muted-foreground mb-2'>
                  {tContact('complianceLegal.description')}
                </p>
                <p className='text-sm'>{tContact('complianceLegal.email')}</p>
                <p className='text-xs text-muted-foreground'>
                  {tContact('complianceLegal.availability')}
                </p>
              </div>
            </div>
          </div>

          <div className='space-y-6'>
            <h2 className='text-2xl font-semibold'>
              {tContact('sendMessage')}
            </h2>
            <form className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  {tContact('form.name')}
                </label>
                <input
                  type='text'
                  className='w-full p-3 border rounded-lg'
                  placeholder={tContact('form.namePlaceholder')}
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  {tContact('form.email')}
                </label>
                <input
                  type='email'
                  className='w-full p-3 border rounded-lg'
                  placeholder={tContact('form.emailPlaceholder')}
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  {tContact('form.subject')}
                </label>
                <select className='w-full p-3 border rounded-lg'>
                  <option>{tContact('form.subjects.general')}</option>
                  <option>{tContact('form.subjects.support')}</option>
                  <option>{tContact('form.subjects.technical')}</option>
                  <option>{tContact('form.subjects.partnership')}</option>
                  <option>{tContact('form.subjects.media')}</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  {tContact('form.message')}
                </label>
                <textarea
                  className='w-full p-3 border rounded-lg h-32'
                  placeholder={tContact('form.messagePlaceholder')}
                ></textarea>
              </div>
              <button
                type='submit'
                className='w-full bg-primary text-primary-foreground p-3 rounded-lg hover:bg-primary/90'
              >
                {tContact('form.sendButton')}
              </button>
            </form>
          </div>
        </div>

        <div className='space-y-6'>
          <h2 className='text-2xl font-semibold'>
            {tContact('offices.title')}
          </h2>
          <div className='grid md:grid-cols-3 gap-6'>
            <div className='p-4 border rounded-lg'>
              <h3 className='font-semibold mb-2'>
                {tContact('offices.newYork')}
              </h3>
              <p className='text-sm text-muted-foreground'>
                123 Wall Street
                <br />
                New York, NY 10005
                <br />
                United States
              </p>
            </div>
            <div className='p-4 border rounded-lg'>
              <h3 className='font-semibold mb-2'>
                {tContact('offices.london')}
              </h3>
              <p className='text-sm text-muted-foreground'>
                25 Old Broad Street
                <br />
                London EC2N 1HQ
                <br />
                United Kingdom
              </p>
            </div>
            <div className='p-4 border rounded-lg'>
              <h3 className='font-semibold mb-2'>
                {tContact('offices.singapore')}
              </h3>
              <p className='text-sm text-muted-foreground'>
                1 Raffles Place
                <br />
                Singapore 048616
                <br />
                Singapore
              </p>
            </div>
          </div>
        </div>

        <div className='bg-blue-50 border border-blue-200 p-6 rounded-lg'>
          <h3 className='text-lg font-semibold mb-2 text-black'>
            {tContact('responseTimes.title')}
          </h3>
          <div className='grid md:grid-cols-2 gap-4 text-sm text-black'>
            <div>
              <p>
                <strong>Live Chat:</strong> {tContact('responseTimes.liveChat')}
              </p>
              <p>
                <strong>Email Support:</strong>{' '}
                {tContact('responseTimes.emailSupport')}
              </p>
            </div>
            <div>
              <p>
                <strong>Phone Support:</strong>{' '}
                {tContact('responseTimes.phoneSupport')}
              </p>
              <p>
                <strong>Business Inquiries:</strong>{' '}
                {tContact('responseTimes.businessInquiries')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
