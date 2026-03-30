'use client';
import { useEffect } from 'react';
import { AuthState } from '@/app/hooks/auth/types';
import { useAuthFlow } from '@/app/hooks/auth/useAuthFlow';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { OAuthButtons } from './OAuthButtons';
import { Separator } from '../ui/separator';
import { EmailForm } from './EmailForm';
import { CodeForm } from './CodeForm';
import { SignUpNameForm } from './NameForm';
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';

const getDescription = (state: AuthState): string => {
  switch (state.step) {
    case 'email':
      return 'Continue with your email. We will sign you in or create your account after verification.';
    case 'code':
      return `We sent a code to ${state.email}`;
    case 'profile':
      return 'Your email is verified. Finish creating your account.';
  }
};

const FORM_IDS: Record<AuthState['step'], string> = {
  email: 'form-email',
  code: 'form-code',
  profile: 'form-name',
};

type SignInDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SignInDialog({ open, onOpenChange }: SignInDialogProps) {
  const { isSignedIn } = useUser();
  const {
    state,
    isFetching,
    clerkErrors,
    emailStep,
    codeStep,
    profileStep,
    reset,
  } = useAuthFlow();

  useEffect(() => {
    if (!open || !isSignedIn) return;

    reset();
    onOpenChange(false);
  }, [open, isSignedIn, reset, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[calc(100vw-2rem)] max-w-md p-0'>
        <DialogHeader className='mt-6'>
          <DialogTitle className='text-center'>
            Sign In or Create Account
          </DialogTitle>
          <DialogDescription className='text-center'>
            {getDescription(state)}
          </DialogDescription>
        </DialogHeader>

        <div className='px-4 pb-4'>
          {state.step === 'email' && (
            <>
              <OAuthButtons onSelect={emailStep.onOAuthSelect} />
              <p className='text-center text-sm text-muted-foreground'>or</p>
              <Separator className='mb-2' />
              <EmailForm
                form={emailStep.form}
                clerkErrors={clerkErrors}
                onSubmit={emailStep.onSubmit}
              />
            </>
          )}
          {state.step === 'code' && (
            <CodeForm
              form={codeStep.form}
              clerkErrors={clerkErrors}
              onSubmit={codeStep.onSubmit}
            />
          )}
          {state.step === 'profile' && (
            <SignUpNameForm
              form={profileStep.form}
              onSubmit={profileStep.onSubmit}
            />
          )}
          <div id='clerk-captcha' className='mt-4 flex justify-center' />
        </div>

        <footer className='flex items-center border-t bg-muted/50 p-4 rounded-b-xl'>
          {state.step !== 'email' ? (
            <Button variant='ghost' onClick={reset}>
              <IoMdArrowDropleft /> Back
            </Button>
          ) : (
            <div />
          )}

          <div className='ml-auto flex gap-2'>
            {state.step === 'code' && (
              <Button
                variant='outline'
                onClick={codeStep.resend}
                disabled={isFetching}
              >
                Resend code
              </Button>
            )}
            <Button
              type='submit'
              form={FORM_IDS[state.step]}
              disabled={isFetching}
            >
              {state.step === 'profile' ? 'Create account' : 'Continue'}
              <IoMdArrowDropright />
            </Button>
          </div>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
