import BreadCrumbs from '@/components/single-product/BreadCrumbs';
import FavouriteToggleButton from '@/components/products/FavouriteToggleButton';
import AddToCart from '@/components/single-product/AddToCart';
import ProductRating from '@/components/single-product/ProductRating';
import ProductMediaGallery from '@/components/single-product/ProductMediaGallery';
import ColorVariantSelector from '@/components/single-product/ColorVariantSelector';
import SizeSelector from '@/components/single-product/SizeSelector';
import ProductDetails from '@/components/single-product/ProductDetails';
import { fetchSingleProduct } from '@/utils/actions/productActions';
import { formatCurrency } from '@/utils/format';
import ShareButton from '@/components/single-product/ShareButton';
import SubmitReview from '@/components/reviews/SubmitReview';
import ProductReviews from '@/components/reviews/ProductReviews';
import { auth, currentUser } from '@clerk/nextjs/server';
import { findExistingReview } from '@/utils/actions/reviewActions';

async function SingleProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchSingleProduct(id);
  const {
    name,
    description,
    price,
    media,
    company,
    sizes,
    customFields,
    colorGroup,
  } = product;
  const currencyAmount = formatCurrency(price);

  const colorVariants = colorGroup?.products ?? [];
  const user = await currentUser();
  const reviewDoesNotExist = user && !(await findExistingReview(user.id, id));

  return (
    <section>
      <BreadCrumbs name={name} />
      <div className='mt-6 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16'>
        <ProductMediaGallery media={media} name={name} />
        <div>
          <div className='flex items-center gap-x-8 mb-3'>
            <h1 className='text-3xl font-bold capitalize'>{name}</h1>
            <div className='flex items-center gap-x-2'>
              <FavouriteToggleButton productId={id} />
              <ShareButton name={product.name} productId={id} />
            </div>
          </div>
          <ProductRating productId={id} />
          <h4 className='mt-2 text-xl'>{company.name}</h4>
          <p className='mt-3 inline-block rounded bg-muted p-2 text-md'>
            {currencyAmount}
          </p>
          <p className='mt-6 leading-8 text-muted-foreground'>{description}</p>

          <ColorVariantSelector
            variants={colorVariants}
            currentProductId={id}
          />
          <SizeSelector sizes={sizes} />
          <AddToCart productId={id} />
          <ProductDetails fields={customFields} />
        </div>
      </div>
      <ProductReviews productId={id} />
      {reviewDoesNotExist && <SubmitReview productId={id} />}
    </section>
  );
}

export default SingleProductPage;
