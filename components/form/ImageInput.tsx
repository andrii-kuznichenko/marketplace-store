'use client';

import { toast } from 'sonner';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

function ImageInput({ single = false }: { single?: boolean }) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!single && files.length > 5) {
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
        {single ? 'New image' : 'Images'}
        <span className='text-muted-foreground text-xs ml-1'>
          {single ? '(max 1MB)' : '(up to 5, max 1MB each)'}
        </span>
      </Label>
      <Input
        id='images'
        name='image'
        type='file'
        required
        accept='image/*'
        {...(!single && { multiple: true, name: 'images' })}
        onChange={handleFileChange}
      />
    </div>
  );
}

export default ImageInput;
