import { MainHeader } from '@/components/main-header';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Help Center - Get Support When You Need It',
  description:
    'Find answers to common questions and get help with your trading account.',
};

export default function HelpCenterPage() {
  return (
    <div className='container mx-auto px-4 py-12 max-w-4xl'>
      <MainHeader />
      <div className='space-y-8 pt-30'>
        <div className='mb-8'>
          <Link
            href='/'
            className='inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to Home
          </Link>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
            Terms of Service
          </h1>
        </div>

        <div className='text-center space-y-4'>
          <h1 className='text-4xl font-bold tracking-tight'>Help Center</h1>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            Find quick answers to common questions or get personalized support
            from our team.
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-6'>
          <div className='p-6 border rounded-lg text-center'>
            <h3 className='font-semibold mb-2'>Live Chat</h3>
            <p className='text-sm text-muted-foreground mb-4'>
              Get instant help from our support team
            </p>
            <p className='text-xs text-muted-foreground'>Available 24/7</p>
          </div>
          <div className='p-6 border rounded-lg text-center'>
            <h3 className='font-semibold mb-2'>Email Support</h3>
            <p className='text-sm text-muted-foreground mb-4'>
              Detailed responses within 2 hours
            </p>
            <p className='text-xs text-muted-foreground'>
              support@platform.com
            </p>
          </div>
          <div className='p-6 border rounded-lg text-center'>
            <h3 className='font-semibold mb-2'>Phone Support</h3>
            <p className='text-sm text-muted-foreground mb-4'>
              Speak directly with our experts
            </p>
            <p className='text-xs text-muted-foreground'>+1 (555) 123-4567</p>
          </div>
        </div>

        <div className='space-y-6'>
          <h2 className='text-2xl font-semibold'>Frequently Asked Questions</h2>
          <div className='space-y-4'>
            <details className='p-4 border rounded-lg'>
              <summary className='font-medium cursor-pointer'>
                How do I fund my account?
              </summary>
              <div className='mt-3 text-sm text-muted-foreground'>
                <p>
                  You can fund your account through bank transfer, credit card,
                  or cryptocurrency deposit. Bank transfers typically take 1-2
                  business days, while crypto deposits are usually instant after
                  network confirmation.
                </p>
              </div>
            </details>

            <details className='p-4 border rounded-lg'>
              <summary className='font-medium cursor-pointer'>
                What are your trading fees?
              </summary>
              <div className='mt-3 text-sm text-muted-foreground'>
                <p>
                  Our fee structure is transparent and competitive. Spot trading
                  fees start at 0.1% for makers and 0.15% for takers. Futures
                  trading fees are as low as 0.02% for makers. Volume discounts
                  are available for high-frequency traders.
                </p>
              </div>
            </details>

            <details className='p-4 border rounded-lg'>
              <summary className='font-medium cursor-pointer'>
                How long do withdrawals take?
              </summary>
              <div className='mt-3 text-sm text-muted-foreground'>
                <p>
                  Cryptocurrency withdrawals are processed within 30 minutes
                  during business hours. Bank withdrawals typically take 1-3
                  business days depending on your bank and location.
                </p>
              </div>
            </details>

            <details className='p-4 border rounded-lg'>
              <summary className='font-medium cursor-pointer'>
                Is my account insured?
              </summary>
              <div className='mt-3 text-sm text-muted-foreground'>
                <p>
                  Yes, we maintain comprehensive insurance coverage for digital
                  assets and operational risks. Additionally, fiat deposits are
                  protected by FDIC insurance up to $250,000 per account.
                </p>
              </div>
            </details>
          </div>
        </div>

        <div className='grid md:grid-cols-2 gap-8'>
          <div className='space-y-4'>
            <h3 className='text-xl font-semibold'>Getting Started</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <a href='#' className='text-primary hover:underline'>
                  Account Verification Guide
                </a>
              </li>
              <li>
                <a href='#' className='text-primary hover:underline'>
                  How to Make Your First Trade
                </a>
              </li>
              <li>
                <a href='#' className='text-primary hover:underline'>
                  Understanding Order Types
                </a>
              </li>
              <li>
                <a href='#' className='text-primary hover:underline'>
                  Platform Tutorial Videos
                </a>
              </li>
            </ul>
          </div>

          <div className='space-y-4'>
            <h3 className='text-xl font-semibold'>Advanced Topics</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <a href='#' className='text-primary hover:underline'>
                  Margin Trading Explained
                </a>
              </li>
              <li>
                <a href='#' className='text-primary hover:underline'>
                  Options Strategies Guide
                </a>
              </li>
              <li>
                <a href='#' className='text-primary hover:underline'>
                  API Documentation
                </a>
              </li>
              <li>
                <a href='#' className='text-primary hover:underline'>
                  Tax Reporting Tools
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='bg-muted p-6 rounded-lg'>
          <h3 className='text-lg font-semibold mb-2 text-gray-300'>
            Can't Find What You're Looking For?
          </h3>
          <p className='text-muted-foreground mb-4 text-shadow-black'>
            Our support team is here to help with any questions not covered in
            our FAQ. We pride ourselves on quick response times and
            knowledgeable assistance.
          </p>
          <Link href={'/support/contact-us'}>
            <button className='bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90'>
              Contact Support
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
