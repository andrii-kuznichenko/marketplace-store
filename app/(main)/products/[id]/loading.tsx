import { Skeleton } from '@/components/ui/skeleton';

function loading() {
  return (
    <section>
      <div className='flex gap-2 items-center'>
        <Skeleton className='h-4 w-12' />
        <Skeleton className='h-4 w-3' />
        <Skeleton className='h-4 w-20' />
        <Skeleton className='h-4 w-3' />
        <Skeleton className='h-4 w-36' />
      </div>

      <div className='mt-6 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16'>
        {/* Left: gallery */}
        <div className='flex gap-3'>
          {/* Thumbnails */}
          <div className='flex flex-col gap-2'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className='w-16 h-20 rounded' />
            ))}
          </div>
          {/* Main image */}
          <Skeleton className='flex-1 aspect-3/4 rounded-xl' />
        </div>

        {/* Right: info */}
        <div>
          {/* Title + buttons */}
          <div className='flex items-center gap-x-8 mb-3'>
            <Skeleton className='h-9 w-64' />
            <div className='flex gap-2'>
              <Skeleton className='h-9 w-9 rounded-full' />
              <Skeleton className='h-9 w-9 rounded-full' />
            </div>
          </div>

          {/* Rating */}
          <Skeleton className='h-4 w-32 mt-1' />

          {/* Company */}
          <Skeleton className='h-6 w-28 mt-2' />

          {/* Price */}
          <Skeleton className='h-9 w-24 mt-3 rounded' />

          {/* Description */}
          <div className='mt-6 space-y-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-3/4' />
          </div>

          {/* Sizes */}
          <Skeleton className='h-5 w-10 mt-6' />
          <div className='flex gap-2 mt-2'>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className='h-9 w-20 rounded' />
            ))}
          </div>

          {/* Details accordion */}
          <Skeleton className='h-12 w-full mt-4 rounded' />

          {/* Add to cart */}
          <Skeleton className='h-11 w-32 mt-6 rounded' />
        </div>
      </div>
    </section>
  );
}

export default loading;
