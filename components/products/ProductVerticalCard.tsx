import Link from 'next/link';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { fetchAllProducts } from '@/utils/actions/productActions';
import { formatCurrency } from '@/utils/format';
import ProductRating from '../single-product/ProductRating';

type Product = Awaited<ReturnType<typeof fetchAllProducts>>[number];

function ProductVerticalCard({ product }: { product: Product }) {
  const { id, name, price, media, company } = product;
  const image = media[0]?.url ?? '';
  const currencyAmount = formatCurrency(price);
  return (
    <Link href={`/products/${id}`}>
      <Card className='h-full transform group-hover:shadow-sm transition-shadow duration-200'>
        <CardContent className='flex h-full flex-col p-4'>
          <div className='relative aspect-2/3 overflow-hidden'>
            <Image
              src={image}
              alt={name}
              fill
              sizes={'(max-width:768px) 100vw, max-width:1200px) 50vw, 33vw'}
              priority
              className='rounded w-full object-cover transform group-hover:scale-105 transition-transform duration-200'
              loading='eager'
            />
          </div>
          <div className='mt-4 flex flex-1 flex-col'>
            <div className='mt-4 mb-1'>
              <ProductRating productId={product.id} isReviewShown={false} />
              <h2 className='font-light text-sm md:text-base'>{company.name}</h2>
            </div>
            <h3 className='min-h-14 text-base md:text-lg capitalize'>{name}</h3>
            <p className='text-muted-foreground mt-2'>{currencyAmount} </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default ProductVerticalCard;
