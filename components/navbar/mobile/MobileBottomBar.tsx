import Link from 'next/link';
import { CiFilter } from 'react-icons/ci';
import { pageLinks } from '@/utils/links';
import MobileSidebar from './MobileSidebar';
import MobileCartButton from './MobileCartButton';

function MobileBottomBar() {
  return (
    <div className='md:hidden border-t border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80'>
      <div className='flex items-center justify-around px-6 py-3'>
        <Link
          href={pageLinks.products}
          className='flex flex-col items-center gap-0.5 text-xs text-foreground'
        >
          <CiFilter size={22} />
          <span>Products</span>
        </Link>
        <MobileSidebar />
        <MobileCartButton />
      </div>
    </div>
  );
}

export default MobileBottomBar;
