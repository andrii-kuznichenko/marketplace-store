'use client';

import { toast } from 'sonner';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

function ImageInput() {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 5) {
      toast.error('Maximum 5 images allowed');
      e.target.value = '';
      return;
    }
    const oversized = files.find((f) => f.size > 1024 * 1024);
    if (oversized) {
      toast.error(`"${oversized.name}" exceeds 1MB limit`);
      e.target.value = '';
    }
  };

  return (
    <div className='mb-2'>
      <Label htmlFor='images' className='capitalize mb-2'>
        Images <span className='text-muted-foreground text-xs'>(up to 5, max 1MB each)</span>
      </Label>
      <Input
        id='images'
        name='images'
        type='file'
        required
        accept='image/*'
        multiple
        onChange={handleFileChange}
      />
    </div>
  );
}

export default ImageInput;
