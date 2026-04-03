'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MediaType } from '@prisma/client';
import { Play } from 'lucide-react';
import { CiEdit } from 'react-icons/ci';
import type { actionFunction } from '@/utils/types';
import { Button } from '../ui/button';
import FormContainer from './FormContainer';
import { SubmitButton } from './Buttons';
import ImageInput from './ImageInput';
import VideoInput from './VideoInput';

type MediaItem = {
  id: string;
  url: string;
  type: MediaType;
  order: number;
  productId: string;
};

type FileInputContainerProps = {
  media: MediaItem[];
  name: string;
  updateAction: actionFunction;
  deleteAction: actionFunction;
  reorderAction: actionFunction;
  addImagesAction: actionFunction;
  addVideoAction: actionFunction;
};

function FileInputContainer({
  media,
  name,
  updateAction,
  deleteAction,
  reorderAction,
  addImagesAction,
  addVideoAction,
}: FileInputContainerProps) {
  const videos = media.filter((m) => m.type === MediaType.VIDEO);
  const initialImages = media.filter((m) => m.type === MediaType.IMAGE);

  const [orderedImages, setOrderedImages] = useState(initialImages);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [orderChanged, setOrderChanged] = useState(false);
  const [active, setActive] = useState([...initialImages, ...videos][0] ?? null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showAddImages, setShowAddImages] = useState(false);
  const [showAddVideo, setShowAddVideo] = useState(false);

  const canAddImages = orderedImages.length < 5;
  const canAddVideo = videos.length === 0;

  if (!active) return null;

  const orderedMedia = [...orderedImages, ...videos];
  const isVideo = (item: MediaItem) => item.type === MediaType.VIDEO;

  const handleDragStart = (id: string) => setDraggedId(id);

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;
    const fromIndex = orderedImages.findIndex((m) => m.id === draggedId);
    const toIndex = orderedImages.findIndex((m) => m.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;
    const next = [...orderedImages];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setOrderedImages(next);
    setOrderChanged(true);
  };

  const handleDragEnd = () => setDraggedId(null);

  const orderPayload = JSON.stringify(
    orderedImages.map((item, index) => ({ id: item.id, order: index })),
  );

  return (
    <div className='mb-8 flex justify-center'>
      <div className='flex gap-3'>
        {/* Thumbnails */}
        <div className='flex flex-col gap-2 w-18 shrink-0'>
          {orderedMedia.map((item) => {
            const draggable = !isVideo(item);
            return (
              <button
                key={item.id}
                type='button'
                draggable={draggable}
                onDragStart={draggable ? () => handleDragStart(item.id) : undefined}
                onDragOver={draggable ? (e) => handleDragOver(e, item.id) : undefined}
                onDragEnd={draggable ? handleDragEnd : undefined}
                onClick={() => {
                  setActive(item);
                  setShowUpdateForm(false);
                }}
                className={`relative w-18 h-20 rounded-md overflow-hidden border-2 transition-colors select-none
                  ${active.id === item.id ? 'border-primary' : 'border-transparent hover:border-muted-foreground/30'}
                  ${draggedId === item.id ? 'opacity-40' : ''}
                  ${draggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}
                `}
              >
                {isVideo(item) ? (
                  <div className='w-full h-full bg-muted flex items-center justify-center'>
                    <Play className='w-5 h-5 text-muted-foreground' />
                  </div>
                ) : (
                  <Image src={item.url} alt={name} fill className='object-cover' sizes='72px' />
                )}
              </button>
            );
          })}

          {orderChanged && (
            <FormContainer action={reorderAction}>
              <input type='hidden' name='productId' value={active.productId} />
              <input type='hidden' name='order' value={orderPayload} />
              <SubmitButton size='sm' text='Update' className='w-full mt-1' />
            </FormContainer>
          )}
        </div>

        {/* Main preview + actions */}
        <div className='flex flex-col gap-3 w-100'>
          <div className='relative aspect-3/4 w-full rounded-xl overflow-hidden bg-muted'>
            {isVideo(active) ? (
              <video
                src={active.url}
                className='w-full h-full object-cover'
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <Image
                src={active.url}
                alt={name}
                fill
                sizes='(max-width:768px) 100vw, 50vw'
                className='object-cover'
                priority
              />
            )}
          </div>

          <div className='flex gap-2 justify-around'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => setShowUpdateForm((prev) => !prev)}
            >
              <CiEdit className='w-4 h-4 mr-1' />
              {showUpdateForm ? 'Cancel' : 'Replace'}
            </Button>
            <FormContainer action={deleteAction}>
              <input type='hidden' name='id' value={active.id} />
              <input type='hidden' name='productId' value={active.productId} />
              <SubmitButton
                size='sm'
                text='Delete'
                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              />
            </FormContainer>
          </div>

          {showUpdateForm && (
            <FormContainer action={updateAction}>
              <input type='hidden' name='id' value={active.id} />
              <input type='hidden' name='productId' value={active.productId} />
              <div className='max-w-sm'>
                {isVideo(active) ? <VideoInput /> : <ImageInput single />}
                <SubmitButton size='sm' text='Update' className='mt-3' />
              </div>
            </FormContainer>
          )}

          {(canAddImages || canAddVideo) && (
            <div className='flex gap-2 flex-wrap'>
              {canAddImages && (
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => { setShowAddImages((prev) => !prev); setShowAddVideo(false); }}
                >
                  {showAddImages ? 'Cancel' : `Add photos (${orderedImages.length}/5)`}
                </Button>
              )}
              {canAddVideo && (
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => { setShowAddVideo((prev) => !prev); setShowAddImages(false); }}
                >
                  {showAddVideo ? 'Cancel' : 'Add video'}
                </Button>
              )}
            </div>
          )}

          {showAddImages && (
            <FormContainer action={addImagesAction}>
              <input type='hidden' name='productId' value={active.productId} />
              <ImageInput />
              <SubmitButton size='sm' text='Upload' className='mt-3' />
            </FormContainer>
          )}

          {showAddVideo && (
            <FormContainer action={addVideoAction}>
              <input type='hidden' name='productId' value={active.productId} />
              <VideoInput />
              <SubmitButton size='sm' text='Upload' className='mt-3' />
            </FormContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileInputContainer;