import BreadCrumbs from '@/components/single-product/BreadCrumbs';
import FavouriteToggleButton from '@/components/products/FavouriteToggleButton';
import AddToCart from '@/components/single-product/AddToCart';
import ProductRating from '@/components/single-product/ProductRating';
import { fetchSingleProduct } from '@/utils/actions';
import { formatCurrency } from '@/utils/format';
import Image from 'next/image';

async function SingleProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchSingleProduct(id);
  const { name, image, description, price, company } = product;
  const currencyAmount = formatCurrency(price);

  return (
    <section>
      <BreadCrumbs name={name} />
      <div className='mt-6 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16'>
        <div className='relative aspect-2/3 w-full overflow-hidden rounded-xl'>
          <Image
            src={image}
            alt={name}
            fill
            sizes='(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw'
            priority
            loading='eager'
            className='object-cover'
          />
        </div>
        <div>
          <div className='flex items-center gap-x-8 mb-3'>
            <h1 className='text-3xl font-bold capitalize'>{name}</h1>
            <FavouriteToggleButton productId={id} />
          </div>
          <ProductRating productId={id} />
          <h4 className='mt-2 text-xl'>{company}</h4>
          <p className='mt-3 inline-block rounded bg-muted p-2 text-md'>
            {currencyAmount}
          </p>
          <p className='mt-6 leading-8 text-muted-foreground'>{description}</p>
          <AddToCart productId={id} />
        </div>
      </div>
    </section>
  );
}

export default SingleProductPage;
