'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const HERO_LINES = ['We create style', 'people choose', 'every day.'];

export function Hero() {
  const [overlayDone, setOverlayDone] = useState(false);

  useEffect(() => {
    if (overlayDone) {
      document.body.style.overflow = '';
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [overlayDone]);

  const handleOverlayDone = () => {
    setOverlayDone(true);
    window.dispatchEvent(new Event('hero-overlay-complete'));
  };

  return (
    <section className='relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-[5vw] py-[4vh] box-border'>
      <ColorOverlay onDone={handleOverlayDone} />
      <HeroText lines={HERO_LINES} visible={overlayDone} />
    </section>
  );
}

function ColorOverlay({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      className='absolute inset-0 z-10 bg-primary'
      style={{ originY: 0 }}
      initial={{ y: '0%' }}
      animate={{ y: '-100%' }}
      transition={{
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1],
        delay: 0.4,
      }}
      onAnimationComplete={onDone}
    />
  );
}

export default Hero;

function HeroText({ lines, visible }: { lines: string[]; visible: boolean }) {
  return (
    <div className='relative z-1 w-full'>
      {lines.map((line, i) => (
        <div key={i} className='overflow-hidden leading-[1.05]'>
          <motion.p
            className='m-0 text-[clamp(3.5rem,14vw,9rem)] font-light tracking-[-0.05em] text-black dark:text-white'
            initial={{ y: '110%' }}
            animate={visible ? { y: '0%' } : { y: '110%' }}
            transition={{
              duration: 0.9,
              ease: [0.76, 0, 0.24, 1],
              delay: i * 0.08,
            }}
          >
            {line}
          </motion.p>
        </div>
      ))}
    </div>
  );
}
