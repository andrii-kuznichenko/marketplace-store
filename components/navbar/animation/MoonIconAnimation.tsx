import { motion } from 'motion/react';
import React from 'react';

function MoonIconAnimation({
  children,
  isDark,
}: {
  children: React.ReactNode;
  isDark: boolean;
}) {
  return (
    <motion.span
      className='-ml-[1.2rem] grid h-[1.2rem] w-[1.2rem] place-items-center'
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
                opacity: 1,
                rotate: 0,
                scaleX: 1,
                scaleY: 1,
              }
            : {
                opacity: 0,
                rotate: -24,
                scaleX: 0.8,
                scaleY: 1.08,
              }
        }
        transition={{
          duration: isDark ? 0.56 : 0.22,
          ease: [0.22, 1, 0.36, 1],
          delay: isDark ? 0.08 : 0,
        }}
        style={{ originX: '50%', originY: '50%' }}
      >
        <motion.span
          initial={false}
          animate={{ scale: isDark ? [0.86, 1.06, 1] : 0.86 }}
          transition={{
            duration: 0.5,
            times: [0, 0.7, 1],
            delay: isDark ? 0.1 : 0,
          }}
          className='relative grid h-full w-full place-items-center'
        >
          {children}
        </motion.span>
      </motion.span>
    </motion.span>
  );
}

export default MoonIconAnimation;
