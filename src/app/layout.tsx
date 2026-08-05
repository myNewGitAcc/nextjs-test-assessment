import Providers from '@/app/providers';
import clsx from 'classnames';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './global.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Next.js test assessment',
  description: 'Integrating mock meetings and chat api',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={clsx(
        geistSans.variable,
        geistMono.variable,
        'h-full antialiased',
      )}
    >
      <body className="flex h-full min-h-screen flex-col items-center text-default">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
