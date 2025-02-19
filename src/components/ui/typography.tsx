import type { VariantProps } from 'class-variance-authority';

import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/styles';

const typographyVariants = cva(
  // Base classes that could apply to all typographic elements
  'm-0',
  {
    variants: {
      variant: {
        'h1-bold': 'font-bold text-5xl',
        'h2-bold': 'font-bold text-3xl',
        'h3-medium': 'font-medium text-2xl',
        'h4-bold': 'font-bold text-xl',
        'p-medium': 'font-medium text-sm',
        'p-bold': 'font-bold text-sm',
        'li-medium': 'font-medium text-sm',
        'large-bold': 'font-bold text-lg',
        'small-regular': 'font-normal text-xs',
        'small-medium': 'font-medium text-xs',
        'small-bold': 'font-bold text-xs',
        'extra-small-regular': 'font-normal font-mono text-[11px]',
        'caption-bold': 'font-bold text-[10px]',
      },
    },
    defaultVariants: {
      variant: 'p-medium',
    },
  },
);

export interface TypographyProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof typographyVariants> {
  asChild?: boolean;
  as?: 'span' | 'div' | 'a' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
}

const Typography = React.forwardRef<HTMLElement, React.PropsWithChildren<TypographyProps>>(
  ({ asChild, as: Component = 'p', className, variant, children, ...props }, ref) => {
    return (
      <Component ref={ref as any} className={cn(typographyVariants({ variant }), className)} {...props}>
        {children}
      </Component>
    );
  },
);

Typography.displayName = 'Typography';

export { Typography, typographyVariants };
