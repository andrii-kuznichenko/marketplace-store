'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { ReloadIcon } from '@radix-ui/react-icons';
import { CiEdit, CiEraser } from 'react-icons/ci';
import { PiPaletteThin } from 'react-icons/pi';
import { SignInDialog } from '../auth-form/SignInDialog';
import { IoIosHeartEmpty, IoIosHeart } from 'react-icons/io';
import { RxCross1 } from "react-icons/rx";
import { useState } from 'react';

type btnSize = 'default' | 'lg' | 'sm';

type SubmitButtonProps = {
  className?: string;
  text?: string;
  size?: btnSize;
  disabled?: boolean;
};

export function SubmitButton({
  className = '',
  text = 'submit',
  size = 'lg',
  disabled = false,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      type='submit'
      disabled={pending || disabled}
      className={cn('capitalize', className)}
      size={size}
    >
      {pending ? (
        <>
          <ReloadIcon className='mr-2 h-4 w-4 animate-spin' /> Please wait...
        </>
      ) : (
        text
      )}
    </Button>
  );
}

type actionType = 'edit' | 'delete' | 'color' | 'deleteCart';

export const IconButton = ({ actionType }: { actionType: actionType }) => {
  const { pending } = useFormStatus();

  const renderIcon = () => {
    switch (actionType) {
      case 'edit':
        return <CiEdit />;
      case 'delete':
        return <CiEraser />;
      case 'color':
        return <PiPaletteThin />;
      case 'deleteCart':
        return <RxCross1 />
      default:
        const never: never = actionType;
        throw new Error(`Invalid action type: ${never}`);
    }
  };
  return (
    <Button
      type='submit'
      size='icon'
      variant='link'
      className='p-2 cursor-pointer dark:text-white'
    >
      {pending ? <ReloadIcon className='animate-spin' /> : renderIcon()}
    </Button>
  );
};

export const CardSignInButton = () => {
  const [openSignIn, setOpenSignIn] = useState(false);

  return (
    <>
      <Button
        type='button'
        size='icon'
        variant='outline'
        className='p-2 cursor-pointer dark:bg-primary dark:text-primary-foreground dark:border-transparent dark:hover:bg-primary/90'
        onClick={() => setOpenSignIn(true)}
        asChild
      >
        <IoIosHeartEmpty />
      </Button>
      {openSignIn && (
        <SignInDialog open={openSignIn} onOpenChange={setOpenSignIn} />
      )}
    </>
  );
};

export const CardSubmitButton = ({ isFavourite }: { isFavourite: boolean }) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type='submit'
      size='icon'
      variant='outline'
      className='p-2 cursor-pointer dark:bg-primary dark:text-primary-foreground dark:border-transparent dark:hover:bg-primary/90'
    >
      {pending ? (
        <ReloadIcon className='animate-spin' />
      ) : isFavourite ? (
        <IoIosHeart />
      ) : (
        <IoIosHeartEmpty />
      )}
    </Button>
  );
};

