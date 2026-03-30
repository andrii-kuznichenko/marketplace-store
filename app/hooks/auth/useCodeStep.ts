import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import {
  codeSchema,
  CodeValues,
  Navigate,
  ClerkInstance,
  SignUpInstance,
} from './types';

interface UseCodeStepOptions {
  signIn: ClerkInstance;
  signUp: SignUpInstance;
  navigate: Navigate;
}

type CodeSubmitResult =
  | { outcome: 'signed_in' }
  | { outcome: 'needs_profile' }
  | { outcome: 'error' };

export const useCodeStep = ({
  signIn,
  signUp,
  navigate,
}: UseCodeStepOptions) => {
  const form = useForm<CodeValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: '' },
  });

  const handleTransfer = useCallback(async (): Promise<CodeSubmitResult> => {
    const { error } = await signUp.create({ transfer: true });
    if (error) return { outcome: 'error' };

    if (signUp.status === 'complete') {
      await signUp.finalize({ navigate });
      return { outcome: 'signed_in' };
    }

    if (signUp.status === 'missing_requirements') {
      return { outcome: 'needs_profile' };
    }

    return { outcome: 'error' };
  }, [signUp, navigate]);

  const onSubmit = useCallback(
    async (values: CodeValues): Promise<CodeSubmitResult> => {
      const { error } = await signIn.emailCode.verifyCode({
        code: values.code,
      });

      if (error) {
        const isTransferNeeded =
          isClerkAPIResponseError(error) &&
          error.errors.some((e) => e.code === 'sign_up_if_missing_transfer');

        if (isTransferNeeded) return handleTransfer();
        return { outcome: 'error' };
      }

      if (signIn.status === 'complete') {
        await signIn.finalize({ navigate });
        return { outcome: 'signed_in' };
      }

      return { outcome: 'error' };
    },
    [signIn, handleTransfer, navigate],
  );

  const resend = useCallback(() => {
    return signIn.emailCode.sendCode();
  }, [signIn]);

  const reset = useCallback(() => form.reset({ code: '' }), [form]);

  return { form, onSubmit, resend, reset };
};
