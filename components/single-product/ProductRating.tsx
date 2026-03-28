import { FaStar } from 'react-icons/fa';

function ProductRating({
  productId,
  isReviewShown = true,
}: {
  productId: string;
  isReviewShown?: boolean;
}) {
  //TODO
  const rating = 4.2;
  const count = 25;

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
