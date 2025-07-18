import { MainHeader } from '@/components/main-header';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Security - Your Assets Are Protected',
  description:
    'Learn about our comprehensive security measures and regulatory compliance standards.',
};

export default function SecurityPage() {
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
          <h1 className='text-4xl font-bold tracking-tight'>Security First</h1>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            Your assets and data are protected by institutional-grade security
            measures and regulatory oversight.
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-8'>
          <div className='space-y-6'>
            <h2 className='text-2xl font-semibold'>Asset Protection</h2>
            <div className='space-y-4'>
              <div className='p-4 border rounded-lg'>
                <h3 className='font-medium mb-2'>Cold Storage</h3>
                <p className='text-sm text-muted-foreground'>
                  95% of digital assets stored offline in military-grade secure
                  facilities
                </p>
              </div>
              <div className='p-4 border rounded-lg'>
                <h3 className='font-medium mb-2'>Insurance Coverage</h3>
                <p className='text-sm text-muted-foreground'>
                  $100M insurance policy covering digital assets and operational
                  risks
                </p>
              </div>
              <div className='p-4 border rounded-lg'>
                <h3 className='font-medium mb-2'>Segregated Accounts</h3>
                <p className='text-sm text-muted-foreground'>
                  Client funds held separately from company assets in regulated
                  banks
                </p>
              </div>
            </div>
          </div>

          <div className='space-y-6'>
            <h2 className='text-2xl font-semibold'>Technical Security</h2>
            <div className='space-y-4'>
              <div className='p-4 border rounded-lg'>
                <h3 className='font-medium mb-2'>Multi-Signature Wallets</h3>
                <p className='text-sm text-muted-foreground'>
                  Multiple keys required for all cryptocurrency transactions
                </p>
              </div>
              <div className='p-4 border rounded-lg'>
                <h3 className='font-medium mb-2'>End-to-End Encryption</h3>
                <p className='text-sm text-muted-foreground'>
                  All data encrypted in transit and at rest using AES-256
                </p>
              </div>
              <div className='p-4 border rounded-lg'>
                <h3 className='font-medium mb-2'>24/7 Monitoring</h3>
                <p className='text-sm text-muted-foreground'>
                  Real-time threat detection and incident response team
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          <h2 className='text-2xl font-semibold'>Regulatory Compliance</h2>
          <div className='grid md:grid-cols-3 gap-4'>
            <div className='text-center p-4 border rounded-lg'>
              <h3 className='font-semibold'>FCA Regulated</h3>
              <p className='text-xs text-muted-foreground'>
                UK Financial Conduct Authority
              </p>
            </div>
            <div className='text-center p-4 border rounded-lg'>
              <h3 className='font-semibold'>CFTC Registered</h3>
              <p className='text-xs text-muted-foreground'>
                US Commodity Futures Trading Commission
              </p>
            </div>
            <div className='text-center p-4 border rounded-lg'>
              <h3 className='font-semibold'>MAS Licensed</h3>
              <p className='text-xs text-muted-foreground'>
                Monetary Authority of Singapore
              </p>
            </div>
          </div>
        </div>

        <div className='bg-blue-50 border border-blue-200 p-6 rounded-lg'>
          <h3 className='text-lg font-semibold mb-3 text-black'>
            Account Security Tips
          </h3>
          <ul className='space-y-2 text-sm text-blue-800'>
            <li>• Enable two-factor authentication on your account</li>
            <li>• Use a unique, strong password with a password manager</li>
            <li>• Never share your login credentials with anyone</li>
            <li>• Regularly review your account activity and statements</li>
            <li>
              • Contact support immediately if you notice suspicious activity
            </li>
          </ul>
        </div>

        <div className='text-center'>
          <h3 className='text-lg font-semibold mb-2'>Security Audits</h3>
          <p className='text-muted-foreground'>
            Our systems undergo quarterly security audits by leading
            cybersecurity firms including Deloitte and PwC. All audit reports
            are available upon request.
          </p>
        </div>
      </div>
    </div>
  );
}
