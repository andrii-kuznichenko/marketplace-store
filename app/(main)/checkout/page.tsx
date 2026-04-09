'use client';

import { useState, Suspense } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Checkout from '@/components/stripe/Checkout';

const TEST_CARDS = [
  { brand: 'Visa', number: '4242 4242 4242 4242' },
  { brand: 'Visa (debit)', number: '4000 0566 5566 5556' },
  { brand: 'Mastercard', number: '5555 5555 5555 4444' },
  { brand: 'Mastercard (2-series)', number: '2223 0031 2200 3222' },
  { brand: 'Mastercard (debit)', number: '5200 8282 8282 8210' },
  { brand: 'Mastercard (prepaid)', number: '5105 1051 0510 5100' },
];

export default function Page() {
  const [open, setOpen] = useState(false);

  return (
    <div id='checkout'>
      <div className='mb-8 border'>
        <button
          type='button'
          onClick={() => setOpen(!open)}
          className='flex items-center justify-between w-full px-4 py-3'
        >
          <span className='font-semibold text-lg'>Test card numbers</span>
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
              <table className='w-full text-sm border-t'>
                <thead>
                  <tr className='bg-muted text-muted-foreground text-xs uppercase tracking-wide'>
                    <th className='text-left px-4 py-3'>Brand</th>
                    <th className='text-left px-4 py-3'>Number</th>
                    <th className='text-left px-4 py-3'>CVC</th>
                    <th className='text-left px-4 py-3'>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {TEST_CARDS.map((card) => (
                    <tr key={card.number} className='border-t'>
                      <td className='px-4 py-3'>{card.brand}</td>
                      <td className='px-4 py-3 font-mono'>{card.number}</td>
                      <td className='px-4 py-3 text-muted-foreground'>Any 3 digits</td>
                      <td className='px-4 py-3 text-muted-foreground'>Any future date</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Suspense>
        <Checkout />
      </Suspense>
    </div>
  );
}
