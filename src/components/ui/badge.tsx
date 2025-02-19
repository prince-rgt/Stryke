import type { VariantProps } from 'class-variance-authority';

import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/styles';

const badgeVariants = cva(
  'inline-flex items-center rounded-sm font-normal font-mono text-[11px] transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      // variant: {
      //   default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
      //   secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
      //   destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
      //   outline: 'text-foreground',
      // },
      bgColor: {
        white: 'bg-foreground text-background',
        green: 'bg-success text-background',
        yellow: 'bg-highlight text-background',
        grey: 'bg-selected text-muted-foreground',
        red: 'bg-destructive text-foreground',
      },
      size: {
        xs: 'p-[2px]',
        sm: 'p-sm',
      },
    },
    defaultVariants: {
      bgColor: 'white',
      size: 'sm',
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, bgColor, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ bgColor }), className)} {...props} />;
}

export { Badge, badgeVariants };
