import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

import type { ClerkFieldErrors, CodeValues } from '@/app/hooks/auth/types';

type Props = {
  form: UseFormReturn<CodeValues>;
  clerkErrors: ClerkFieldErrors;
  onSubmit: (values: CodeValues) => void;
};

export function CodeForm({ form, clerkErrors, onSubmit }: Props) {
  return (
    <form id='form-code' onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name='code'
          control={form.control}
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
                <FieldError
                  errors={[{ message: clerkErrors.fields.code.message }]}
                />
              )}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}
