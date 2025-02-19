import { VestEntry } from '@/app/[locale]/xsyk/types';
import { ColumnDef } from '@tanstack/react-table';
import { formatDistance } from 'date-fns';
import { formatUnits } from 'viem';

import { Button } from '@/components/ui/button';
import { formatForDisplay } from '@/components/ui/number-display';
import { Typography } from '@/components/ui/typography';

import CancelDialog from './cancel-dialog';

export const columns: ColumnDef<VestEntry, any>[] = [
  {
    accessorKey: 'duration',
    header: () => (
      <Typography className="uppercase text-muted-foreground" variant="small-medium">
        Duration
      </Typography>
    ),
    cell: ({ row }) => {
      return (
        <Typography variant="small-medium" className="self-center">
          {formatDistance(new Date((row.original.blockTimestamp + row.original.duration) * 1000), new Date())}
        </Typography>
      );
    },
  },
  {
    accessorKey: 'xSykAmount',
    header: () => (
      <Typography className="uppercase text-muted-foreground" variant="small-medium">
        From
      </Typography>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Typography variant="small-medium">
            {formatForDisplay({
              value: Number(formatUnits(BigInt(row.original.xSykAmount), 18)),
              format: 'tokenAmount',
            })}
          </Typography>
          <Typography variant="small-medium" className="text-muted-foreground">
            xSYK
          </Typography>
        </div>
      );
    },
  },
  {
    accessorKey: 'sykAmount',
    header: () => (
      <Typography className="uppercase text-muted-foreground" variant="small-medium">
        To
      </Typography>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Typography variant="small-medium">
            {formatForDisplay({
              value: Number(formatUnits(BigInt(row.original.sykAmount), 18)),
              format: 'tokenAmount',
            })}
          </Typography>
          <Typography variant="small-medium" className="text-muted-foreground">
            SYK
          </Typography>
        </div>
      );
    },
  },
  {
    accessorKey: 'action',
    header: () => (
      <Typography className="uppercase w-full text-right text-muted-foreground" variant="small-medium">
        Actions
      </Typography>
    ),
    cell: ({ row }) => {
      const hasDurationElapsed =
        row.original.blockTimestamp + row.original.duration < Math.ceil(new Date().getTime() / 1000);
      return (
        <div className="flex w-full justify-end">
          {hasDurationElapsed ? (
            <Button onClick={row.original.button.action} disabled={row.original.button.disabled} size="sm">
              {row.original.button.label}
            </Button>
          ) : (
            <CancelDialog xSykAmount={row.original.xSykAmount} vestIndex={row.original.vestIndex} />
          )}
        </div>
      );
    },
  },
];
