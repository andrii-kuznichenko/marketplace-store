import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OAuthStrategy } from '@clerk/shared/types';
import { emailSchema, EmailValues, ClerkInstance } from './types';

interface UseEmailStepOptions {
  signIn: ClerkInstance;
  prefillEmail: string;
}

export const useEmailStep = ({ signIn, prefillEmail }: UseEmailStepOptions) => {
  const form = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: prefillEmail },
  });

  const onSubmit = useCallback(
    async (values: EmailValues): Promise<boolean> => {
      const { error } = await signIn.create({
        identifier: values.email,
        signUpIfMissing: true,
      } as Parameters<typeof signIn.create>[0]);
      if (error) return false;

      const { error: sendError } = await signIn.emailCode.sendCode();
      return !sendError;
    },
    [signIn],
  );

  const onOAuthSelect = useCallback(
    async (strategy: OAuthStrategy): Promise<void> => {
      const { error } = await signIn.sso({
        strategy,
        redirectCallbackUrl: '/sso-callback',
        redirectUrl: '/',
      });
      if (error) console.error(error);
    },
    [signIn],
  );

  const reset = useCallback(() => {
    form.reset({ email: prefillEmail });
  }, [form, prefillEmail]);

  return { form, onSubmit, onOAuthSelect, reset };
};
