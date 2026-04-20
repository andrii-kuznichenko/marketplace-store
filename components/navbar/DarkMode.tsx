'use client';

import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import SunIconAnimation from './animation/SunIconAnimation';
import MoonIconAnimation from './animation/MoonIconAnimation';

export default function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      variant='outline'
      size='icon'
      className='md:h-9 md:w-9 h-10 w-10'
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <SunIconAnimation isDark={isDark}>
        <SunIcon className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
      </SunIconAnimation>
      <MoonIconAnimation isDark={isDark}>
        <MoonIcon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
      </MoonIconAnimation>
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
