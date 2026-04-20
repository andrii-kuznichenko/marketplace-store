'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LuX, LuMenu } from 'react-icons/lu';
import { Show } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { links, publicLinks, authPromptLinks, adminLinks } from '@/utils/links';
import { SignInDialog } from '@/components/auth-form/SignInDialog';
import SignOutLink from '@/components/navbar/SignOutLink';
import { useRole } from '@/app/hooks/useRole';
import Link from 'next/link';

type Props = {
  userIcon: ReactNode;
};

const linkClass =
  'flex items-center gap-3 px-6 py-3.5 text-sm hover:bg-accent transition-colors capitalize';

function MobileSidebarClient({ userIcon }: Props) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const { isAdmin, isSuperAdmin, isLoaded } = useRole();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = () => setOpen(false);

  const handleOpenSignIn = () => {
    close();
    setTimeout(() => setOpenSignIn(true), 300);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className='flex flex-col items-center gap-0.5 text-xs text-foreground'
        aria-label='Open menu'
      >
        <LuMenu size={22} />
        <span>Menu</span>
      </button>

      {mounted && createPortal(
        <>
          <AnimatePresence>
            {open && (
              <>
                <motion.div
                  key='backdrop'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className='fixed inset-0 z-150 bg-black/50'
                  onClick={close}
                />

                <motion.div
                  key='sidebar'
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ duration: 0.32, ease: [0.25, 0, 0, 1] }}
                  className='fixed inset-0 z-160 bg-background flex flex-col'
                >
                  <div className='flex items-center justify-between px-4 py-3 border-b border-border'>
                    <div className='flex items-center gap-3'>{userIcon}</div>
                    <Button variant='ghost' size='icon' onClick={close} aria-label='Close menu'>
                      <LuX className='w-5 h-5' />
                    </Button>
                  </div>

                  <div className='flex-1 overflow-y-auto py-2'>
                    {isLoaded && (isAdmin || isSuperAdmin) && (
                      <>
                        {adminLinks.map((link) => {
                          const Icon = link.icon;
                          return (
                            <Link key={link.href} href={link.href} onClick={close} className={linkClass}>
                              <Icon size={20} />
                              {link.label}
                            </Link>
                          );
                        })}
                        <hr className='my-2 border-border' />
                      </>
                    )}

                    <Show when='signed-in'>
                      {links.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link key={link.href} href={link.href} onClick={close} className={linkClass}>
                            <Icon size={20} />
                            {link.label}
                          </Link>
                        );
                      })}
                    </Show>

                    <Show when='signed-out'>
                      {publicLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link key={link.href} href={link.href} onClick={close} className={linkClass}>
                            <Icon size={20} />
                            {link.label}
                          </Link>
                        );
                      })}
                      {authPromptLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <button
                            key={link.label}
                            onClick={handleOpenSignIn}
                            className={`w-full text-left ${linkClass}`}
                          >
                            <Icon size={20} />
                            {link.label}
                          </button>
                        );
                      })}
                    </Show>
                  </div>

                  <div className='p-4 border-t border-border'>
                    <Show when='signed-in'>
                      <SignOutLink />
                    </Show>
                    <Show when='signed-out'>
                      <Button className='w-full' size='lg' onClick={handleOpenSignIn}>
                        Sign In
                      </Button>
                    </Show>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {openSignIn && (
            <SignInDialog open={openSignIn} onOpenChange={setOpenSignIn} />
          )}
        </>,
        document.body
      )}
    </>
  );
}

export default MobileSidebarClient;
