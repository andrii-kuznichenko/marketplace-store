'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import FormContainer from '../form/FormContainer';
import { createReviewAction } from '@/utils/actions/reviewActions';
import RatingInput from './RatingInput';
import TextAreaInput from '../form/TextAreaInput';
import { SubmitButton } from '../form/Buttons';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, delay: delay * 0.5, ease: 'easeOut' as const },
});

function SubmitReview({ productId }: { productId: string }) {
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
  const { user } = useUser();
  return (
    <div className='flex flex-col items-center w-full'>
      <Button
        size='lg'
        className='capitalize'
        onClick={() => setIsReviewFormVisible((prev) => !prev)}
      >
        Leave Feedback
      </Button>
      <AnimatePresence>
        {isReviewFormVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 8,
              transition: { duration: 0.1 },
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className='mt-8 w-full max-w-2xl'
          >
            <Card className='p-4 sm:p-8'>
              <FormContainer action={createReviewAction}>
                <div className='flex flex-col w-full'>
                  <input type='hidden' name='productId' value={productId} />
                  <input
                    type='hidden'
                    name='authorImageUrl'
                    value={user?.imageUrl}
                  />
                  <input
                    type='hidden'
                    name='authorName'
                    value={user?.username || user?.firstName || 'user'}
                  />

                  <motion.div className='flex justify-center' {...fadeUp(0.1)}>
                    <RatingInput name='rating' />
                  </motion.div>

                  <motion.div {...fadeUp(0.3)}>
                    <TextAreaInput name='comment' label='feedback' />
                  </motion.div>

                  <motion.div {...fadeUp(0.4)}>
                    <SubmitButton className='mt-4' />
                  </motion.div>
                </div>
              </FormContainer>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SubmitReview;
