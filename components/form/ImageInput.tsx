'use client';

import { toast } from 'sonner';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

function ImageInput() {
  const name = 'image';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      toast.error('File size must be less than 1MB');
      e.target.value = '';
    }
  };

  return (
    <div className='mb-2'>
      <Label htmlFor={name} className='capitalize mb-2'>
        Image
      </Label>
      <Input id={name} name={name} type='file' required accept='image/*' onChange={handleFileChange} />
    </div>
  );
}

export default ImageInput;