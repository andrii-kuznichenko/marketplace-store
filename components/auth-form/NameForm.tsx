import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import type { NameValues } from '@/app/hooks/auth/types';

type Props = {
  form: UseFormReturn<NameValues>;
  onSubmit: (values: NameValues) => void;
};

export function SignUpNameForm({ form, onSubmit }: Props) {
  return (
    <form id='form-name' onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name='firstName'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='firstName'>First name</FieldLabel>
              <Input
                {...field}
                id='firstName'
                placeholder='John'
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name='lastName'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='lastName'>Last name</FieldLabel>
              <Input
                {...field}
                id='lastName'
                placeholder='Doe'
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}
