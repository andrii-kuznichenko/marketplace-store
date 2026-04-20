import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

function OrderSkeleton() {
  return (
    <div>
      <div className='flex items-center justify-between py-4'>
        <Skeleton className='h-4 w-40 sm:w-64' />
        <Skeleton className='h-4 w-16 sm:w-24' />
      </div>
      <Separator />
      <div className='flex flex-wrap gap-x-8 gap-y-3 py-4'>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-4 w-28' />
        </div>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-12' />
          <Skeleton className='h-4 w-20' />
        </div>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-28' />
          <Skeleton className='h-4 w-16' />
        </div>
      </div>
      <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 mt-2'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className='flex flex-col gap-1'>
            <Skeleton className='aspect-2/3 w-full rounded' />
            <Skeleton className='h-3 w-3/4' />
            <Skeleton className='h-3 w-1/2' />
          </div>
        ))}
      </div>
      <Separator className='mt-8' />
    </div>
  );
}

function loading() {
  return (
    <div className='mt-8 space-y-12'>
      <div>
        <Skeleton className='h-8 w-32 mb-8' />
        <Separator />
        <div className='mt-6 space-y-8'>
          <OrderSkeleton />
          <OrderSkeleton />
        </div>
      </div>
    </div>
  );
}

export default loading;
