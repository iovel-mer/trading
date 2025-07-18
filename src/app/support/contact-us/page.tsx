import { MainHeader } from '@/components/main-header';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us - Get In Touch',
  description:
    'Reach out to our team for support, partnerships, or general inquiries.',
};

export default function ContactUsPage() {
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
          <h1 className='text-4xl font-bold tracking-tight'>Contact Us</h1>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            We're here to help. Reach out through any of these channels and
            we'll get back to you quickly.
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-8'>
          <div className='space-y-6'>
            <h2 className='text-2xl font-semibold'>Get In Touch</h2>

            <div className='space-y-4'>
              <div className='p-4 border rounded-lg'>
                <h3 className='font-medium mb-2'>Customer Support</h3>
                <p className='text-sm text-muted-foreground mb-2'>
                  For account issues, trading questions, and technical support
                </p>
                <p className='text-sm'>Email: support@platform.com</p>
                <p className='text-sm'>Phone: +1 (555) 123-4567</p>
                <p className='text-xs text-muted-foreground'>Available 24/7</p>
              </div>

              <div className='p-4 border rounded-lg'>
                <h3 className='font-medium mb-2'>Business Inquiries</h3>
                <p className='text-sm text-muted-foreground mb-2'>
                  Partnerships, institutional services, and media requests
                </p>
                <p className='text-sm'>Email: business@platform.com</p>
                <p className='text-sm'>Phone: +1 (555) 123-4568</p>
                <p className='text-xs text-muted-foreground'>
                  Monday-Friday, 9 AM - 6 PM EST
                </p>
              </div>

              <div className='p-4 border rounded-lg'>
                <h3 className='font-medium mb-2'>Compliance & Legal</h3>
                <p className='text-sm text-muted-foreground mb-2'>
                  Regulatory matters and legal inquiries
                </p>
                <p className='text-sm'>Email: legal@platform.com</p>
                <p className='text-xs text-muted-foreground'>
                  Response within 48 hours
                </p>
              </div>
            </div>
          </div>

          <div className='space-y-6'>
            <h2 className='text-2xl font-semibold'>Send Us a Message</h2>
            <form className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>Name</label>
                <input
                  type='text'
                  className='w-full p-3 border rounded-lg'
                  placeholder='Your full name'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>Email</label>
                <input
                  type='email'
                  className='w-full p-3 border rounded-lg'
                  placeholder='your@email.com'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Subject
                </label>
                <select className='w-full p-3 border rounded-lg'>
                  <option>General Inquiry</option>
                  <option>Account Support</option>
                  <option>Technical Issue</option>
                  <option>Partnership</option>
                  <option>Media Request</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Message
                </label>
                <textarea
                  className='w-full p-3 border rounded-lg h-32'
                  placeholder='How can we help you?'
                ></textarea>
              </div>
              <button
                type='submit'
                className='w-full bg-primary text-primary-foreground p-3 rounded-lg hover:bg-primary/90'
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className='space-y-6'>
          <h2 className='text-2xl font-semibold'>Our Offices</h2>
          <div className='grid md:grid-cols-3 gap-6'>
            <div className='p-4 border rounded-lg'>
              <h3 className='font-semibold mb-2'>New York (HQ)</h3>
              <p className='text-sm text-muted-foreground'>
                123 Wall Street
                <br />
                New York, NY 10005
                <br />
                United States
              </p>
            </div>
            <div className='p-4 border rounded-lg'>
              <h3 className='font-semibold mb-2'>London</h3>
              <p className='text-sm text-muted-foreground'>
                25 Old Broad Street
                <br />
                London EC2N 1HQ
                <br />
                United Kingdom
              </p>
            </div>
            <div className='p-4 border rounded-lg'>
              <h3 className='font-semibold mb-2'>Singapore</h3>
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
            Response Times
          </h3>
          <div className='grid md:grid-cols-2 gap-4 text-sm text-black'>
            <div>
              <p>
                <strong>Live Chat:</strong> Immediate response during business
                hours
              </p>
              <p>
                <strong>Email Support:</strong> Within 2 hours for urgent
                matters
              </p>
            </div>
            <div>
              <p>
                <strong>Phone Support:</strong> No wait time, 24/7 availability
              </p>
              <p>
                <strong>Business Inquiries:</strong> Within 1 business day
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
