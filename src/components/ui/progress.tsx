'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

import { cn } from '@/utils/styles';

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    colorMap?: {
      high: string;
      medium: string;
      low: string;
    };
  }
>(({ className, value, colorMap, ...props }, ref) => {
  const defaultColorMap = {
    high: 'bg-highlight',
    medium: 'bg-success-light',
    low: 'bg-success',
  };

  const progressColor = colorMap || defaultColorMap;

  const getColor = (value: number) => {
    if (value > 80) return progressColor.high;
    if (value > 50) return progressColor.medium;
    return progressColor.low;
  };
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn('relative h-1 w-full overflow-hidden rounded-full bg-selected', className)}
      {...props}>
      <ProgressPrimitive.Indicator
        className={cn('h-full w-full flex-1 transition-all', getColor(value || 0))}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
