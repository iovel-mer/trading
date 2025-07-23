'use client';

import { MainHeader } from '@/components/main-header';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function DocumentationPage() {
  const locale = useLocale();
  const tLegal = useTranslations('legal');
  const tDocumentation = useTranslations('resources.documentation');

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <MainHeader />
      <div className="space-y-12 pt-24">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {tLegal('backToHome')}
          </Link>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
            {tDocumentation('title')}
          </h1>
        </div>

        {/* Intro Section */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight">
            {tDocumentation('subtitle')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {tDocumentation('description')}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          <div>
            <h3 className="text-2xl font-semibold mb-4">
              {tDocumentation('overview.title')}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {tDocumentation('overview.content')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-3">
                {tDocumentation('quickStart.title')}
              </h4>
              <p className="text-muted-foreground">
                {tDocumentation('quickStart.content')}
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-3">
                {tDocumentation('auth.title')}
              </h4>
              <p className="text-muted-foreground">
                {tDocumentation('auth.content')}
              </p>
            </div>
          </div>

          {/* FAQ or Resources */}
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">
              {tDocumentation('faq.title')}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium mb-1">
                  {tDocumentation('faq.q1.question')}
                </h5>
                <p className="text-sm text-muted-foreground">
                  {tDocumentation('faq.q1.answer')}
                </p>
              </div>
              <div>
                <h5 className="font-medium mb-1">
                  {tDocumentation('faq.q2.question')}
                </h5>
                <p className="text-sm text-muted-foreground">
                  {tDocumentation('faq.q2.answer')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
