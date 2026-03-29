'use client';

import { ThemeProvider } from './theme-provider';
import React from 'react';
import ScrollRestoration from './scroll-restoration';
import { Toaster } from '@/components/ui/sonner';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollRestoration />
      <ThemeProvider
        attribute={'class'}
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
      >
        <Toaster />
        {children}
      </ThemeProvider>
    </>
  );
}

export default Providers;
