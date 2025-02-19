'use client';

import type { VariantProps } from 'class-variance-authority';

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cva } from 'class-variance-authority';
import { Circle } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/utils/styles';

const radioVariants = cva(
  // Base classes that apply to all radio buttons
  'peer h-4 w-4 shrink-0 rounded-full hover:bg-muted border border-muted ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-selected disabled:text-muted-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background',
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

export interface RadioProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioVariants> {}

const Radio = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Item>, RadioProps>(
  ({ className, size, ...props }, ref) => (
    <RadioGroupPrimitive.Item ref={ref} className={cn(radioVariants({ size }), className)} {...props}>
      <RadioGroupPrimitive.Indicator className={cn('flex items-center justify-center')}>
        <Circle className={cn('h-2.5 w-2.5 fill-current text-current')} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  ),
);
Radio.displayName = RadioGroupPrimitive.Item.displayName;

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export { Radio, RadioGroup };
