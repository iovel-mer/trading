'use client';

import { useTranslations } from 'next-intl';

export function useAllTranslations() {
  return {
    navbar: useTranslations('navbar'),
    hero: useTranslations('hero'),
    stats: useTranslations('stats'),
    features: useTranslations('features'),
    markets: useTranslations('markets'),
    security: useTranslations('security'),
    cta: useTranslations('cta'),
  };
}
