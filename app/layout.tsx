import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter, Lora, Roboto } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Navbar from '@/components/navbar/Navbar';
import { ClerkProvider } from '@clerk/nextjs';
import Providers from './providers';
import NavbarWithReveal from '@/components/home/animated/NavbarWithReveal';
import { PropsWithChildren } from 'react';

const loraHeading = Lora({ subsets: ['latin'], variable: '--font-heading' });

const inter = Inter({ subsets: ['latin'], variable: '--font-roboto-sans' });

const roboto = Roboto({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Next Storefront',
  description: 'Store built with Next.js',
};

export type HomeLayoutProps = Readonly<PropsWithChildren>;

export default function RootLayout({ children }: HomeLayoutProps) {
  return (
    <ClerkProvider>
      <html
        lang='en'
        suppressHydrationWarning
        className={cn(
          'h-full',
          'antialiased',
          'font-sans',
          geistSans.variable,
          geistMono.variable,
          'font-sans',
          inter.variable,
          loraHeading.variable,
          roboto.variable,
        )}
      >
        <body>
          <Providers>
            <NavbarWithReveal>
              <Navbar />
            </NavbarWithReveal>
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
