'use client';

import { BUILD_APP_NAMES } from '@/types';

import { DoubleArrowDownIcon, DoubleArrowUpIcon } from '@radix-ui/react-icons';
import { getCoreRowModel, getSortedRowModel, OnChangeFn, useReactTable, VisibilityState } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { useMeasure, useWindowSize } from 'react-use';

import { cn } from '@/utils/styles';

import { Button } from '@/components/ui/button';
import NumberDisplay from '@/components/ui/number-display';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Typography } from '@/components/ui/typography';

import useStrikesStore from '../../../../hooks/store/useStrikesStore';

import { BUILD_APP_NAME } from '@/consts/env';

import { columns } from './columns';

const VERTICAL_SPACING_ADJUSTMENT = BUILD_APP_NAME === BUILD_APP_NAMES.PANCAKESWAP ? 24 : 0;

export const StrikesTable = ({
  toggles: { callsExpanded, putsExpanded, toggleCalls, togglePuts },
  columnVisibility,
  setColumnVisibility,
}: {
  toggles: {
    callsExpanded: boolean;
    toggleCalls: (nextValue?: any) => void;
    putsExpanded: boolean;
    togglePuts: (nextValue?: any) => void;
  };
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: OnChangeFn<VisibilityState>;
}) => {
  const {
    strikes,
    markPrice,
    setSelectedStrikes,
    isChartCollapsed,
    selectedStrikes,
    filterSettings,
    displayStrikesAsMarketCap,
    markPriceUsd,
    selectedMarket,
  } = useStrikesStore();

  const { circulatingSupply, isMemePair, pair } = selectedMarket;
  const putToken = pair?.[1];
  const marketCap = markPriceUsd * circulatingSupply;

  const callsSelection = React.useMemo(() => {
    return selectedStrikes
      .filter((strike) => strike > markPrice)
      .reduce((acc: { [key: number]: boolean }, strike) => {
        acc[strike] = true;
        return acc;
      }, {});
  }, [markPrice, selectedStrikes]);

  const putsSelection = React.useMemo(() => {
    return selectedStrikes
      .filter((strike) => strike < markPrice)
      .reduce((acc: { [key: number]: boolean }, strike) => {
        acc[strike] = true;
        return acc;
      }, {});
  }, [markPrice, selectedStrikes]);

  const { usdThreshold, optionsAmountThreshold, liquidityThresholdType, maxStrike, minStrike } = useMemo(
    () =>
      filterSettings[selectedMarket?.address?.toLowerCase()] || {
        minStrike: 0,
        maxStrike: Infinity,
        optionsAmountThreshold: 0,
        usdThreshold: 0,
        liquidityThresholdType: 'intraday',
      },
    [selectedMarket.address, filterSettings],
  );

  // Split strikes into two groups based on the markPrice
  const strikesAboveMarkPrice = React.useMemo(
    () =>
      strikes
        .filter((strike) => strike.strikePrice > markPrice)
        .filter(({ strikePrice }) => (maxStrike ? maxStrike > strikePrice : true))
        .filter(({ strikePrice }) => minStrike < strikePrice)
        // Filter by options amount
        .filter(
          ({ availableLiquidity, availableLiquidityWeekly }) =>
            optionsAmountThreshold <
            (liquidityThresholdType === 'intraday'
              ? availableLiquidity.amountToken
              : availableLiquidityWeekly.amountToken),
        )
        // Filter by liquidity usd value
        .filter(
          ({ availableLiquidity, availableLiquidityWeekly }) =>
            usdThreshold <
            (liquidityThresholdType === 'intraday' ? availableLiquidity.amountUSD : availableLiquidityWeekly.amountUSD),
        ),
    [strikes, markPrice, maxStrike, minStrike, optionsAmountThreshold, liquidityThresholdType, usdThreshold],
  );
  const strikesBelowMarkPrice = React.useMemo(
    () =>
      strikes
        .filter((strike) => strike.strikePrice <= markPrice)
        .filter(({ strikePrice }) => (maxStrike ? maxStrike > strikePrice : true))
        .filter(({ strikePrice }) => minStrike < strikePrice)
        // Filter by options amount
        .filter(
          ({ availableLiquidity, strikePrice, availableLiquidityWeekly }) =>
            optionsAmountThreshold <
            (liquidityThresholdType === 'intraday'
              ? availableLiquidity.amountToken
              : availableLiquidityWeekly.amountToken) /
              strikePrice,
        )
        // Filter by liquidity usd value
        .filter(
          ({ availableLiquidity, availableLiquidityWeekly }) =>
            usdThreshold <
            (liquidityThresholdType === 'intraday' ? availableLiquidity.amountUSD : availableLiquidityWeekly.amountUSD),
        ),
    [strikes, markPrice, maxStrike, minStrike, optionsAmountThreshold, liquidityThresholdType, usdThreshold],
  );

  // console.log({ strikesAboveMarkPrice, strikesBelowMarkPrice, markPrice });

  const { height: windowHeight } = useWindowSize();
  const [ref, { width: tableWidth }] = useMeasure();

  // todo: way too hacky, but couldn't find a better cuz table is messing things up
  // find a better way to do this
  // const height = windowHeight - 36.5 - 1 - 40 - 1 - (isChartCollapsed ? 1 : 300) - 1 - 32 - 1 - 48.5 - 38.5 - 44 - 2;
  const height =
    windowHeight -
    36.5 -
    1 -
    40 -
    1 -
    (isChartCollapsed ? 1 : 300) -
    1 -
    32 -
    1 -
    48.5 -
    38.5 -
    44 -
    2 -
    VERTICAL_SPACING_ADJUSTMENT;

  const callsTableBodyRef = React.useRef<HTMLTableSectionElement | null>(null);
  const isInitialRenderRef = React.useRef(true);
  const selectedMarketRef = React.useRef(selectedMarket.address);

  // Effect to scroll the calls table to the bottom after it has loaded
  React.useEffect(() => {
    if (selectedMarketRef.current !== selectedMarket.address) {
      isInitialRenderRef.current = true;
      selectedMarketRef.current = selectedMarket.address;
    }
    if (callsTableBodyRef.current && isInitialRenderRef.current && strikesAboveMarkPrice.length > 0) {
      const scrollHeight = callsTableBodyRef.current.scrollHeight;
      callsTableBodyRef.current.scrollTo(0, scrollHeight);
      isInitialRenderRef.current = false; // Set it to false so it doesn't run again
    }
  }, [strikesAboveMarkPrice, callsExpanded, selectedMarket.address]);

  const tableAbove = useReactTable({
    data: strikesAboveMarkPrice,
    meta: {
      displayStrikesAsMarketCap,
      avgRewardAPR: 0,
    },
    columns: columns.map((column) => ({
      ...column,
      size: tableWidth / Object.values(columnVisibility).filter(Boolean).length,
    })),
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: (update) => {
      //@ts-ignore
      const newSelection = update(callsSelection);
      setSelectedStrikes([...Object.keys(newSelection).map(Number), ...Object.keys(putsSelection).map(Number)]);
    },
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: 'strikePrice',
          desc: true, // sort by openInterest in descending order by default
        },
      ],
    },
    state: {
      rowSelection: callsSelection,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (row) => String(row.strikePrice),
  });

  const tableBelow = useReactTable({
    data: strikesBelowMarkPrice,
    meta: {
      displayStrikesAsMarketCap,
      avgRewardAPR: 0,
    },
    columns: columns.map((column) => ({
      ...column,
      size: tableWidth / Object.values(columnVisibility).filter(Boolean).length,
    })),
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: (update) => {
      //@ts-ignore
      const newSelection = update(putsSelection);
      setSelectedStrikes([...Object.keys(callsSelection).map(Number), ...Object.keys(newSelection).map(Number)]);
    },
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: 'strikePrice',
          desc: true, // sort by openInterest in descending order by default
        },
      ],
    },
    state: {
      rowSelection: putsSelection,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (row) => String(row.strikePrice),
  });

  return (
    <Table
      //@ts-ignore
      ref={ref}
      containerClassName="max-h-full"
      className={cn('min-w-full bg-background')}>
      <TableHeader className="block bg-secondary">
        {tableAbove.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} style={{ width: `${header.getSize()}px` }}>
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
      {callsExpanded && (
        <TableBody
          ref={callsTableBodyRef}
          style={{ height: `${putsExpanded ? height / 2 : height}px` }}
          className={cn('block overflow-auto bg-secondary', {})}>
          {tableAbove.getRowModel().rows.map((row) => {
            return (
              <TableRow className={cn({ 'bg-selected': row.getIsSelected() })} key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell style={{ width: `${cell.column.getSize()}px` }} key={cell.id}>
                    {typeof cell.column.columnDef.cell === 'function'
                      ? cell.column.columnDef.cell(cell.getContext())
                      : cell.getValue()}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      )}
      <TableBody className={cn('my-[1px] block bg-selected')}>
        <TableRow>
          <TableCell colSpan={4} className="flex items-center space-x-[1px] p-sm">
            <Tooltip delayDuration={50}>
              <TooltipTrigger>
                <Button
                  variant={'secondary'}
                  size={'sm'}
                  disabled={!putsExpanded && callsExpanded}
                  onClick={() => {
                    toggleCalls();
                    isInitialRenderRef.current = true;
                  }}>
                  {callsExpanded ? (
                    <DoubleArrowUpIcon className="h-4 w-4" />
                  ) : (
                    <DoubleArrowDownIcon className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Calls</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={50}>
              <TooltipTrigger>
                <Button
                  disabled={!callsExpanded && putsExpanded}
                  variant={'secondary'}
                  size={'sm'}
                  onClick={togglePuts}>
                  {putsExpanded ? (
                    <DoubleArrowDownIcon className="h-4 w-4" />
                  ) : (
                    <DoubleArrowUpIcon className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Puts</TooltipContent>
            </Tooltip>

            <Typography className="px-sm" variant={'extra-small-regular'}>
              {displayStrikesAsMarketCap ? (
                <NumberDisplay precision={4} value={marketCap} format="usd" />
              ) : (
                <NumberDisplay value={markPriceUsd} showDecimalZerosSubscript precision={6} format="usd" />
              )}
            </Typography>
            {isMemePair && (
              <Typography className="text-muted-foreground" variant="small-medium">
                {'  ('}
                <NumberDisplay showDecimalZerosSubscript precision={8} value={markPrice} format="tokenAmount" />
                {` ${putToken.symbol}`}
                {')'}
              </Typography>
            )}
          </TableCell>
          {
            // todo: fix the colspan issue
            // Colspan not working as expected. added empty cells to align with the table above
          }
          <TableCell />
          <TableCell />
          <TableCell />
          <TableCell />
        </TableRow>
      </TableBody>

      {putsExpanded && (
        <TableBody
          style={{ height: `${callsExpanded ? height / 2 : height}px` }}
          className={cn('block overflow-auto bg-secondary')}>
          {tableBelow.getRowModel().rows.map((row) => {
            return (
              <TableRow className={cn({ 'bg-selected': row.getIsSelected() })} key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} style={{ width: `${cell.column.getSize()}px` }}>
                    {typeof cell.column.columnDef.cell === 'function'
                      ? cell.column.columnDef.cell(cell.getContext())
                      : cell.getValue()}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      )}
    </Table>
  );
};
