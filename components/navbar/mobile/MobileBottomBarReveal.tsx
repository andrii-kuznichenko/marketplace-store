'use client';

import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { pageLinks } from '@/utils/links';

function MobileBottomBarReveal({ children }: { children: React.ReactNode }) {
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
    return () => window.removeEventListener('hero-overlay-complete', onOverlayDone);
  }, [isHomePage]);

  return (
    <motion.div
      initial={false}
      animate={overlayFinished ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: [0.25, 0, 0, 1] }}
      className='fixed bottom-0 left-0 right-0 z-100 md:hidden'
      style={{ pointerEvents: overlayFinished ? 'auto' : 'none' }}
    >
      {children}
    </motion.div>
  );
}

export default MobileBottomBarReveal;
