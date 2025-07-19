'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Twitter, MessageCircle, Send, Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const tFooter = useTranslations('footer');
  const locale = useLocale();

  const routeMapping = {
    'About Us': `${locale}/company/about-us`,
    Security: `${locale}/company/security`,
    'Help Center': `${locale}/support/help-center`,
    'Contact Us': `${locale}/support/contact-us`,
  };
  return (
    <div className='relative'>
      {/* Footer */}
      <footer className='py-20 px-6 border-t border-gray-800 bg-black text-white'>
        <div className='container mx-auto'>
          <div className='grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12'>
            <div className='lg:col-span-2'>
              <div className='flex items-center space-x-2 mb-4'>
                <Image
                  src='/Vector.png'
                  alt='SalesVault'
                  width={30}
                  height={30}
                />
                <span className='text-2xl font-bold'>SalesVault</span>
              </div>
              <p className='text-gray-400 mb-6 max-w-sm'>
                {tFooter('description')}
              </p>
            </div>

            {[
              {
                title: tFooter('company'),
                links: ['About Us', 'Security'],
              },
              {
                title: tFooter('support'),
                links: ['Help Center', 'Contact Us'],
              },
            ].map(section => (
              <div key={section.title}>
                <h3 className='font-semibold mb-4'>{section.title}</h3>
                <ul className='space-y-2'>
                  {section.links.map(link => (
                    <li key={link}>
                      <Link
                        href={routeMapping[link as keyof typeof routeMapping]}
                        className='text-gray-400 hover:text-white transition-colors cursor-pointer'
                      >
                        {tFooter(
                          link.replace(/ /g, '').charAt(0).toLowerCase() +
                            link.replace(/ /g, '').slice(1)
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className='pt-8 border-t border-gray-800'>
            <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
              <p className='text-gray-400 text-sm'>
                © {new Date().getFullYear()} SalesVault. {tFooter('rights')}
              </p>
              <div className='flex space-x-6 text-sm'>
                <Link
                  href={`${locale}/legal/terms-of-service`}
                  className='text-gray-400 hover:text-white transition-colors cursor-pointer underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black'
                >
                  {tFooter('terms.title')}
                </Link>
                <Link
                  href={`${locale}/legal/privacy-policy`}
                  className='text-gray-400 hover:text-white transition-colors cursor-pointer underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black'
                >
                  {tFooter('privacy.title')}
                </Link>
                <Link
                  href={`${locale}/legal/cookie-policy`}
                  className='text-gray-400 hover:text-white transition-colors cursor-pointer underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black'
                >
                  {tFooter('cookies.title')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
