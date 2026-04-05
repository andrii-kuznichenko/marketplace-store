import { fetchProductRating } from '@/utils/actions/reviewActions';
import { FaStar } from 'react-icons/fa';

async function ProductRating({
  productId,
  isReviewShown = true,
}: {
  productId: string;
  isReviewShown?: boolean;
}) {
  const { count, rating } = await fetchProductRating(productId);
  const className = `flex gap-2 items-center text-md nmt-1 mb-4`;
  const countValue = `(${count}) reviews`;

  return (
    <span className={className}>
      <FaStar className='w-6 h-6' />
      {rating} {isReviewShown && countValue}
    </span>
  );
}

export default ProductRating;
