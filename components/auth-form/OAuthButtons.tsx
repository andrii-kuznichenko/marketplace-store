import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa6';
import { OAuthStrategy } from '@clerk/shared/types';

type Props = {
  onSelect: (strategy: OAuthStrategy) => void;
};

export function OAuthButtons({ onSelect }: Props) {
  return (
    <div className='mb-4 flex flex-col gap-3 sm:flex-row justify-around'>
      <Button variant='outline' onClick={() => onSelect('oauth_google')}>
        <FcGoogle />
        Continue with Google
      </Button>
      <Button variant='outline' onClick={() => onSelect('oauth_facebook')}>
        <FaFacebook className='text-[#1877F2]' />
        Continue with Facebook
      </Button>
    </div>
  );
}
