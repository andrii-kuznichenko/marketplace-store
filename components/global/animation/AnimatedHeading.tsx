'use client';

import { motion } from 'motion/react';

const words = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const word = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const badge = {
  hidden: { opacity: 0, scale: 0.8, rotate: -4 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: 0.25,
    },
  },
};

export function AnimatedHeading({
  firstWord,
  secondWord,
}: {
  firstWord: string;
  secondWord: string;
}) {
  return (
    <motion.h2
      variants={words}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.6 }}
      className='flex flex-wrap gap-2 sm:gap-x-4 items-center justify-center text-2xl font-light leading-none tracking-wide sm:text-5xl'
    >
      <motion.span variants={word}>{firstWord}</motion.span>

      <motion.span
        variants={badge}
        className='py-2 px-4 rounded-lg tracking-widest bg-linear-to-br from-blue-500 via-violet-500 to-pink-500 bg-clip-text text-transparent ring-1 ring-violet-500/40'
      >
        {secondWord}
      </motion.span>
    </motion.h2>
  );
}
