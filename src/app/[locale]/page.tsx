'use client';

import LandingPage from '@/components/landing-page';
import { useLocale } from 'next-intl';

export default function HomePage() {
  const locale = useLocale();

  return <LandingPage />;
}
