import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import React from 'react';

import { Radio } from '@/components/ui/radio';
import { Typography } from '@/components/ui/typography';

import { CHAINS } from '@/consts/chains';

import { RowData } from '../../../../types';

export const Columns = (isGauge: boolean): ColumnDef<RowData>[] => [
  {
    accessorKey: 'name',
    header: () => (
      <Typography className="uppercase text-muted-foreground" variant="caption-bold">
        Name
      </Typography>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-start space-x-md">
        {isGauge && (
          <Radio
            checked={row.getIsSelected()}
            value={row.id}
            onClick={(e) => e.stopPropagation()}
            aria-label="Select row"
          />
        )}
        <div className="flex items-center">
          <div className="mr-2 flex">
            {row.original.logo.map((logo, index) => (
              <div
                key={index}
                className={`${index !== 0 ? '-ml-2' : ''} relative`}
                style={{ zIndex: row.original.logo.length - index }}>
                <Image
                  width={24}
                  height={24}
                  src={logo}
                  alt={`${row.original.name.split(' ')[0]} logo ${index + 1}`}
                  className="h-6 w-6 rounded-full"
                />
              </div>
            ))}
          </div>
          <Typography variant="small-medium">{row.original.name}</Typography>
        </div>
      </div>
    ),
  },
  {
    accessorKey: isGauge ? 'weight' : 'your weight',
    header: () => (
      <Typography className="uppercase text-muted-foreground" variant="caption-bold">
        {isGauge ? 'Weight' : 'Your Weight'}
      </Typography>
    ),
    cell: ({ row }) => (
      <div className="flex w-full items-center">
        <Typography variant="small-medium">
          {(Number(isGauge ? row.original.weight : row.original.userWeight) / 1e18).toFixed(2)}
        </Typography>
        <Typography variant="small-medium" className="ml-1 text-muted-foreground">
          xSYK
        </Typography>
      </div>
    ),
  },
  {
    accessorKey: isGauge ? 'rewards' : 'share',
    header: () => (
      <Typography className="uppercase text-muted-foreground" variant="caption-bold">
        {isGauge ? 'Rewards' : 'Share'}
      </Typography>
    ),
    cell: ({ row }) => (
      <div className="flex w-full items-center">
        {isGauge ? (
          <>
            <Typography variant="small-medium">{(Number(row.original.rewards) / 1e18).toFixed(2)}</Typography>
            <Typography variant="small-medium" className="ml-1 text-muted-foreground">
              SYK
            </Typography>
          </>
        ) : (
          <Typography variant="small-medium">
            {Number(row.original.share).toFixed(4)} <span className="text-muted-foreground">%</span>
          </Typography>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'chain',
    header: () => (
      <Typography className="uppercase text-muted-foreground" variant="caption-bold">
        Chain
      </Typography>
    ),
    cell: ({ row }) => (
      <div className="mr-2 flex w-full items-center">
        <Image
          width={24}
          height={24}
          src={CHAINS[row.original.chain].icon}
          alt={CHAINS[row.original.chain].name}
          className="h-6 w-6"
        />
        <Typography variant="small-medium" className="ml-2 capitalize">
          {CHAINS[row.original.chain].name}
        </Typography>
      </div>
    ),
  },
  {
    accessorKey: 'epoch',
    header: () => (
      <Typography className="uppercase text-muted-foreground" variant="caption-bold">
        Epoch
      </Typography>
    ),
    cell: ({ row }) => (
      <div className="flex w-full items-center justify-between">
        <Typography variant="small-medium">{Number(row.original.epoch)}</Typography>
      </div>
    ),
  },
];
