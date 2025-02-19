import { SupportedChainIdType } from '@/types';

import { ArrowBottomRightIcon, ArrowTopRightIcon, OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { ColumnDef, FilterFn } from '@tanstack/react-table';
import Link from 'next/link';

import { cn } from '@/utils/styles';

import NumberDisplay from '@/components/ui/number-display';
import { Typography } from '@/components/ui/typography';
import ShareDialog, { ShareDialogProps } from '../components/share-dialog';

import { CHAINS } from '@/consts/chains';

export type HistoryEntry = {
  action: string;
  strike: {
    side: 'put' | 'call' | null;
    price: React.ReactNode[];
  };
  size: {
    amount: string;
    symbol: string;
  }[];
  data: {
    label: React.ReactNode;
    value: React.ReactNode;
  }[];
  timestamp: number;
  txHash: string;
  chainId: SupportedChainIdType;
  shareDialogProps?: ShareDialogProps;
};

export const actionFilter: FilterFn<HistoryEntry> = (row, id, filterValue) => {
  if (!filterValue) return true;

  if (filterValue.includes((row.getValue(id) as string).toLowerCase())) return true;

  return false;
};

export const columns: ColumnDef<HistoryEntry>[] = [
  {
    accessorKey: 'action',
    header: () => (
      <Typography className="uppercase" variant="caption-bold">
        Action
      </Typography>
    ),
    filterFn: actionFilter,
    sortingFn: (rowA, rowB) => {
      const actionA = rowA.original.action;
      const actionB = rowB.original.action;
      return actionB > actionA ? -1 : actionA > actionB ? 1 : 0;
    },
    cell: ({ row }) => {
      return (
        <Typography variant="small-medium" className={cn('self-center', { 'py-2': row.original.action === 'Expired' })}>
          {row.original.action}
        </Typography>
      );
    },
  },
  {
    accessorKey: 'strike',
    header: () => (
      <Typography className="uppercase" variant="caption-bold">
        Strike
      </Typography>
    ),
    sortingFn: (rowA, rowB) => {
      const strikeA = Number(rowA.original.strike.price);
      const strikeB = Number(rowB.original.strike.price);
      return strikeB > strikeA ? -1 : strikeA > strikeB ? 1 : 0;
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-1">
          {row.original.strike.side === null ? null : row.original.strike.side === 'call' ? (
            <ArrowTopRightIcon className="h-4 w-4 fill-current text-success" />
          ) : (
            <ArrowBottomRightIcon className="h-4 w-4 fill-current text-destructive" />
          )}
          <span className="flex divide-x divide-border">
            {row.original.strike.price.map((strike, index) => (
              <Typography key={index} variant="small-medium" className="px-1">
                {strike}
              </Typography>
            ))}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'size',
    header: () => (
      <Typography className="uppercase" variant="caption-bold">
        Size
      </Typography>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          {row.original.size.map((s, index) => (
            <div key={index} className="flex items-center gap-x-1">
              <NumberDisplay value={Number(s.amount)} format="tokenAmount" />
              <Typography variant="small-medium" className="text-muted-foreground">
                {s.symbol}
              </Typography>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'data',
    header: () => (
      <Typography className="uppercase" variant="caption-bold">
        Info
      </Typography>
    ),
    cell: ({ row }) => {
      return row.original.data.map((datum, index) => (
        <div className="flex items-center space-x-2" key={index}>
          <Typography variant="small-medium" color="">
            {datum.label}
          </Typography>
          {<Typography variant="small-medium">{datum.value}</Typography>}
        </div>
      ));
    },
  },
  {
    accessorKey: 'timestamp',
    header: () => (
      <Typography className="uppercase" variant="caption-bold">
        Date
      </Typography>
    ),
    sortingFn: (rowA, rowB) => {
      const timestampA = Number(rowA.original.timestamp);
      const timestampB = Number(rowB.original.timestamp);
      return timestampB > timestampA ? -1 : timestampA > timestampB ? 1 : 0;
    },
    sortDescFirst: true,
    cell: ({ row }) => {
      return (
        <div>
          {new Date(Number(row.original.timestamp) * 1000).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </div>
      );
    },
  },
  {
    accessorKey: 'tx',
    header: () => '',
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-end space-x-md">
          {row.original.shareDialogProps && <ShareDialog {...row.original.shareDialogProps} />}
          <Link
            href={`${CHAINS[row.original.chainId ?? 42161].explorer}tx/${row.original.txHash}`}
            target="_blank"
            className="flex items-center gap-x-1 hover:underline">
            <Typography variant="p-medium">View</Typography>
            <OpenInNewWindowIcon height={16} width={16} />
          </Link>
        </div>
      );
    },
  },
];
