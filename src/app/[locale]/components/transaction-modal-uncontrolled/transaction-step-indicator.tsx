import React from 'react';

import { cn } from '@/utils/styles';

import { Typography } from '@/components/ui/typography';

const TransactionStepIndicator = ({
  steps,
  currentStep,
  errorStep,
}: {
  steps: any[];
  currentStep: number;
  errorStep?: number;
}) => {
  return (
    <div className="flex w-full items-center justify-between">
      {steps.map((_, index) => (
        <div
          key={index}
          className={cn(
            'relative flex items-center overflow-hidden', // Use relative to position the line with absolute positioning
            { ['flex-1']: index < steps.length - 1 }, // Assign flex-1 to each element so they share space equally
            { 'opacity-50': index > currentStep }, // Dim the steps that have not been reached
          )}>
          <div
            className={cn(
              'z-10 flex h-6 w-6 items-center justify-center rounded-sm', // z-10 to stack on top of the line
              index === errorStep ? 'bg-destructive' : index < currentStep ? 'bg-success' : 'bg-selected',
            )}>
            <Typography variant={'extra-small-regular'}>{index + 1}</Typography>
          </div>
          {index < steps.length && (
            <div
              className={cn(
                'absolute left-6 top-1/2 w-full -translate-y-1/2',
                'h-[1px]',
                index < currentStep ? 'bg-success' : 'bg-selected',
              )}
              style={{ right: '50%' }} // Line should extend from the right side of the circle to the middle of the space between this step and the next step
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default TransactionStepIndicator;
