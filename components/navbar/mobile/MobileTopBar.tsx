import NavSearch from '../NavSearch';
import DarkMode from '../DarkMode';
import Logo from '../Logo';
import { Suspense } from 'react';

function MobileTopBar() {
  return (
    <nav className='md:hidden border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80'>
      <div className='flex items-center gap-3 px-4 py-3'>
        <Logo />
        <div className='flex-1'>
          <Suspense>
            <NavSearch />
          </Suspense>
        </div>
        <DarkMode />
      </div>
    </nav>
  );
}

export default MobileTopBar;
