'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { OAuthButtons } from '@/components/auth-form/OAuthButtons';
import { EmailForm } from '@/components/auth-form/EmailForm';
import { CodeForm } from '@/components/auth-form/CodeForm';
import { SignUpNameForm } from '@/components/auth-form/NameForm';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';
import { useAuthFlow } from '@/app/hooks/auth/useAuthFlow';
import { AuthState } from '@/app/hooks/auth/types';

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

export default function SignInPage() {
  const {
    state,
    isFetching,
    clerkErrors,
    emailStep,
    codeStep,
    profileStep,
    reset,
  } = useAuthFlow();

  return (
    <div className='flex items-center justify-center'>
      <Card className='w-full sm:max-w-md'>
        <CardHeader>
          <CardTitle className='text-center'>
            Sign In or Create Account
          </CardTitle>
          <CardDescription className='text-center'>
            {getDescription(state)}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {state.step === 'email' && (
            <>
              <OAuthButtons onSelect={emailStep.onOAuthSelect} />
              <p className='text-center text-sm text-muted-foreground'>or</p>
              <Separator className='mb-4' />
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
        </CardContent>

        <CardFooter className='flex justify-between'>
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
        </CardFooter>
      </Card>
    </div>
  );
}
