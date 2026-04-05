import { fetchProductReviews } from '@/utils/actions/reviewActions';
import ReviewCard from './ReviewCard';
import { Separator } from '../ui/separator';

async function ProductReviews({ productId }: { productId: string }) {
  const reviews = await fetchProductReviews(productId);

  return (
    <div className='mt-16'>
      <Separator />
      <div className='grid md:grid-cols-2 gap-8 my-8'>

      {reviews.map((review) => {
        const { comment, rating, authorImageUrl, authorName, productId } = review;
        const reviewInfo = {
          comment,
          rating,
          image: authorImageUrl,
          name: authorName,
          productId,
        };
        return <ReviewCard key={review.id} reviewInfo={reviewInfo} />;
      })}
      </div>
    </div>
  );
}

export default ProductReviews;
