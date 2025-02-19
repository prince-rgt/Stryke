'use client';

import { OnChangeFn, VisibilityState } from '@tanstack/react-table';
import { format } from 'date-fns';
import { startCase } from 'lodash';
import { Calendar as CalendarIcon } from 'lucide-react';
import React from 'react';
import { useShallow } from 'zustand/react/shallow';

import { cn } from '@/utils/styles';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Typography } from '@/components/ui/typography';

import useFilterStore from './store';

export function PeriodFilter({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const { period, setPeriod } = useFilterStore(
    useShallow((state) => ({ period: state.period, setPeriod: state.setPeriod })),
  );

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="ghost"
            className={cn(
              'h-6 w-fit justify-start bg-muted text-left text-xs font-normal',
              !period && 'text-muted-foreground',
            )}>
            <CalendarIcon className="mr-2 h-3 w-3" />
            {period && period.from ? (
              period.to ? (
                <>
                  {format(period.from, 'LLL dd, y')} - {format(period.to, 'LLL dd, y')}
                </>
              ) : (
                format(period.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={period?.from}
            selected={period}
            onSelect={setPeriod}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export const ActionFilter = ({
  actionVisibility,
  setActionVisibility,
}: {
  actionVisibility: Record<string, boolean>;
  setActionVisibility: OnChangeFn<VisibilityState>;
}) => {
  const toggleActionVisibility = (action: string) => {
    setActionVisibility((prev) => ({
      ...prev,
      [action]: !prev[action],
    }));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="flex items-center text-white/80 hover:text-white" variant={'secondary'} size={'sm'}>
          Action Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[256px] space-y-md">
        {Object.keys(actionVisibility).map((action) => (
          <div key={action} className="flex items-center space-x-2">
            <Checkbox
              id={action}
              checked={actionVisibility[action]}
              onCheckedChange={() => toggleActionVisibility(action)}
            />
            <label htmlFor={action} className="text-sm font-medium leading-none">
              <Typography variant="small-medium">{startCase(action)}</Typography>
            </label>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};
