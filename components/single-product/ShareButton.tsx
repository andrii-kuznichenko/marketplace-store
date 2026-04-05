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
import { RiTelegram2Fill, RiWhatsappFill, RiMailFill } from 'react-icons/ri';

function ShareButton({ productId, name }: { productId: string; name: string }) {
  const url = process.env.NEXT_PUBLIC_WEBSITE_URL;
  const shareLink = `${url}/products/${productId}`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='p-2 dark:bg-primary dark:text-primary-foreground dark:border-transparent dark:hover:bg-primary/90'
        >
          <IoShareSocial />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side='bottom'
        align='start'
        sideOffset={10}
        className='justify-center w-full'
      >
        <EmailShareButton url={shareLink} title={name}>
          <div className='bg-black rounded-full p-1.5 dark:bg-primary'>
            <RiMailFill className='w-6 h-6 text-white' />
          </div>
        </EmailShareButton>
        <TelegramShareButton url={shareLink} title={name}>
          <div className='bg-black rounded-full p-1.5 dark:bg-primary'>
            <RiTelegram2Fill className='w-6 h-6 text-white ' />
          </div>
        </TelegramShareButton>
        <WhatsappShareButton url={shareLink} title={name}>
          <div className='bg-black rounded-full p-1.5 dark:bg-primary'>
            <RiWhatsappFill className='w-6 h-6 text-white ' />
          </div>
        </WhatsappShareButton>
      </PopoverContent>
    </Popover>
  );
}

export default ShareButton;
