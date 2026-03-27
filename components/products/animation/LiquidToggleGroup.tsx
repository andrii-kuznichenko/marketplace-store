'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

type LiquidToggleGroupProps<T extends string> = {
  activeValue: T;
  children: ReactNode;
  className?: string;
  indicatorClassName?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

type IndicatorState = {
  left: number;
  top: number;
  width: number;
  height: number;
  visible: boolean;
};

type LiquidToggleContextValue = {
  activeValue: string;
  hoveredValue: string | null;
  setHoveredValue: (value: string | null) => void;
  registerItem: (value: string, node: HTMLDivElement | null) => void;
};

const LiquidToggleContext = createContext<LiquidToggleContextValue | null>(
  null,
);

export function useLiquidToggleContext() {
  const context = useContext(LiquidToggleContext);

  if (!context) {
    throw new Error('LiquidToggleItem must be used inside LiquidToggleGroup');
  }

  return context;
}

function LiquidToggleGroup<T extends string>({
  activeValue,
  children,
  className,
  indicatorClassName,
  ...props
}: LiquidToggleGroupProps<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef(new Map<string, HTMLDivElement>());
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const [indicator, setIndicator] = useState<IndicatorState>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    visible: false,
  });

  const targetValue = hoveredValue ?? activeValue;
  const isHoverPreview = hoveredValue !== null && hoveredValue !== activeValue;

  const registerItem = useCallback(
    (value: string, node: HTMLDivElement | null) => {
      if (node) {
        itemRefs.current.set(value, node);
        return;
      }

      itemRefs.current.delete(value);
    },
    [],
  );

  const updateIndicator = useCallback(() => {
    const container = containerRef.current;
    const activeNode = itemRefs.current.get(targetValue);

    if (!container || !activeNode) {
      setIndicator((current) => ({ ...current, visible: false }));
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeNode.getBoundingClientRect();

    setIndicator({
      left: activeRect.left - containerRect.left,
      top: activeRect.top - containerRect.top,
      width: activeRect.width,
      height: activeRect.height,
      visible: true,
    });
  }, [targetValue]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(updateIndicator);
    return () => window.cancelAnimationFrame(frame);
  }, [updateIndicator, children]);

  useEffect(() => {
    const handleResize = () => updateIndicator();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateIndicator]);

  return (
    <LiquidToggleContext.Provider
      value={{ activeValue, hoveredValue, setHoveredValue, registerItem }}
    >
      <div
        ref={containerRef}
        className={cn(
          'relative inline-flex items-center gap-1 overflow-hidden rounded-full border border-border/60 bg-muted/45 p-1 shadow-sm backdrop-blur-sm',
          className,
        )}
        onMouseLeave={() => setHoveredValue(null)}
        {...props}
      >
        <AnimatePresence initial={false}>
          {indicator.visible ? (
            <motion.span
              key='liquid-indicator'
              aria-hidden='true'
              className={cn(
                'pointer-events-none absolute overflow-hidden rounded-full bg-primary shadow-[0_10px_32px_-18px_hsl(var(--primary))]',
                indicatorClassName,
              )}
              initial={false}
              animate={{
                left: indicator.left,
                top: indicator.top,
                width: indicator.width,
                height: indicator.height,
                opacity: isHoverPreview ? 0.72 : 1,
                scale: isHoverPreview ? 0.98 : 1,
                borderRadius: [
                  '999px',
                  '56% 44% 52% 48% / 45% 55% 45% 55%',
                  '48% 52% 46% 54% / 58% 42% 58% 42%',
                  '999px',
                ],
              }}
              transition={{
                left: {
                  duration: 0.82,
                  ease: [0.16, 0.92, 0.2, 1],
                },
                top: {
                  duration: 0.82,
                  ease: [0.16, 0.92, 0.2, 1],
                },
                width: {
                  duration: 0.88,
                  ease: [0.22, 0.86, 0.24, 1],
                },
                height: {
                  duration: 0.88,
                  ease: [0.22, 0.86, 0.24, 1],
                },
                opacity: {
                  duration: 0.36,
                  ease: 'easeOut',
                },
                scale: {
                  duration: 0.48,
                  ease: [0.2, 0.82, 0.2, 1],
                },
                borderRadius: {
                  duration: 1.05,
                  times: [0, 0.36, 0.72, 1],
                  ease: [0.18, 0.88, 0.22, 1],
                },
              }}
            />
          ) : null}
        </AnimatePresence>

        {children}
      </div>
    </LiquidToggleContext.Provider>
  );
}

export default LiquidToggleGroup;
