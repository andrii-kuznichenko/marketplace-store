import * as z from 'zod';

export const emailSchema = z.object({
  email: z.email({ message: 'Invalid email' }),
});

export const codeSchema = z.object({
  code: z.string().min(6).max(6),
});

export const nameSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export type EmailValues = z.infer<typeof emailSchema>;
export type CodeValues = z.infer<typeof codeSchema>;
export type NameValues = z.infer<typeof nameSchema>;

export type AuthState =
  | { step: 'email' }
  | { step: 'code'; email: string }
  | { step: 'profile' };

export type AuthAction =
  | { type: 'GO_TO_CODE'; email: string }
  | { type: 'GO_TO_PROFILE' }
  | { type: 'RESET' };

export type Navigate = ({
  decorateUrl,
}: {
  decorateUrl: (url: string) => string;
}) => void;
export type ClerkInstance = ReturnType<
  typeof import('@clerk/nextjs').useSignIn
>['signIn'];
export type SignUpInstance = ReturnType<
  typeof import('@clerk/nextjs').useSignUp
>['signUp'];

export type ClerkFieldErrors = {
  fields?: {
    identifier?: { message?: string } | null;
    code?: { message?: string } | null;
  };
};
