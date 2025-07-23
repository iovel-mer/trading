  'use client';

  import { MainHeader } from '@/components/main-header';
  import { ArrowLeft } from 'lucide-react';
  import Link from 'next/link';
  import { useLocale, useTranslations } from 'next-intl';

  export default function DocumentationPage() {
    const locale = useLocale();
    const tLegal = useTranslations('legal');
    const tBlog = useTranslations('resources.blog');

    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <MainHeader />
        <div className="space-y-12 pt-24">
          {/* Back to Home */}
          <div className="mb-8">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {tBlog('backToHome')}
            </Link>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              {tBlog('title')}
            </h1>
          </div>

          {/* Documentation Intro */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight">
              {tBlog('subtitle')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {tBlog('overview.content')}
            </p>
          </div>

          {/* Sections */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">{tBlog('quickStart.title')}</h3>
              <p className="text-muted-foreground">{tBlog('quickStart.content')}</p>
            </div>
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">{tBlog('authentication.title')}</h3>
              <p className="text-muted-foreground">{tBlog('authentication.content')}</p>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">{tBlog('faq.title')}</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">{tBlog('faq.apiUrl.question')}</h4>
                <p className="text-sm text-muted-foreground">{tBlog('faq.apiUrl.answer')}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">{tBlog('faq.reportBug.question')}</h4>
                <p className="text-sm text-muted-foreground">{tBlog('faq.reportBug.answer')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
