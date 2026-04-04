'use client';

import { motion } from 'motion/react';
import React from 'react';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.15, staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function AnimatedGridContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={container}
      initial='hidden'
      animate='visible'
      className='pt-12 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
    >
      {children}
    </motion.div>
  );
}

export function AnimatedGridItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div className='group relative h-full' variants={item}>
      {children}
    </motion.div>
  );
}
