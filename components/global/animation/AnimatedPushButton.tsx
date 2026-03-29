'use client';
import { motion } from 'motion/react';
import React from 'react';

function AnimatedPushButton({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      whileTap={{ scale: 0.9, rotate: -8 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      className='flex'
    >
      {children}
    </motion.span>
  );
}

export default AnimatedPushButton;
