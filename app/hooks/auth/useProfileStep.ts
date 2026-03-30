import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nameSchema, NameValues, Navigate, SignUpInstance } from './types';

interface UseProfileStepOptions {
  signUp: SignUpInstance;
  navigate: Navigate;
}

export const useProfileStep = ({ signUp, navigate }: UseProfileStepOptions) => {
  const form = useForm<NameValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: { firstName: '', lastName: '' },
  });

  const onSubmit = useCallback(
    async ({ firstName, lastName }: NameValues) => {
      const { error } = await signUp.update({ firstName, lastName });
      if (!error && signUp.status === 'complete') {
        await signUp.finalize({ navigate });
      }
    },
    [signUp, navigate],
  );

  const reset = useCallback(() => {
    form.reset({ firstName: '', lastName: '' });
  }, [form]);

  return { form, onSubmit, reset };
};
