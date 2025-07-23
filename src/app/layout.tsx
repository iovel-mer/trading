import type React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trading Platform - Secure Trading Solutions',
  description:
    'Advanced trading platform with secure authentication and real-time trading capabilities',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
