import { SignInDialog } from '@/components/auth-form/SignInDialog';

function SignIn({ children }: { children: React.ReactNode }) {
  return (
    <SignInDialog trigger={children}/>
  );
}

export default SignIn;
