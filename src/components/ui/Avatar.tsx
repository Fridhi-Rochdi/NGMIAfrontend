import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface AvatarProps {
  children: ReactNode;
  className?: string;
}

interface AvatarImageProps {
  src: string;
  alt: string;
  className?: string;
}

interface AvatarFallbackProps {
  children: ReactNode;
  className?: string;
}

export function Avatar({ children, className }: AvatarProps) {
  return (
    <span
      className={cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
        className
      )}
    >
      {children}
    </span>
  );
}

export function AvatarImage({ src, alt, className }: AvatarImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn('aspect-square h-full w-full', className)}
    />
  );
}

export function AvatarFallback({ children, className }: AvatarFallbackProps) {
  return (
    <span
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600',
        className
      )}
    >
      {children}
    </span>
  );
}
