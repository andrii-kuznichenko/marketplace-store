'use client';

import * as React from 'react';
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';
import { motion } from 'motion/react';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

const DropdownMenuRootAnimationContext = React.createContext<{
  isOpen: boolean;
} | null>(null);

function useDropdownMenuRootAnimationContext() {
  return React.useContext(DropdownMenuRootAnimationContext);
}

const DropdownMenuContentAnimationContext = React.createContext<{
  isOpen: boolean;
  registerItem: () => number;
} | null>(null);

function useDropdownMenuAnimationContext() {
  return React.useContext(DropdownMenuContentAnimationContext);
}

function DropdownMenuAnimatedItem({
  children,
  className,
  ...props
}: React.ComponentProps<typeof motion.div>) {
  const context = useDropdownMenuAnimationContext();

  const indexRef = React.useRef<number | null>(null);

  if (context && indexRef.current === null) {
    indexRef.current = context.registerItem();
  }

  const index = indexRef.current ?? 0;
  const isOpen = context?.isOpen ?? false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
      transition={{
        duration: isOpen ? 0.2 : 0.08,
        ease: [0.16, 1, 0.3, 1],
        delay: isOpen ? 0.12 + index * 0.045 : 0,
      }}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.985 }}
      {...props}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function DropdownMenu({
  open: openProp,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    defaultOpen ?? false,
  );

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  return (
    <DropdownMenuRootAnimationContext.Provider value={{ isOpen: open }}>
      <DropdownMenuPrimitive.Root
        data-slot='dropdown-menu'
        open={open}
        onOpenChange={(nextOpen) => {
          if (!isControlled) setUncontrolledOpen(nextOpen);
          onOpenChange?.(nextOpen);
        }}
        {...props}
      />
    </DropdownMenuRootAnimationContext.Provider>
  );
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot='dropdown-menu-portal' {...props} />
  );
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot='dropdown-menu-trigger'
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  align = 'start',
  sideOffset = 6,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  const rootContext = useDropdownMenuRootAnimationContext();
  const isOpen = rootContext?.isOpen ?? false;

  const [enableScroll, setEnableScroll] = React.useState(false);

  const itemCountRef = React.useRef(0);
  itemCountRef.current = 0;

  React.useEffect(() => {
    if (!isOpen) {
      setEnableScroll(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      setEnableScroll(true);
    }, 260);

    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  const contextValue = React.useMemo(
    () => ({
      isOpen,
      registerItem: () => {
        const current = itemCountRef.current;
        itemCountRef.current += 1;
        return current;
      },
    }),
    [isOpen],
  );

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuContentAnimationContext.Provider value={contextValue}>
        <DropdownMenuPrimitive.Content
          data-slot='dropdown-menu-content'
          sideOffset={sideOffset}
          align={align}
          className={cn(
            `
            z-[120]
            w-(--radix-dropdown-menu-trigger-width)
            min-w-32
            overflow-hidden
            p-1
            text-popover-foreground
            shadow-md
            ring-1 ring-foreground/10

            relative
            bg-popover/70
            before:pointer-events-none
            before:absolute
            before:inset-0
            before:-z-1
            before:bg-popover/70
            before:backdrop-blur-2xl
            before:backdrop-saturate-150

            origin-(--radix-dropdown-menu-content-transform-origin)
            will-change-[opacity,transform]
            data-[state=open]:animate-[dropdown-in_140ms_cubic-bezier(.16,1,.3,1)]
            data-[state=closed]:animate-[dropdown-out_100ms_ease-in]

            **:data-[slot$=-item]:focus:bg-foreground/10
            **:data-[slot$=-item]:data-highlighted:bg-foreground/10
            **:data-[slot$=-separator]:bg-foreground/5
            **:data-[slot$=-trigger]:focus:bg-foreground/10
            **:data-[slot$=-trigger]:data-[state=open]:bg-foreground/10
            **:data-[variant=destructive]:focus:bg-destructive/10!
            `,
            className,
          )}
          {...props}
        >
          <div
            data-slot='dropdown-menu-scroll'
            className={cn(
              'max-h-(--radix-dropdown-menu-content-available-height) overflow-x-hidden',
              enableScroll ? 'overflow-y-auto' : 'overflow-y-hidden',
            )}
          >
            <div className='overflow-hidden'>{children}</div>
          </div>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuContentAnimationContext.Provider>
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot='dropdown-menu-group' {...props} />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  return (
    <DropdownMenuPrimitive.Item asChild {...props}>
      <DropdownMenuAnimatedItem
        data-slot='dropdown-menu-item'
        data-inset={inset}
        data-variant={variant}
        className={cn(
          `
          group/dropdown-menu-item
          relative
          flex
          cursor-default
          items-center
          gap-1.5
          px-1.5
          py-1
          text-sm
          outline-hidden
          select-none

          focus:bg-accent
          focus:text-accent-foreground
          not-data-[variant=destructive]:focus:**:text-accent-foreground

          data-inset:pl-7
          data-disabled:pointer-events-none
          data-disabled:opacity-50

          data-[variant=destructive]:text-destructive
          data-[variant=destructive]:focus:bg-destructive/10
          data-[variant=destructive]:focus:text-destructive
          dark:data-[variant=destructive]:focus:bg-destructive/20

          [&_svg]:pointer-events-none
          [&_svg]:shrink-0
          [&_svg:not([class*='size-'])]:size-4
          data-[variant=destructive]:*:[svg]:text-destructive
          `,
          className,
        )}
      >
        {children}
      </DropdownMenuAnimatedItem>
    </DropdownMenuPrimitive.Item>
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.CheckboxItem asChild checked={checked} {...props}>
      <DropdownMenuAnimatedItem
        data-slot='dropdown-menu-checkbox-item'
        data-inset={inset}
        className={cn(
          `
          relative
          flex
          cursor-default
          items-center
          gap-1.5
          py-1
          pr-8
          pl-1.5
          text-sm
          outline-hidden
          select-none

          focus:bg-accent
          focus:text-accent-foreground
          focus:**:text-accent-foreground

          data-inset:pl-7
          data-disabled:pointer-events-none
          data-disabled:opacity-50

          [&_svg]:pointer-events-none
          [&_svg]:shrink-0
          [&_svg:not([class*='size-'])]:size-4
          `,
          className,
        )}
      >
        <span
          className='pointer-events-none absolute right-2 flex items-center justify-center'
          data-slot='dropdown-menu-checkbox-item-indicator'
        >
          <DropdownMenuPrimitive.ItemIndicator>
            <CheckIcon />
          </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
      </DropdownMenuAnimatedItem>
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot='dropdown-menu-radio-group'
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.RadioItem asChild {...props}>
      <DropdownMenuAnimatedItem
        data-slot='dropdown-menu-radio-item'
        data-inset={inset}
        className={cn(
          `
          relative
          flex
          cursor-default
          items-center
          gap-1.5
          py-1
          pr-8
          pl-1.5
          text-sm
          outline-hidden
          select-none

          focus:bg-accent
          focus:text-accent-foreground
          focus:**:text-accent-foreground

          data-inset:pl-7
          data-disabled:pointer-events-none
          data-disabled:opacity-50

          [&_svg]:pointer-events-none
          [&_svg]:shrink-0
          [&_svg:not([class*='size-'])]:size-4
          `,
          className,
        )}
      >
        <span
          className='pointer-events-none absolute right-2 flex items-center justify-center'
          data-slot='dropdown-menu-radio-item-indicator'
        >
          <DropdownMenuPrimitive.ItemIndicator>
            <CheckIcon />
          </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
      </DropdownMenuAnimatedItem>
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot='dropdown-menu-label'
      data-inset={inset}
      className={cn(
        'px-1.5 py-1 text-xs font-medium text-muted-foreground data-inset:pl-7',
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot='dropdown-menu-separator'
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot='dropdown-menu-shortcut'
      className={cn(
        'ml-auto text-xs tracking-widest text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground',
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot='dropdown-menu-sub' {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger asChild {...props}>
      <DropdownMenuAnimatedItem
        data-slot='dropdown-menu-sub-trigger'
        data-inset={inset}
        className={cn(
          `
          group/dropdown-menu-sub-trigger
          flex
          cursor-default
          items-center
          gap-1.5
          px-1.5
          py-1
          text-sm
          outline-hidden
          select-none

          focus:bg-accent
          focus:text-accent-foreground
          data-inset:pl-7
          data-[state=open]:bg-accent
          data-[state=open]:text-accent-foreground

          [&_svg]:pointer-events-none
          [&_svg]:shrink-0
          [&_svg:not([class*='size-'])]:size-4
          `,
          className,
        )}
      >
        {children}
        <motion.span
          className='ml-auto flex'
          animate={{ x: 0, rotate: 0 }}
          whileHover={{ x: 2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        >
          <ChevronRightIcon className='size-4' />
        </motion.span>
      </DropdownMenuAnimatedItem>
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot='dropdown-menu-sub-content'
      className={cn(
        `
        z-[120]
        min-w-32
        overflow-hidden
        p-1
        text-popover-foreground
        shadow-lg
        ring-1 ring-foreground/10

        relative
        bg-popover/70
        before:pointer-events-none
        before:absolute
        before:inset-0
        before:-z-1
        before:bg-popover/70
        before:backdrop-blur-2xl
        before:backdrop-saturate-150

        origin-(--radix-dropdown-menu-content-transform-origin)
        will-change-[opacity,transform]
        data-[state=open]:animate-[dropdown-sub-in_150ms_cubic-bezier(.16,1,.3,1)]
        data-[state=closed]:animate-[dropdown-sub-out_100ms_ease-in]

        **:data-[slot$=-item]:focus:bg-foreground/10
        **:data-[slot$=-item]:data-highlighted:bg-foreground/10
        **:data-[slot$=-separator]:bg-foreground/5
        `,
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
