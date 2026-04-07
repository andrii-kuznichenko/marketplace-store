'use client';

import { useTransition, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';

type Size = { id: string; size: string; inStock: boolean };

function SizeSelector({ sizes }: { sizes: Size[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected = searchParams.get('size');
  const [isPending, startTransition] = useTransition();
  const [pendingSize, setPendingSize] = useState<string | null>(null);

  if (sizes.length === 0) return null;

  const handleSelect = (size: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('size', size);
    setPendingSize(size);
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className='mt-4'>
      <p className='font-medium mb-3'>
        Size{selected ? `: ${selected}` : ''}
      </p>
      <div className='flex flex-wrap gap-2'>
        {sizes.map((size) => (
          <button
            key={size.id}
            type='button'
            disabled={!size.inStock || isPending}
            onClick={() => size.inStock && handleSelect(size.size)}
            className={[
              'relative px-4 py-2 rounded-md border text-sm font-medium transition-colors',
              !size.inStock && 'border-border text-muted-foreground line-through cursor-not-allowed opacity-50',
              size.inStock && selected === size.size && 'border-primary bg-primary text-primary-foreground',
              size.inStock && selected !== size.size && 'border-border hover:border-foreground',
              isPending && pendingSize === size.size && 'opacity-70',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {isPending && pendingSize === size.size ? (
              <LoaderCircle className='h-4 w-4 animate-spin' />
            ) : (
              size.size
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SizeSelector;
