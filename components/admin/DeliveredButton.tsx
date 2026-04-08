'use client';

import { useActionState, useEffect } from 'react';
import { markParcelDeliveredAction } from '@/utils/actions/orderActions';
import { Button } from '../ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type='submit' size='sm' variant='outline' disabled={pending} className='text-xs'>
      {pending ? <ReloadIcon className='h-3 w-3 animate-spin' /> : 'Mark delivered'}
    </Button>
  );
}

export default function DeliveredButton({ parcelId }: { parcelId: string }) {
  const [state, formAction] = useActionState(markParcelDeliveredAction, { message: '' });

  useEffect(() => {
    if (state.message) toast(state.message);
  }, [state]);

  return (
    <form action={formAction}>
      <input type='hidden' name='parcelId' value={parcelId} />
      <SubmitBtn />
    </form>
  );
}
