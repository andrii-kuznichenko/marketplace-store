import LoadingTable from '@/components/global/LoadingTable';
import { Skeleton } from '@/components/ui/skeleton';

function AdminProductCardSkeleton() {
  return (
    <div className='rounded-lg border border-border p-4 flex flex-col gap-3'>
      <div className='flex items-start justify-between gap-2'>
        <Skeleton className='h-4 w-36' />
        <Skeleton className='h-4 w-16 shrink-0' />
      </div>
      <div className='flex gap-3'>
        <Skeleton className='h-3 w-20' />
        <Skeleton className='h-3 w-14' />
      </div>
      <div className='flex items-center gap-2 pt-1 border-t border-border'>
        <Skeleton className='h-8 w-8 rounded' />
        <Skeleton className='h-8 w-8 rounded' />
        <Skeleton className='h-8 w-8 rounded' />
      </div>
    </div>
  );
}

function loading() {
  return (
    <>
      <div className='hidden md:block'>
        <LoadingTable rows={10} />
      </div>
      <div className='md:hidden space-y-3 mt-4'>
        <Skeleton className='h-3 w-28' />
        {Array.from({ length: 6 }).map((_, i) => (
          <AdminProductCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}

export default loading;
