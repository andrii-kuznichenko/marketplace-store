import { Skeleton } from '@/components/ui/skeleton';

function CartItemSkeleton() {
  return (
    <div className='relative flex flex-col gap-y-4 md:flex-row md:flex-wrap md:items-start md:justify-between p-6 mb-8 border rounded-lg gap-x-4'>
      {/* Image + info row */}
      <div className='flex gap-x-4'>
        <Skeleton className='w-24 sm:w-32 shrink-0 aspect-3/4 rounded' />
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-3 w-16' />
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-5 w-20 mt-2' />
          <Skeleton className='h-3 w-24 mt-2' />
          <Skeleton className='h-3 w-24' />
          <Skeleton className='h-3 w-28 mt-2' />
        </div>
      </div>
      {/* Quantity selector */}
      <Skeleton className='h-9 w-28 rounded md:ml-8' />
      {/* Delete button — absolute on mobile, static on md+ */}
      <Skeleton className='absolute top-2 right-3 md:static h-8 w-8 rounded' />
    </div>
  );
}

function loading() {
  return (
    <>
      <Skeleton className='h-9 w-48 mb-8' />
      <Skeleton className='h-px w-full mb-8' />

      <div className='mt-8 grid gap-4 lg:grid-cols-12'>
        <div className='lg:col-span-8 space-y-4'>
          <CartItemSkeleton />
          <CartItemSkeleton />
        </div>

        <div className='lg:col-span-4'>
          {/* Delivery address */}
          <div className='border rounded-xl p-6 mb-4'>
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-5 w-5 rounded' />
                <Skeleton className='h-5 w-36' />
              </div>
              <Skeleton className='h-4 w-8' />
            </div>
            <div className='space-y-1.5'>
              <Skeleton className='h-4 w-40' />
              <Skeleton className='h-4 w-full sm:w-52' />
              <Skeleton className='h-4 w-36' />
              <Skeleton className='h-4 w-24' />
            </div>
          </div>

          {/* Totals */}
          <div className='border rounded-xl p-8'>
            <div className='flex justify-between mb-2'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-4 w-20' />
            </div>
            <Skeleton className='h-px w-full my-2' />
            <div className='flex justify-between mb-2'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-4 w-16' />
            </div>
            <Skeleton className='h-px w-full my-2' />
            <div className='flex justify-between mb-2'>
              <Skeleton className='h-3 w-24' />
              <Skeleton className='h-3 w-14' />
            </div>
            <Skeleton className='h-px w-full my-2' />
            <div className='flex justify-between mt-6'>
              <Skeleton className='h-5 w-24' />
              <Skeleton className='h-5 w-24' />
            </div>
          </div>

          <Skeleton className='h-11 w-full mt-8 rounded-md' />
        </div>
      </div>
    </>
  );
}

export default loading;
