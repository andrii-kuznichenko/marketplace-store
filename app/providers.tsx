'use client';

import { ThemeProvider } from './theme-provider';
import React from 'react';
import ScrollRestoration from './scroll-restoration';

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
        {children}
      </ThemeProvider>
    </>
  );
}

export default Providers;
