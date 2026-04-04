'use client'


import { usePathname } from 'next/navigation';
import FormContainer from '../form/FormContainer';
import { toggleFavouriteAction } from '@/utils/actions/favouriteActions';
import { CardSubmitButton } from '../form/Buttons';

type FavouriteToggleFormProps = {
  productId: string;
  favouriteId: string | null;
};

function FavoriteToggleForm(props: FavouriteToggleFormProps) {
  const { productId, favouriteId } = props;
  const pathname = usePathname();
  const toggleAction = toggleFavouriteAction.bind(null, {
    productId,
    favouriteId,
    pathname,
  });
  return (
    <FormContainer action={toggleAction}>
      <CardSubmitButton isFavourite={favouriteId ? true : false} />
    </FormContainer>
  );
}

export default FavoriteToggleForm;
