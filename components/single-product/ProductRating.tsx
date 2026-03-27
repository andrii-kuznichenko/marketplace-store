import { FaStar } from 'react-icons/fa';

function ProductRating({ productId }: { productId: string }) {
  //TODO
  const rating = 4.2;
  const count = 25;

  const className = `flex gap-1 items-center text-md nmt-1 mb-4`;
  const countValue = `(${count}) reviews`;

  return (
    <span className={className}>
      <FaStar className='w-6 h-6' />
      {rating} {countValue}
    </span>
  );
}

export default ProductRating;
