import { IoMdStar, IoMdStarOutline } from 'react-icons/io';

function Rating({ rating }: { rating: number }) {
  const stars = Array.from({ length: 5 }, (_, index) => index + 1 <= rating);
  return (
    <div className='flex items-center gap-x-1'>
      {stars.map((isFilld, index) => {
        const className = `w-3 h-3 ${isFilld ? 'text-primary' : 'text-grey'}`;
        return isFilld ? (
          <IoMdStar className={className} key={index} />
        ) : (
          <IoMdStarOutline className={className} key={index} />
        );
      })}
    </div>
  );
}

export default Rating;
