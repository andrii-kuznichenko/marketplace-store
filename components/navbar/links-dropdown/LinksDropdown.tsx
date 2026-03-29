import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/animated/dropdown-menu';
import { LuAlignLeft } from 'react-icons/lu';
import { Button } from '../../ui/button';
import UserIcon from '../UserIcon';
import AnimatedPushButton from '../../global/animation/AnimatedPushButton';
import GuestLinks from './GuestLinks';
import LinksSignIn from './LinksSignIn';

function LinksDropdown() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant={'outline'} className='flex gap-4 max-width-[100px]'>
          <AnimatedPushButton>
            <LuAlignLeft className='w-6 h-6' />
          </AnimatedPushButton>
          <AnimatedPushButton>
            <UserIcon />
          </AnimatedPushButton>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-40' align='start' sideOffset={10}>
        <GuestLinks />
        <LinksSignIn />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LinksDropdown;
