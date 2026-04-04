
import { auth } from '@clerk/nextjs/server';
import { CardSignInButton } from '../form/Buttons';
import { fetchFavouriteId } from '@/utils/actions/favouriteActions';
import FavoriteToggleForm from './FavouriteToggleForm';



async function FavoriteToggleButton({ productId }: { productId: string }) {
  const { userId } = await auth();

  if(!userId) return <CardSignInButton />
  const favouriteId = await fetchFavouriteId({productId})
  
  return (
    <FavoriteToggleForm favouriteId={favouriteId} productId={productId} />
  );
}

export default FavoriteToggleButton;
