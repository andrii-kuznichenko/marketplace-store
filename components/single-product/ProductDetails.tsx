'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

type CustomField = { id: string; name: string; value: string };

function ProductDetails({ fields }: { fields: CustomField[] }) {
  const [open, setOpen] = useState(true);

  if (fields.length === 0) return null;

  return (
    <div className='mt-6 border-t pt-4'>
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='flex items-center justify-between w-full'
      >
        <span className='font-semibold text-lg'>Details</span>
        {open ? <ChevronUp className='w-5 h-5' /> : <ChevronDown className='w-5 h-5' />}
      </button>
      {open && (
        <div className='mt-4 space-y-2'>
          {fields.map((field) => (
            <p key={field.id} className='text-sm'>
              <span className='font-semibold'>{field.name}:</span> {field.value}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
