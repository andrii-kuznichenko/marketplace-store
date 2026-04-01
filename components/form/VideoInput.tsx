'use client';

import { toast } from 'sonner';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

function VideoInput() {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Video must be less than 10MB');
      e.target.value = '';
    }
  };

  return (
    <div className='mb-2'>
      <Label htmlFor='video' className='capitalize mb-2'>
        Video <span className='text-muted-foreground text-xs'>(optional, max 10MB)</span>
      </Label>
      <Input
        id='video'
        name='video'
        type='file'
        accept='video/*'
        onChange={handleFileChange}
      />
    </div>
  );
}

export default VideoInput;
