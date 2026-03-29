'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSignIn } from '@clerk/nextjs';
import { OAuthStrategy } from '@clerk/shared/types';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa6';
import { IoMdArrowDropright } from 'react-icons/io';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel, FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const emailSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
});

const codeSchema = z.object({
  code: z.string().min(6, 'Code must be 6 characters').max(6),
});

type EmailValues = z.infer<typeof emailSchema>;
type CodeValues = z.infer<typeof codeSchema>;

export default function FormSignIn() {
  const { signIn, errors: clerkErrors, fetchStatus } = useSignIn();
  const router = useRouter();

  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const codeForm = useForm<CodeValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: '' },
  });

  const signInWithOAuth = async (strategy: OAuthStrategy) => {
    const { error } = await signIn.sso({
      strategy,
      redirectCallbackUrl: '/sso-callback',
      redirectUrl: '/',
    });
    if (error) console.error(error);
  };

  const navigate = ({ decorateUrl }: any) => {
    const url = decorateUrl('/');
    url.startsWith('http') ? (window.location.href = url) : router.push(url);
  };

  const onEmailSubmit = async (values: EmailValues) => {
    const { error } = await signIn.create({ identifier: values.email });
    if (error) return;
    await signIn.emailCode.sendCode({ emailAddress: values.email });
  };

  const onCodeSubmit = async (values: CodeValues) => {
    await signIn.emailCode.verifyCode({ code: values.code });
    if (signIn.status === 'complete') {
      await signIn.finalize({ navigate });
    }
  };

  const isVerifying = signIn.status === 'needs_first_factor';

  return (
    <div className='flex items-center justify-center'>
      <Card className='w-full sm:max-w-md'>
        <CardHeader>
          <CardTitle className='text-center'>Sign In</CardTitle>
          <CardDescription className='text-center'>
            {isVerifying
              ? `We sent a code to ${emailForm.getValues('email')}`
              : 'Welcome back! Please sign in to continue'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!isVerifying && (
            <>
              <div className='mb-4 flex flex-col gap-3 sm:flex-row justify-around'>
                <Button variant='outline' onClick={() => signInWithOAuth('oauth_google')}>
                  <FcGoogle />
                  Continue with Google
                </Button>
                <Button variant='outline' onClick={() => signInWithOAuth('oauth_facebook')}>
                  <FaFacebook className='text-[#1877F2]' />
                  Continue with Facebook
                </Button>
              </div>
              <p className='text-center text-sm text-muted-foreground'>or</p>
              <Separator className='mb-4' />
            </>
          )}

          {!isVerifying && (
            <form id='form-email' onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
              <FieldGroup>
                <Controller
                  name='email'
                  control={emailForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='email'>Email address</FieldLabel>
                      <Input
                        {...field}
                        id='email'
                        type='email'
                        placeholder='name@example.com'
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      {clerkErrors?.fields?.identifier && (
                        <FieldError errors={[{ message: clerkErrors.fields.identifier.message }]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          )}

          {/* Ð¨Ð°Ð³ 2 â€” ÐšÐ¾Ð´ */}
          {isVerifying && (
            <form id='form-code' onSubmit={codeForm.handleSubmit(onCodeSubmit)}>
              <FieldGroup>
                <Controller
                  name='code'
                  control={codeForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='code'>Verification code</FieldLabel>
                      <Input
                        {...field}
                        id='code'
                        type='text'
                        inputMode='numeric'
                        placeholder='123456'
                        aria-invalid={fieldState.invalid}
                        autoFocus
                      />
                      <FieldDescription>
                        Enter the 6-digit code sent to your email.
                      </FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      {clerkErrors?.fields?.code && (
                        <FieldError errors={[{ message: clerkErrors.fields.code.message }]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          )}
        </CardContent>

        <CardFooter className='flex justify-between'>
          {isVerifying && (
            <Button variant='ghost' onClick={() => signIn.reset()}>
              Back
            </Button>
          )}

          <div className='flex gap-2 ml-auto'>
            {isVerifying && (
              <Button
                variant='outline'
                onClick={() => signIn.emailCode.sendCode({ emailAddress: emailForm.getValues('email') })}
                disabled={fetchStatus === 'fetching'}
              >
                Resend code
              </Button>
            )}

            <Button
              type='submit'
              form={isVerifying ? 'form-code' : 'form-email'}
              disabled={fetchStatus === 'fetching'}
            >
              Continue
              <IoMdArrowDropright />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
