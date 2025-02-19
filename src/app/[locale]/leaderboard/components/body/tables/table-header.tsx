import { UserPnlResponseDto } from '@/app/[locale]/leaderboard/types';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { Column } from '@tanstack/react-table';

import { cn } from '@/utils/styles';

import { Typography } from '@/components/ui/typography';

const TableHeader = ({
  column,
  label,
  labelSecondary,
}: {
  column: Column<UserPnlResponseDto & { rank: number }, unknown>;
  label: string;
  labelSecondary?: string;
}) => {
  // const t = useTranslations('Dashboard');
  return (
    <div className="flex justify-between items-center p-md text-muted-foreground">
      <div className="flex flex-col">
        <Typography className="uppercase" variant={'caption-bold'}>
          {label}
        </Typography>
        {labelSecondary && (
          <Typography className="uppercase" variant={'caption-bold'}>
            {labelSecondary}
          </Typography>
        )}
      </div>
      <div
        role="button"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="flex flex-col items-center cursor-pointer">
        <ChevronUpIcon className={cn('w-3 h-3', { 'text-foreground': column.getIsSorted() === 'asc' })} />
        <ChevronDownIcon className={cn('w-3 h-3 -mt-1', { 'text-foreground': column.getIsSorted() === 'desc' })} />
      </div>
    </div>
  );
};

export default TableHeader;
