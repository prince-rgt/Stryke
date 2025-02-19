import { LayoutIcon } from '@radix-ui/react-icons';
import { OnChangeFn, VisibilityState } from '@tanstack/react-table';
import { startCase } from 'lodash';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Typography } from '@/components/ui/typography';

import { columnIds } from '../strikes-table/columns';

const ColumnVisibilitySelector = ({
  columnVisibility,
  setColumnVisibility,
}: {
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: OnChangeFn<VisibilityState>;
}) => {
  const toggleColumnVisibility = (columnId: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="flex items-center text-foreground/80 hover:text-foreground" variant={'ghost'} size={'sm'}>
          <LayoutIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[256px] space-y-md">
        {columnIds.map((column, index) =>
          index == 0 || index == 1 ? null : (
            <div key={column} className="flex items-center space-x-2">
              <Checkbox
                id={column}
                checked={columnVisibility[column]}
                onCheckedChange={() => toggleColumnVisibility(column)}
              />
              <label htmlFor={column} className="text-sm font-medium leading-none">
                <Typography variant="small-medium">{startCase(column)}</Typography>
              </label>
            </div>
          ),
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ColumnVisibilitySelector;
