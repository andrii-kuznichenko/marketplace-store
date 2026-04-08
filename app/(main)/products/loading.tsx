import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

function ProductCardSkeleton() {
  return (
    <Card>
      <CardContent className='p-4'>
        <div className='relative'>
          <Skeleton className='aspect-2/3 w-full rounded' />
          {/* Favourite button */}
          <Skeleton className='absolute top-2 right-2 h-8 w-8 rounded-full' />
        </div>
        <div className='flex justify-between mt-4 mb-1'>
          <Skeleton className='h-4 w-24' />
          <div className='flex items-center gap-1'>
            <Skeleton className='h-4 w-4' />
            <Skeleton className='h-4 w-6' />
          </div>
        </div>
        <Skeleton className='h-5 w-3/4 mt-1' />
        <Skeleton className='h-4 w-1/3 mt-2' />
      </CardContent>
    </Card>
  );
}

function loading() {
  return (
    <div>
      {/* Top bar: product count + layout toggles */}
      <div className='flex items-center justify-between mb-4'>
        <Skeleton className='h-4 w-24' />
        <div className='flex gap-2'>
          <Skeleton className='h-9 w-9 rounded-full' />
          <Skeleton className='h-9 w-9 rounded-full' />
        </div>
      </div>
      <Skeleton className='h-px w-full mb-8' />

      <div className='grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default loading;
