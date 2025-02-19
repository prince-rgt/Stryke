import type { VariantProps } from 'class-variance-authority';

import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/styles';

const inputVariants = cva(
  // Base classes that apply to all inputs
  'flex w-full rounded-sm border font-medium text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed',
  {
    variants: {
      size: {
        sm: 'h-6 px-sm',
        md: 'h-8 px-md',
        lg: 'h-10 px-md',
      },
      variant: {
        default: 'border-input bg-muted disabled:bg-selected disabled:text-muted',
        // focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        ghost: 'border-transparent bg-transparent disabled:text-muted',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error = false, variant, size, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size }), { 'border-destructive bg-[#F8326233]': error }, className)}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

export { Input, inputVariants };
