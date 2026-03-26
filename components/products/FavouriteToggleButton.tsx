import { IoIosHeartEmpty, IoIosHeart } from 'react-icons/io';
import { Button } from '../ui/button';

function FavouriteToggleButton({ productId }: { productId: string }) {
  return (
    <Button size={'icon'} variant={'outline'} className='p-2 cursor-pointer'>
      <IoIosHeartEmpty />
    </Button>
  );
}

export default FavouriteToggleButton;
