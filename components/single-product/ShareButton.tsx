'use client';

import { IoShareSocial } from 'react-icons/io5';
import {
  EmailIcon,
  EmailShareButton,
  TelegramIcon,
  TelegramShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { useTheme } from 'next-themes';

function ShareButton({ productId, name }: { productId: string; name: string }) {
  const url = process.env.NEXT_PUBLIC_WEBSITE_URL;
  const shareLink = `${url}/products/${productId}`;
  const { resolvedTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={resolvedTheme === 'dark' ? 'default' : 'outline'}
          size='icon'
          className='p-2'
        >
          <IoShareSocial />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side='bottom'
        align='end'
        sideOffset={10}
        className='flex items-center gap-x-2 justify-center w-full'
      >
        <EmailShareButton url={shareLink} title={name}>
          <EmailIcon size={32} round />
        </EmailShareButton>
        <TelegramShareButton url={shareLink} title={name}>
          <TelegramIcon size={32} round />
        </TelegramShareButton>
        <WhatsappShareButton url={shareLink} title={name}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </PopoverContent>
    </Popover>
  );
}

export default ShareButton;
