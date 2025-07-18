import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MainHeader } from '@/components/main-header';

export default function TermsOfServicePage() {
  return (
    <div className='min-h-screen bg-black text-white'>
      <MainHeader />
      <div className='container mx-auto px-6 py-12 pt-30'>
        <div className='max-w-4xl mx-auto'>
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

          {/* Content */}
          <div className='prose prose-invert max-w-none'>
            <div className='text-gray-300 leading-relaxed space-y-6'>
              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  1. Acceptance of Terms
                </h3>
                <p className='mb-4'>
                  By accessing and using SalesVault, you accept and agree to be
                  bound by the terms and provision of this agreement.
                </p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  2. Trading Services
                </h3>
                <p className='mb-4'>
                  SalesVault provides cryptocurrency trading services. All
                  trades are executed at your own risk.
                </p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  3. Account Security
                </h3>
                <p className='mb-4'>
                  You are responsible for maintaining the confidentiality of
                  your account credentials and for all activities that occur
                  under your account.
                </p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  4. Risk Disclosure
                </h3>
                <p className='mb-4'>
                  Cryptocurrency trading involves substantial risk of loss and
                  is not suitable for all investors. Past performance is not
                  indicative of future results.
                </p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  5. Fees and Charges
                </h3>
                <p className='mb-4'>
                  Trading fees apply to all transactions. Fee schedules are
                  available on our website and may be updated from time to time.
                </p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  6. Prohibited Activities
                </h3>
                <p className='mb-4'>
                  Users may not engage in market manipulation, money laundering,
                  or any other illegal activities on our platform.
                </p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  7. Limitation of Liability
                </h3>
                <p className='mb-4'>
                  SalesVault shall not be liable for any indirect, incidental,
                  special, consequential, or punitive damages.
                </p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  8. Termination
                </h3>
                <p className='mb-4'>
                  We reserve the right to terminate or suspend your account at
                  any time for violation of these terms.
                </p>
              </div>

              <p className='text-sm text-gray-400 mt-8'>
                Last updated: January 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
