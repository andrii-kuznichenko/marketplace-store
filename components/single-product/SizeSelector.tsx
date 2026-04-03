'use client';

import { useState } from 'react';

type Size = { id: string; size: string; inStock: boolean };

function SizeSelector({ sizes }: { sizes: Size[] }) {
  const [selected, setSelected] = useState<string | null>(null);

  if (sizes.length === 0) return null;

  return (
    <div className='mt-4'>
      <p className='font-medium mb-3'>
        Size{selected ? `: ${selected}` : ''}
      </p>
      <div className='flex flex-wrap gap-2'>
        {sizes.map((s) => (
          <button
            key={s.id}
            type='button'
            disabled={!s.inStock}
            onClick={() => s.inStock && setSelected(s.size)}
            className={[
              'px-4 py-2 rounded-md border text-sm font-medium transition-colors',
              !s.inStock && 'border-border text-muted-foreground line-through cursor-not-allowed opacity-50',
              s.inStock && selected === s.size && 'border-primary bg-primary text-primary-foreground',
              s.inStock && selected !== s.size && 'border-border hover:border-foreground',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {s.size}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SizeSelector;
