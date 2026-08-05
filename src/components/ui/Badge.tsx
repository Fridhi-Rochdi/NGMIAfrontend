import { cn } from '@/lib/utils';
import { HTMLAttributes, ReactNode } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline';
}

export function Badge({ children, variant = 'default', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-gray-100 text-gray-800': variant === 'default',
          'bg-gray-200 text-gray-700': variant === 'secondary',
          'bg-green-100 text-green-800': variant === 'success',
          'bg-yellow-100 text-yellow-800': variant === 'warning',
          'bg-red-100 text-red-800': variant === 'error',
          'bg-blue-100 text-blue-800': variant === 'info',
          'border border-gray-300 text-gray-600 bg-transparent': variant === 'outline',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
