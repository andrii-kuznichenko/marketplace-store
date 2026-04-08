'use client';

import { useActionState, useEffect, useState } from 'react';
import { upsertAddressAction } from '@/utils/actions/addressActions';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import FormInput from '../form/FormInput';
import { SubmitButton } from '../form/Buttons';
import { CiHome } from 'react-icons/ci';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type Address = {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
} | null;

const initialState = { message: '' };

export default function DeliveryAddress({ savedAddress }: { savedAddress: Address }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(upsertAddressAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.message === 'Address saved') {
      toast(state.message);
      setOpen(false);
      router.refresh();
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <>
      <Card className='p-6 mb-4'>
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center gap-2 font-medium'>
            <CiHome className='text-lg' />
            <span>Delivery address</span>
          </div>
          <Button variant='ghost' size='sm' className='font-medium underline' onClick={() => setOpen(true)}>
            Edit
          </Button>
        </div>
        {savedAddress ? (
          <div className='text-sm text-muted-foreground space-y-0.5'>
            <p>{savedAddress.name}</p>
            <p>{savedAddress.street}</p>
            <p>{savedAddress.postalCode} {savedAddress.city}</p>
            <p>{savedAddress.country}</p>
          </div>
        ) : (
          <p className='text-sm text-muted-foreground'>No address saved. Click Edit to add one.</p>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Edit address</DialogTitle>
          </DialogHeader>
          <form action={formAction}>
            <FormInput name='name' type='text' label='Full name' defaultValue={savedAddress?.name ?? ''} />
            <FormInput name='street' type='text' label='Street' defaultValue={savedAddress?.street ?? ''} />
            <div className='grid grid-cols-2 gap-2'>
              <FormInput name='postalCode' type='text' label='Postcode' defaultValue={savedAddress?.postalCode ?? ''} />
              <FormInput name='city' type='text' label='City' defaultValue={savedAddress?.city ?? ''} />
            </div>
            <FormInput name='country' type='text' label='Country' defaultValue={savedAddress?.country ?? ''} />
            <DialogFooter className='mt-2'>
              <Button type='button' variant='outline' onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <SubmitButton text='Save' size='default' />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
