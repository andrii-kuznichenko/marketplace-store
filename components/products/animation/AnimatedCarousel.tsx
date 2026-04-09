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

export function AnimatedCarouselContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={container}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.05 }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCarouselItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div className='group relative h-full' variants={item}>
      {children}
    </motion.div>
  );
}
