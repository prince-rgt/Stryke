import type { VariantProps } from 'class-variance-authority';

import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/styles';

const buttonVariants = cva(
  // Base classes that apply to all buttons
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none',
  {
    variants: {
      size: {
        sm: 'h-6 px-[5px] gap-2 font-medium text-xs',
        md: 'h-8 px-2 gap-2 font-medium text-xs',
        lg: 'h-10 px-3 gap-2 font-medium text-sm',
      },
      variant: {
        accent: 'bg-foreground text-background hover:bg-accent disabled:text-muted-foreground disabled:bg-selected',
        secondary: 'bg-muted text-foreground hover:bg-selected disabled:text-muted-foreground disabled:bg-selected',
        ghost: 'bg-transparent text-foreground hover:bg-selected disabled:text-muted-foreground disabled:bg-selected',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'accent',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
