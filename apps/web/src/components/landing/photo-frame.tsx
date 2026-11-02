import Image from 'next/image';
import type { Photo } from '@/lib/landing-content';
import { cn } from '@/lib/utils';

type PhotoFrameProps = {
  photo: Photo;
  sizes: string;
  className?: string;
  priority?: boolean;
};

export function PhotoFrame({ photo, sizes, className, priority }: PhotoFrameProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-3xl bg-paper-3', className)}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="photo object-cover"
      />
    </div>
  );
}
