'use client';

import { useClerk, useSignIn, useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function SSOCallback() {
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();
  const hasRun = useRef(false);

  useEffect(() => {
    (async () => {
      if (!clerk.loaded || hasRun.current) return;
      hasRun.current = true;

      const navigate = async ({
        session,
        decorateUrl,
      }: {
        session?: { currentTask?: unknown } | null;
        decorateUrl: (url: string) => string;
      }) => {
        if (session?.currentTask) return;
        const url = decorateUrl('/');
        if (url.startsWith('http')) {
          window.location.href = url;
          return;
        }

        router.push(url);
      };

      if (signIn.status === 'complete') {
        return await signIn.finalize({ navigate });
      }

      if (signUp.isTransferable) {
        await signIn.create({ transfer: true });
        const status = signIn.status as string;
        if (status === 'complete') {
          return await signIn.finalize({ navigate });
        }
        return router.push('/sign-in');
      }

      if (signIn.isTransferable) {
        await signUp.create({ transfer: true });
        if (signUp.status === 'complete')
          return await signUp.finalize({ navigate });
        return router.push('/signup');
      }
    })();
  }, [clerk, router, signIn, signUp]);

  return <div id='clerk-captcha' />;
}
