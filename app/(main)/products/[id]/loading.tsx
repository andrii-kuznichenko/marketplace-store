import { Skeleton } from '@/components/ui/skeleton';

function loading() {
  return (
    <section>
      {/* Breadcrumb */}
      <div className='flex flex-wrap gap-2 items-center'>
        <Skeleton className='h-4 w-12' />
        <Skeleton className='h-4 w-3' />
        <Skeleton className='h-4 w-20' />
        <Skeleton className='h-4 w-3' />
        <Skeleton className='h-4 w-36' />
      </div>

      <div className='mt-6 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16'>
        {/* Gallery */}
        <div className='flex gap-3 aspect-3/4'>
          <div className='flex flex-col gap-2 w-16 shrink-0'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className='w-16 h-20 rounded' />
            ))}
          </div>
          <Skeleton className='flex-1 rounded-xl' />
        </div>

        {/* Info */}
        <div>
          {/* Title + action buttons */}
          <div className='flex items-center justify-between gap-4 mb-3'>
            <Skeleton className='h-9 w-3/4 sm:w-64' />
            <div className='flex gap-2 shrink-0'>
              <Skeleton className='h-9 w-9 rounded-full' />
              <Skeleton className='h-9 w-9 rounded-full' />
            </div>
          </div>

          <Skeleton className='h-4 w-32 mt-1' />
          <Skeleton className='h-6 w-28 mt-2' />
          <Skeleton className='h-9 w-24 mt-3 rounded' />

          <div className='mt-6 space-y-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-3/4' />
          </div>

          <Skeleton className='h-5 w-10 mt-6' />
          <div className='flex gap-2 mt-2'>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className='h-9 w-20 rounded' />
            ))}
          </div>

          <Skeleton className='h-12 w-full mt-4 rounded' />
          <Skeleton className='h-11 w-32 mt-6 rounded' />
        </div>
      </div>
    </section>
  );
}

export default loading;
