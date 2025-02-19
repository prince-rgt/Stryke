import { MarketData } from '@/types';

import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { Column } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import { cn } from '@/utils/styles';

import { Typography } from '@/components/ui/typography';

const TableHeader = ({
  column,
  label,
  labelSecondary,
}: {
  column: Column<MarketData, unknown>;
  label: string;
  labelSecondary?: string;
}) => {
  const t = useTranslations('Dashboard');
  return (
    <div className="flex items-center justify-between p-md text-muted-foreground">
      <div className="flex flex-col">
        <Typography className="uppercase" variant={'caption-bold'}>
          {t(label)}
        </Typography>
        {labelSecondary && (
          <Typography className="uppercase" variant={'caption-bold'}>
            {t(labelSecondary)}
          </Typography>
        )}
      </div>
      <div
        role="button"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="flex cursor-pointer flex-col items-center">
        <ChevronUpIcon className={cn('h-3 w-3', { 'text-foreground': column.getIsSorted() === 'asc' })} />
        <ChevronDownIcon className={cn('-mt-1 h-3 w-3', { 'text-foreground': column.getIsSorted() === 'desc' })} />
      </div>
    </div>
  );
};

export default TableHeader;
