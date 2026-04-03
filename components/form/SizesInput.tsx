'use client';

import { useState } from 'react';
import { Label } from '../ui/label';

type SizeEntry = { size: string; inStock: boolean };
type SizeState = 'unselected' | 'inStock' | 'outOfStock';

const PREDEFINED_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'ONE SIZE'];

function getNextState(current: SizeState): SizeState {
  if (current === 'unselected') return 'inStock';
  if (current === 'inStock') return 'outOfStock';
  return 'unselected';
}

function SizesInput({ defaultSizes = [] }: { defaultSizes?: SizeEntry[] }) {
  const initialStates: Record<string, SizeState> = {};
  for (const s of defaultSizes) {
    initialStates[s.size] = s.inStock ? 'inStock' : 'outOfStock';
  }

  const [sizeStates, setSizeStates] = useState<Record<string, SizeState>>(initialStates);

  const toggle = (size: string) => {
    setSizeStates((prev) => ({
      ...prev,
      [size]: getNextState(prev[size] ?? 'unselected'),
    }));
  };

  const selectedSizes: SizeEntry[] = PREDEFINED_SIZES.filter(
    (s) => sizeStates[s] && sizeStates[s] !== 'unselected',
  ).map((s) => ({ size: s, inStock: sizeStates[s] === 'inStock' }));

  return (
    <div className='mb-4'>
      <Label className='mb-2 block'>Sizes</Label>
      <p className='text-xs text-muted-foreground mb-3'>
        Click once — In Stock &nbsp;|&nbsp; Click twice — Out of Stock &nbsp;|&nbsp; Click again — remove
      </p>
      <div className='flex flex-wrap gap-2'>
        {PREDEFINED_SIZES.map((size) => {
          const state = sizeStates[size] ?? 'unselected';
          return (
            <button
              key={size}
              type='button'
              onClick={() => toggle(size)}
              className={[
                'px-3 py-1.5 rounded-md border text-sm font-medium transition-colors',
                state === 'unselected' && 'border-border bg-background text-muted-foreground hover:bg-muted',
                state === 'inStock' && 'border-green-600 bg-green-600 text-white',
                state === 'outOfStock' && 'border-destructive bg-destructive/10 text-destructive line-through',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {size}
              {state === 'inStock' && <span className='ml-1 text-xs opacity-80'>✓</span>}
              {state === 'outOfStock' && <span className='ml-1 text-xs opacity-80'>✗</span>}
            </button>
          );
        })}
      </div>
      <input type='hidden' name='sizes' value={JSON.stringify(selectedSizes)} />
    </div>
  );
}

export default SizesInput;
