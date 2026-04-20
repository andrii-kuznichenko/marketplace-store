import LoadingTable from '@/components/global/LoadingTable';
import { Skeleton } from '@/components/ui/skeleton';

function AdminSaleCardSkeleton() {
  return (
    <div className='rounded-lg border border-border p-4 flex flex-col gap-2'>
      <div className='flex items-start justify-between gap-2'>
        <div className='space-y-1'>
          <Skeleton className='h-4 w-28' />
          <Skeleton className='h-3 w-36' />
        </div>
        <Skeleton className='h-4 w-16 shrink-0' />
      </div>
      <div className='flex gap-3'>
        <Skeleton className='h-3 w-24' />
        <Skeleton className='h-3 w-14' />
      </div>
      <div className='flex gap-3'>
        <Skeleton className='h-3 w-10' />
        <Skeleton className='h-3 w-20' />
      </div>
      <div className='flex items-center justify-between pt-2 border-t border-border'>
        <Skeleton className='h-3 w-20' />
        <Skeleton className='h-8 w-16 rounded' />
      </div>
    </div>
  );
}

function loading() {
  return (
    <>
      <div className='hidden md:block'>
        <Skeleton className='h-8 w-32 mb-6' />
        <LoadingTable rows={8} />
      </div>
      <div className='md:hidden space-y-3 mt-4'>
        <Skeleton className='h-8 w-32 mb-2' />
        {Array.from({ length: 5 }).map((_, i) => (
          <AdminSaleCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}

export default loading;
