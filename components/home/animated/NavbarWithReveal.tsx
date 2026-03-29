'use client';

import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { pageLinks } from '@/utils/links';

function NavbarWithReveal({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === pageLinks.home;
  const [overlayFinished, setOverlayFinished] = useState(!isHomePage);

  useEffect(() => {
    setOverlayFinished(!isHomePage);
  }, [isHomePage]);

  useEffect(() => {
    if (!isHomePage) return;

    const onOverlayDone = () => setOverlayFinished(true);

    window.addEventListener('hero-overlay-complete', onOverlayDone);

    return () => {
      window.removeEventListener('hero-overlay-complete', onOverlayDone);
    };
  }, [isHomePage]);

  const isRevealed = overlayFinished;

  if (!isHomePage) {
    return (
      <>
        <header className='fixed top-0 left-0 right-0 z-100'>{children}</header>
        <div aria-hidden className='h-36 sm:h-32' />
      </>
    );
  }

  return (
    <motion.header
      initial={false}
      animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease: [0.25, 0, 0, 1] }}
      className='fixed top-0 left-0 right-0 z-100'
      style={{
        pointerEvents: isRevealed ? 'auto' : 'none',
        visibility: isRevealed ? 'visible' : 'hidden',
      }}
    >
      {children}
    </motion.header>
  );
}

export default NavbarWithReveal;
