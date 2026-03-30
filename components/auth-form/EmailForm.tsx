import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import type { EmailValues } from '@/app/hooks/auth/types';
import { ClerkFieldErrors } from '@/app/hooks/auth/types';

type Props = {
  form: UseFormReturn<EmailValues>;
  clerkErrors: ClerkFieldErrors;
  onSubmit: (values: EmailValues) => void;
};

export function EmailForm({ form, clerkErrors, onSubmit }: Props) {
  return (
    <form id='form-email' onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name='email'
          control={form.control}
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
                <FieldError
                  errors={[{ message: clerkErrors.fields.identifier.message }]}
                />
              )}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}
