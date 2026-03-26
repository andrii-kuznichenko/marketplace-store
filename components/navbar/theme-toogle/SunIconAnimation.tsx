import { motion } from 'motion/react';
import React from 'react';

function SunIconAnimation({
  children,
  isDark,
}: {
  children: React.ReactNode;
  isDark: boolean;
}) {
  return (
    <motion.span
      className='grid h-[1.2rem] w-[1.2rem] place-items-center'
      initial={false}
      animate={{ rotate: isDark ? 0 : 180 }}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.span
        className='col-start-1 row-start-1 grid h-full w-full place-items-center'
        initial={false}
        animate={
          isDark
            ? {
                opacity: 0,
                rotate: 26,
                scaleX: 0.68,
                scaleY: 1.14,
              }
            : {
                opacity: 1,
                rotate: 0,
                scaleX: 1,
                scaleY: 1,
              }
        }
        transition={{
          duration: isDark ? 0.28 : 0.52,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ originX: '50%', originY: '50%' }}
      >
        <motion.span
          initial={false}
          animate={{ scale: isDark ? 0.92 : 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 18,
          }}
          className='grid h-full w-full place-items-center'
        >
          {children}
        </motion.span>
      </motion.span>
    </motion.span>
  );
}

export default SunIconAnimation;
