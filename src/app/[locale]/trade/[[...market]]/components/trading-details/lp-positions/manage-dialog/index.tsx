import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, encodeAbiParameters, encodeFunctionData, formatUnits, Hex } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import NumberDisplay from '@/components/ui/number-display';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Typography } from '@/components/ui/typography';
import TransactionModalUncontrolled, { Transaction } from '@/app/[locale]/components/transaction-modal-uncontrolled';

import useTokenBalancesStore from '../../../../hooks/store/useTokenBalancesStore';
import { DepositsPositionsData } from '../hooks/useDepositsPositionsData';
import useManageStore from './hooks/useManageStore';
import useStrikesStore from '@/app/[locale]/trade/[[...market]]/hooks/store/useStrikesStore';

import DopexV2PositionManager from '@/abi/DopexV2PositionManager';
import UniswapV3SingleTickLiquidityHandlerV2 from '@/abi/UniswapV3SingleTickLiquidityHandlerV2';

import { POSITION_MANAGER_ADDRESSES_BY_CHAIN_ID } from '@/consts/clamm';

import { columns } from './columns';

const ManageDialog = ({ manageData }: { manageData: DepositsPositionsData['manage'] }) => {
  const { positions, refetch } = manageData;
  const { setRefetch } = useManageStore();

  useEffect(() => {
    setRefetch(refetch);
  }, [refetch, setRefetch]);

  const { selectedMarket } = useStrikesStore();
  const { chainId, chainName } = selectedMarket;
  const { chainId: userChainId } = useAccount();
  const { refetchTokenBalances: refetchSidePanelTokenBalances } = useTokenBalancesStore();
  const symbols = {
    symbol0: positions[0]?.liquidity.amount0Symbol,
    symbol1: positions[0]?.liquidity.amount1Symbol,
  };
  const [selectedPositions, setSelectedPositions] = useState<{ [key: number]: boolean }>({});
  const publicClient = usePublicClient();

  const [withdrawTxQueue, setWithdrawTxQueue] = useState<
    Map<
      string,
      {
        tx: Hex;
        amount0: number;
        amount1: number;
      }
    >
  >(new Map());

  // const removeTxFromQueue = (id: string) => {
  //   setWithdrawTxQueue((prev) => {
  //     const newQueue = prev;
  //     newQueue.delete(id);
  //     return new Map(newQueue);
  //   });
  // };

  const updateTxQueue = (id: string, tx: Hex, amount0: number, amount1: number) => {
    setWithdrawTxQueue((prev) => {
      const newQueue = prev;
      newQueue.set(id, {
        amount0,
        amount1,
        tx,
      });
      return new Map(newQueue);
    });
  };

  const clearTxQueue = () => {
    setWithdrawTxQueue(new Map());
  };

  const getSharesMulticall = useCallback(
    async (multicallRequest: any[]) => {
      return (
        await publicClient!.multicall({
          contracts: multicallRequest,
        })
      ).map(({ result }) => (result as bigint) ?? BigInt(0));
    },
    [publicClient],
  );

  useEffect(() => {
    const updateQueues = async () => {
      const multicallRequests: any[] = [];
      const params: {
        handler: string;
        pool: string;
        hook: string;
        tickLower: number;
        tickUpper: number;
        amount0: number;
        amount1: number;
        tokenId: string;
      }[] = [];
      Object.keys(selectedPositions).forEach((key, index) => {
        const position = positions.find((position) => Number(position.withdraw.tokenId) === Number(key));
        // console.log({ selectedPositions, position });
        if (position) {
          const { withdraw } = position;
          const {
            withdrawableLiquidity,
            handler,
            tokenId,
            pool,
            hook,
            tickLower,
            tickUpper,
            amount0,
            amount1,
            amount0Decimals,
            amount1Decimals,
          } = withdraw;
          const multiCallReq = {
            abi: UniswapV3SingleTickLiquidityHandlerV2,
            functionName: 'convertToShares',
            address: handler,
            args: [withdrawableLiquidity, tokenId],
          };
          multicallRequests.push(multiCallReq);
          params.push({
            tokenId,
            handler,
            pool,
            tickLower,
            tickUpper,
            hook,
            amount0: Number(formatUnits(BigInt(amount0), amount0Decimals)),
            amount1: Number(formatUnits(BigInt(amount1), amount1Decimals)),
          });
        }
      });
      const convertToShares = await getSharesMulticall(multicallRequests);
      const withdrawTxns = convertToShares.map((shares, index) => {
        shares = BigInt(shares) > BigInt(3) ? BigInt(shares) - BigInt(1) : BigInt(shares);

        return encodeFunctionData({
          abi: DopexV2PositionManager,
          functionName: 'burnPosition',
          args: [
            params[index]['handler'] as Address,
            encodeAbiParameters(
              [
                {
                  name: 'pool',
                  type: 'address',
                },
                {
                  name: 'hook',
                  type: 'address',
                },
                {
                  name: 'tickLower',
                  type: 'int24',
                },
                {
                  name: 'tickUpper',
                  type: 'int24',
                },
                {
                  name: 'shares',
                  type: 'uint128',
                },
              ],
              [
                params[index]['pool'] as Address,
                params[index]['hook'] as Address,
                params[index]['tickLower'],
                params[index]['tickUpper'],
                shares,
              ],
            ),
          ],
        });
      });

      clearTxQueue();
      withdrawTxns.forEach((tx, index) => {
        updateTxQueue(params[index]['tokenId'], tx, params[index]['amount0'], params[index]['amount1']);
      });
    };

    updateQueues();
  }, [getSharesMulticall, positions, selectedPositions]);

  const totalWithdrawAmounts = useMemo(() => {
    let total = {
      amount0: 0,
      amount1: 0,
    };

    if (withdrawTxQueue.size > 0) {
      Array.from(withdrawTxQueue).map(([_, { amount0, amount1 }]) => {
        total.amount0 += amount0;
        total.amount1 += amount1;
      });
    }

    return total;
  }, [withdrawTxQueue]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 7,
  });

  const sortedPositions = useMemo(() => {
    return positions.sort((a, b) => a.range.lower - b.range.upper);
  }, [positions]);

  const table = useReactTable({
    data: sortedPositions,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setSelectedPositions,
    onPaginationChange: setPagination,
    state: {
      rowSelection: selectedPositions,
      pagination,
    },
    getRowId: (row) => String(row.withdraw.tokenId),
    autoResetPageIndex: false,
  });

  const transactions = useMemo(
    () => [
      {
        enabled: withdrawTxQueue.size > 0,
        description: 'Withdrawing deposited liquidity',
        txParams: [
          {
            abi: DopexV2PositionManager,
            functionName: 'multicall',
            address:
              POSITION_MANAGER_ADDRESSES_BY_CHAIN_ID[chainId as keyof typeof POSITION_MANAGER_ADDRESSES_BY_CHAIN_ID],
            args: [Array.from(withdrawTxQueue).map(([_, { tx }]) => tx)],
          },
        ],
      },
    ],
    [chainId, withdrawTxQueue],
  ) as Transaction[];

  const error = useMemo(
    () => (chainId !== userChainId ? `Switch network to ${chainName}` : null),
    [chainId, chainName, userChainId],
  );

  return (
    <Dialog
      onOpenChange={() => {
        clearTxQueue();
        setSelectedPositions({});
      }}>
      <DialogTrigger asChild>
        <Button size={'sm'} variant={'secondary'}>
          Manage
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[80vh] max-w-[1200px] flex-col space-y-[0px]">
        <Typography className="mb-1 px-1">Manage Positons</Typography>
        <Table containerClassName="min-w-full shadow flex-grow overflow-y-auto" className={'min-w-full bg-secondary'}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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

          <TableBody>
            {table.getRowModel().rows.map((row) => {
              return (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {typeof cell.column.columnDef.cell === 'function'
                        ? cell.column.columnDef.cell(cell.getContext())
                        : cell.getValue()}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
          <div className="flex items-center justify-center space-x-2 bg-secondary p-md">
            <Button
              variant={'secondary'}
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button variant={'secondary'} size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </Table>

        <div className="mt-[1px] flex items-center justify-between bg-secondary p-md">
          <div className="flex space-x-sm">
            <Typography variant="small-medium">Total Withdraw:</Typography>
            <div className="flex flex-col">
              <Typography variant="small-medium">
                <NumberDisplay value={totalWithdrawAmounts.amount0} format="tokenAmount" precision={5} />{' '}
                {symbols.symbol0}
              </Typography>
              <Typography variant="small-medium">
                <NumberDisplay value={totalWithdrawAmounts.amount1} format="tokenAmount" precision={5} />{' '}
                {symbols.symbol1}
              </Typography>
            </div>
          </div>
          <TransactionModalUncontrolled
            onClose={(complete) => {
              refetchSidePanelTokenBalances();
              if (complete) {
                clearTxQueue();
                setSelectedPositions({});
                refetch();
              }
            }}
            successMsg="Withdraw successful"
            disabled={Boolean(error) || !withdrawTxQueue.size}
            transactions={transactions}>
            <Button>{error || 'Withdraw'}</Button>
          </TransactionModalUncontrolled>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(ManageDialog);
