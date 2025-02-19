'use client';

import type { VariantProps } from 'class-variance-authority';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cva } from 'class-variance-authority';
import { Check } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/utils/styles';

const checkboxVariants = cva(
  // Base classes that apply to all checkboxes
  'peer h-4 w-4 shrink-0 rounded-sm hover:bg-muted border border-muted ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-selected disabled:text-muted-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background',
  {
    variants: {
      size: {
        sm: 'h-[14px] w-[14px]',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  },
);

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, size, ...props }, ref) => (
    <CheckboxPrimitive.Root ref={ref} className={cn(checkboxVariants({ size }), className)} {...props}>
      <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
        <Check className={cn('h-full w-full')} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  ),
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
