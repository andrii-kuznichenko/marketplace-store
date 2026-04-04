import Link from 'next/link';
import Image from 'next/image';

type ColorVariant = {
  id: string;
  name: string;
  color: string | null;
  media: { url: string }[];
};

function ColorVariantSelector({
  variants,
  currentProductId,
}: {
  variants: ColorVariant[];
  currentProductId: string;
}) {
  if (variants.length <= 1) return null;

  return (
    <div className='mt-4'>
      <p className='font-medium mb-3'>Color</p>
      <div className='flex flex-wrap gap-3'>
        {variants.map((variant) => {
          const image = variant.media[0]?.url;
          const isActive = variant.id === currentProductId;

          return (
            <Link key={variant.id} href={`/products/${variant.id}`}>
              <div className='flex flex-col items-center gap-1'>
                <div
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                    isActive ? 'border-primary' : 'border-transparent hover:border-muted-foreground'
                  }`}
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={variant.color ?? variant.name}
                      width={64}
                      height={64}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full bg-muted' />
                  )}
                </div>
                <span className={`text-xs text-center ${isActive ? 'font-medium' : 'text-muted-foreground'}`}>
                  {variant.color ?? '—'}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default ColorVariantSelector;
