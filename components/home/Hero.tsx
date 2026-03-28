'use client';

import { useState } from 'react';
import { motion } from 'motion/react';

const HERO_LINES = ['We create style', 'people choose', 'every day.'];

export function Hero() {
  const [overlayDone, setOverlayDone] = useState(false);

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
    <div className='relative z-1'>
      {lines.map((line, i) => (
        <div key={i} className='overflow-hidden leading-[1.05]'>
          <motion.p
            className='m-0 text-9xl font-light tracking-[-0.03em] text-black dark:text-white whitespace-nowrap'
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
