'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MediaType } from '@prisma/client';
import { Play } from 'lucide-react';

type MediaItem = {
  id: string;
  url: string;
  type: MediaType;
  order: number;
  productId: string;
};

function ProductMediaGallery({ media, name }: { media: MediaItem[]; name: string }) {
  const images = media.filter((m) => m.type === MediaType.IMAGE);
  const videos = media.filter((m) => m.type === MediaType.VIDEO);
  const orderedMedia = [...images, ...videos];

  const [active, setActive] = useState(orderedMedia[0]);
  const [zoom, setZoom] = useState({ visible: false, x: 0, y: 0 });

  const isVideo = (item: MediaItem) => item.type === MediaType.VIDEO;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isVideo(active)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoom({ visible: true, x, y });
  };

  if (orderedMedia.length === 0) return null;

  return (
    <div className='flex gap-3 aspect-3/4'>
      <div className='flex flex-col gap-2 w-18 shrink-0'>
        {orderedMedia.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item)}
            className={`relative w-18 h-20 rounded-md overflow-hidden shrink-0 border-2 transition-colors ${
              active.id === item.id ? 'border-primary' : 'border-transparent hover:border-muted-foreground/30'
            }`}
          >
            {isVideo(item) ? (
              <div className='w-full h-full bg-muted flex items-center justify-center'>
                <Play className='w-5 h-5 text-muted-foreground' />
              </div>
            ) : (
              <Image src={item.url} alt={name} fill className='object-cover' sizes='72px' />
            )}
          </button>
        ))}
      </div>

      <div
        className='relative flex-1 rounded-xl overflow-hidden'
        style={{ cursor: isVideo(active) ? 'default' : zoom.visible ? 'none' : 'crosshair' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoom((z) => ({ ...z, visible: false }))}
      >
        {isVideo(active) ? (
          <video src={active.url} className='w-full h-full object-cover' autoPlay loop muted playsInline />
        ) : (
          <>
            <Image
              src={active.url}
              alt={name}
              fill
              sizes='(max-width:768px) 100vw, 50vw'
              priority
              className='object-cover'
            />
            {zoom.visible && (
              <div
                className='absolute inset-0 pointer-events-none'
                style={{
                  backgroundImage: `url("${active.url}")`,
                  backgroundSize: '250%',
                  backgroundPosition: `${zoom.x}% ${zoom.y}%`,
                  backgroundRepeat: 'no-repeat',
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProductMediaGallery;
