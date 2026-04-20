import Container from '../global/Container';
import Logo from './Logo';
import NavSearch from './NavSearch';
import CartButton from './CartButton';
import DarkMode from './DarkMode';
import LinksDropdown from './links-dropdown/LinksDropdown';
import { Suspense } from 'react';

function Navbar() {
  return (
    <nav className='hidden md:block border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80'>
      <Container className='flex flex-col sm:flex-row sm:justify-between sm:items-center flex-wrap py-8'>
        <Logo />
        <Suspense>
          <NavSearch />
        </Suspense>
        <div className='flex gap-4 items-center'>
          <DarkMode />
          <LinksDropdown />
          <CartButton />
        </div>
      </Container>
    </nav>
  );
}

export default Navbar;
