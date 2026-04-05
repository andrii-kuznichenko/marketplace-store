'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';

function Comment({ comment }: { comment: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const longComment = comment.length > 130;

  return (
    <div>
      <div className='text-sm overflow-hidden'>
        <AnimatePresence initial={false} mode='wait'>
          {isExpanded ? (
            <motion.p
              key='full'
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              {comment}
            </motion.p>
          ) : (
            <motion.p
              key='short'
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              {longComment ? `${comment.slice(0, 130)}...` : comment}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      {longComment && (
        <Button
          variant='link'
          className='pl-0 text-muted-foreground'
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>
      )}
    </div>
  );
}

export default Comment;
