import { Suspense } from 'react';
import DarkMode from '../DarkMode';
import Logo from '../Logo';
import NavSearch from '../NavSearch';
import MobileSidebar from './MobileSidebar';
import MobileCartButton from './MobileCartButton';

function MobileTopBar() {
  return (
    <nav className='md:hidden border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80'>
      <div className='flex items-center justify-between px-4 py-3'>
        <Logo />
        <div className='flex items-center gap-2'>
          <DarkMode />
          <MobileCartButton />
          <MobileSidebar />
        </div>
      </div>
      <div className='flex justify-center px-4 pb-3'>
        <Suspense>
          <NavSearch />
        </Suspense>
      </div>
    </nav>
  );
}

export default MobileTopBar;
