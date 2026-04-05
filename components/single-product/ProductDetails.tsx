'use client';

import { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type CustomField = { id: string; name: string; value: string };

function ProductDetails({ fields }: { fields: CustomField[] }) {
  const [open, setOpen] = useState(false);

  if (fields.length === 0) return null;

  return (
    <div className='mt-6 border'>
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='flex items-center justify-between w-full px-4 py-3'
      >
        <span className='font-semibold text-lg'>Details</span>
        <motion.div
          animate={{ rotate: open ? 0 : 180 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          <ChevronUp className='w-5 h-5' />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className='overflow-hidden'
          >
            <div className='px-4 pb-4 space-y-2'>
              {fields.map((field, i) => (
                <motion.p
                  key={field.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.05, ease: 'easeOut' }}
                  className='text-sm'
                >
                  <span className='font-semibold'>{field.name}:</span> {field.value}
                </motion.p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProductDetails;
