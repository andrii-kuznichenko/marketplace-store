'use client';

import {
  forwardRef,
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useLiquidToggleContext } from './LiquidToggleGroup';

type LiquidToggleItemProps = {
  value: string;
  children: ReactNode;
  className?: string;
} & Omit<
  ComponentPropsWithoutRef<'div'>,
  | 'children'
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
>;

const LiquidToggleItem = forwardRef<HTMLDivElement, LiquidToggleItemProps>(
  function LiquidToggleItem({ value, children, className, ...props }, ref) {
    const localRef = useRef<HTMLDivElement | null>(null);
    const { activeValue, hoveredValue, setHoveredValue, registerItem } =
      useLiquidToggleContext();

    const highlightedValue = hoveredValue ?? activeValue;
    const isHighlighted = highlightedValue === value;

    useEffect(() => {
      registerItem(value, localRef.current);
      return () => registerItem(value, null);
    }, [registerItem, value]);

    function setRefs(node: HTMLDivElement | null) {
      localRef.current = node;

      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }

    return (
      <motion.div
        ref={setRefs}
        data-value={value}
        data-highlighted={isHighlighted}
        className={cn(
          'relative z-10 flex items-center justify-center rounded-full',
          '[&>button]:relative [&>button]:z-10 [&>button]:rounded-full [&>button]:bg-transparent! [&>button]:shadow-none!',
          '[&>button]:border-transparent! [&>button]:transition-colors [&>button]:duration-300',
          '[&>a]:relative [&>a]:z-10 [&>a]:rounded-full [&>a]:bg-transparent! [&>a]:shadow-none!',
          '[&>a]:border-transparent! [&>a]:transition-colors [&>a]:duration-300',
          '**:transition-colors **:duration-300',
          isHighlighted
            ? '[&>button]:text-primary-foreground! [&>a]:text-primary-foreground! [&_svg]:text-primary-foreground!'
            : '[&>button]:text-foreground/80! [&>a]:text-foreground/80! [&_svg]:text-foreground/80!',
          className,
        )}
        onMouseEnter={() => setHoveredValue(value)}
        onFocus={() => setHoveredValue(value)}
        onBlur={() => setHoveredValue(null)}
        animate={{
          scale: isHighlighted ? [1, 0.988, 1.018, 1] : 1,
        }}
        transition={{
          duration: 0.74,
          times: [0, 0.42, 0.76, 1],
          ease: [0.16, 0.86, 0.22, 1],
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

export default LiquidToggleItem;
