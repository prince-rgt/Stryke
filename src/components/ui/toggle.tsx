'use client';

import type { VariantProps } from 'class-variance-authority';

import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/styles';

const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-sm text-xs font-medium text-light-grey bg-selected transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-muted data-[state=on]:text-foreground',
  {
    variants: {
      variant: {
        default: '',
        // outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-6 px-md',
        md: 'h-8 px-md',
        lg: 'h-10 px-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  },
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, size, variant, ...props }, ref) => (
  <TogglePrimitive.Root ref={ref} className={cn(toggleVariants({ size, className }))} {...props} />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
