import { Skeleton } from '@/components/ui/skeleton';

function CartItemSkeleton() {
  return (
    <div className='flex gap-4 p-4 border rounded-lg'>
      {/* Image */}
      <Skeleton className='w-32 h-40 rounded shrink-0' />
      {/* Info */}
      <div className='flex flex-col gap-2 flex-1'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-5 w-48' />
        <Skeleton className='h-5 w-24 mt-1' />
        <Skeleton className='h-4 w-28' />
        <Skeleton className='h-4 w-28' />
        <Skeleton className='h-4 w-36 mt-2' />
      </div>
      {/* Quantity + delete */}
      <div className='flex flex-col items-end gap-2'>
        <Skeleton className='h-9 w-24 rounded' />
        <Skeleton className='h-6 w-6 rounded' />
      </div>
    </div>
  );
}

function loading() {
  return (
    <>
      {/* Title */}
      <Skeleton className='h-9 w-48 mb-8' />
      <Skeleton className='h-px w-full mb-8' />

      <div className='mt-8 grid gap-4 lg:grid-cols-12'>
        {/* Left: cart items */}
        <div className='lg:col-span-8 space-y-4'>
          <CartItemSkeleton />
          <CartItemSkeleton />
        </div>

        {/* Right: delivery address + totals */}
        <div className='lg:col-span-4'>
          {/* Delivery address card */}
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
              <Skeleton className='h-4 w-52' />
              <Skeleton className='h-4 w-36' />
              <Skeleton className='h-4 w-24' />
            </div>
          </div>

          {/* Totals card */}
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

          {/* Place Order button */}
          <Skeleton className='h-11 w-full mt-8 rounded-md' />
        </div>
      </div>
    </>
  );
}

export default loading;
