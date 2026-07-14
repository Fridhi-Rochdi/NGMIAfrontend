import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface AlertProps {
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  children: ReactNode;
  className?: string;
}

interface AlertDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function Alert({ variant = 'default', children, className }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'relative w-full rounded-lg border p-4',
        {
          'bg-gray-50 text-gray-900 border-gray-200': variant === 'default',
          'bg-red-50 text-red-900 border-red-200': variant === 'destructive',
          'bg-green-50 text-green-900 border-green-200': variant === 'success',
          'bg-yellow-50 text-yellow-900 border-yellow-200': variant === 'warning',
        },
        className
      )}
    >
      {children}
    </div>
  );
}

export function AlertDescription({ children, className }: AlertDescriptionProps) {
  return (
    <div className={cn('text-sm [&_p]:leading-relaxed', className)}>
      {children}
    </div>
  );
}
