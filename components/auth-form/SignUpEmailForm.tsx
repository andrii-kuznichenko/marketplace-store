import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { EmailValues } from '@/app/hooks/auth/types';

type Props = {
  form: UseFormReturn<EmailValues>;
  clerkErrors: any;
  onSubmit: (values: EmailValues) => void;
};

export function SignUpEmailForm({ form, clerkErrors, onSubmit }: Props) {
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
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
              {clerkErrors?.fields?.email_address && (
                <FieldError
                  errors={[{ message: clerkErrors.fields.email_address.message }]}
                />
              )}
            </Field>
          )}
        />
      </FieldGroup>
      <div id='clerk-captcha' className='mt-5 flex justify-center'/>
    </form>
  );
}