import { cn } from '@/lib/utils';
import { LabelHTMLAttributes, forwardRef } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('block text-sm font-medium text-gray-700 mb-1', className)}
        {...props}
      >
        {children}
      </label>
    );
  }
);

Label.displayName = 'Label';

export { Label };
