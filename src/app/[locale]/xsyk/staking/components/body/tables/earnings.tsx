'use client';

import { SupportedXsykChain } from '@/app/[locale]/xsyk/types';
import { getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import React, { useCallback, useState } from 'react';
import { useMeasure } from 'react-use';
import { formatUnits } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';

import { cn } from '@/utils/styles';
import { getSykConfig } from '@/app/[locale]/xsyk/utils';

import { Button } from '@/components/ui/button';
import { formatForDisplay } from '@/components/ui/number-display';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Typography } from '@/components/ui/typography';
import { columns } from '@/app/[locale]/xsyk/staking/components/body/tables/columns/earnings';

import useXSykStaking from '@/app/[locale]/xsyk/staking/hooks/useXSykStaking';

import xSykStakingAbi from '@/abi/xStrykeStakingAbi';

import { DEFAULT_CHAIN_ID } from '@/consts/chains';
import { SUPPORTED_XSYK_CHAINS } from '@/app/[locale]/xsyk/consts';

const Earnings = () => {
  const [_, setSorting] = useState<SortingState>([]);

  const [ref, { width: tableWidth }] = useMeasure();
  const t = useTranslations('xSYK');

  const { address: account = '0x', chainId = DEFAULT_CHAIN_ID } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  const { xsyk, xsykStaking } = getSykConfig(
    chainId && chainId in SUPPORTED_XSYK_CHAINS ? (chainId as SupportedXsykChain) : (42161 as SupportedXsykChain),
  );

  const { userShare, earnedAmounts, stakedBalance, isRewardDataLoading, refetchRewardData } = useXSykStaking();

  const table = useReactTable({
    data: earnedAmounts,
    columns: columns.map((column) => ({ ...column, size: tableWidth / 6 })),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSorting: true,
    initialState: {
      sorting: [
        {
          id: 'amount',
          desc: true,
        },
      ],
    },
  });

  const handleClaim = useCallback(async () => {
    await writeContractAsync({
      abi: xSykStakingAbi,
      address: xsykStaking,
      functionName: 'claim',
      args: [BigInt(chainId), account],
    }).then(() => refetchRewardData());
  }, [writeContractAsync, xsykStaking, chainId, account, refetchRewardData]);

  if (isRewardDataLoading)
    return (
      <div className="flex flex-col items-center justify-center bg-secondary border-b border-background h-[243px]">
        <Typography variant="p-medium" className="p-md">
          Loading...
        </Typography>
      </div>
    );

  return (
    <div className="flex flex-col items-center bg-secondary h-[243px]">
      <div className="flex p-md space-x-md w-full items-center justify-end">
        <div className="flex space-x-2 items-center bg-primary w-fit h-[24px] px-md rounded-sm">
          <span className="flex space-x-1">
            <Typography variant="caption-bold" className="text-muted-foreground">
              {t('Staking.Summary.Share')}:
            </Typography>
            <Typography variant="caption-bold">
              {formatForDisplay({ value: Number(userShare), format: 'tokenAmount', precision: 2 })}%
            </Typography>
          </span>
          <span className="flex space-x-1">
            <Typography variant="caption-bold" className="text-muted-foreground">
              {t('Staking.Summary.Staked')}:
            </Typography>
            <Typography variant="caption-bold">
              {formatForDisplay({
                value: Number(formatUnits(stakedBalance, xsyk.decimals) ?? 0),
                format: 'tokenAmount',
                precision: 2,
              })}{' '}
              {xsyk.symbol}
            </Typography>
          </span>
        </div>
        <Button
          variant="accent"
          size="sm"
          onClick={handleClaim}
          disabled={isPending || (earnedAmounts[0]?.amount === 0n && earnedAmounts[1]?.amount === 0n)}>
          {isPending ? 'Claiming...' : 'Claim All'}
        </Button>
      </div>
      <Table
        // @ts-ignore
        ref={ref}>
        <TableHeader style={{ height: 24 }}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} style={{ border: 0 }} className="bg-secondary">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{ width: `${header.getSize()}px`, paddingLeft: 6, paddingRight: 6, height: 24 }}>
                  {header.isPlaceholder
                    ? null
                    : typeof header.column.columnDef.header === 'function'
                      ? header.column.columnDef.header(header.getContext())
                      : header.column.columnDef.header}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody ref={null}>
          {table.getRowModel().rows.map((row) => {
            return (
              <TableRow
                className={cn({ 'bg-selected': row.getIsSelected() })}
                style={{ height: 40, border: 0 }}
                key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    style={{ width: `${cell.column.getSize()}px`, paddingTop: 0, paddingBottom: 0 }}
                    key={cell.id}>
                    {typeof cell.column.columnDef.cell === 'function'
                      ? cell.column.columnDef.cell(cell.getContext())
                      : cell.getValue()}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default Earnings;
