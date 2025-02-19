import { useMemo } from 'react';
import {
  Address,
  encodeAbiParameters,
  encodeFunctionData,
  erc20Abi,
  formatUnits,
  Hex,
  hexToBigInt,
  zeroAddress,
  zeroHash,
} from 'viem';
import { useAccount } from 'wagmi';

import { getLiquidityForAmount0, getLiquidityForAmount1 } from '@/utils/math/liquidityAmountMath';
import { getSqrtRatioAtTick } from '@/utils/math/tickMath';

import { Button } from '@/components/ui/button';
import NumberDisplay from '@/components/ui/number-display';
import { Typography } from '@/components/ui/typography';
import TransactionModalUncontrolled, { Transaction } from '@/app/[locale]/components/transaction-modal-uncontrolled';

import useStrikesStore, { TradingDetailTabs } from '../../../../hooks/store/useStrikesStore';
import useTokenBalancesStore from '../../../../hooks/store/useTokenBalancesStore';
import useTokenBalances from '../../../../hooks/useTokenBalances';
import { useLpStore } from '../hooks/store/useLpStore';

import clammRouterAbi from '@/abi/clammRouterAbi';

import {
  AMM_TO_HANDLER,
  CLAMM_ROUTER_ADDRESS_BY_CHAIN_ID,
  CLAMM_ROUTER_FRONTEND_ID,
  HANDLER_TO_POOLS,
  HOOKS_BY_CHAIN_ID,
} from '@/consts/clamm';

const InfoDeposit = () => {
  const { selectedMarket, markPrice, setSelectedStrikes, refetchStrikesData, setActiveTradingDetailTab } =
    useStrikesStore();
  const { pair, chainId, chainName, pairLabel } = selectedMarket;
  const { address: userAddress = zeroAddress, chainId: userChainId } = useAccount();

  const { refetchTokenBalances: refetchSidePanelTokenBalances } = useTokenBalancesStore();

  const clammRouterAddress = CLAMM_ROUTER_ADDRESS_BY_CHAIN_ID[chainId as keyof typeof CLAMM_ROUTER_ADDRESS_BY_CHAIN_ID];

  const { tokenBalances, allowances, refetchAllowances } = useTokenBalances({
    allowanceContract: clammRouterAddress,
  });
  const { inputValues, resetInputValues, selectedAMM, ttl } = useLpStore();

  const hookAddress = HOOKS_BY_CHAIN_ID[chainId as keyof typeof HOOKS_BY_CHAIN_ID][ttl][0];

  const handlerAddress = AMM_TO_HANDLER[chainId]?.[selectedAMM];
  const handlerPoolAddress = HANDLER_TO_POOLS[chainId]?.[selectedAMM]?.[pairLabel];

  const callToken = pair?.[0];
  const putToken = pair?.[1];

  const totalCostTokens = useMemo(() => {
    const _totalCostTokens = { call: BigInt(0), put: BigInt(0) };
    inputValues?.forEach(({ amount }, strikePrice) => {
      const isCall = strikePrice >= markPrice;
      _totalCostTokens[isCall ? 'call' : 'put'] += amount;
    });

    return _totalCostTokens;
  }, [inputValues, markPrice]);

  // console.log({ inputValues, totalCostTokens, needCallApprove: allowances.callToken < totalCostTokens.call });

  const depositTxs = useMemo(() => {
    const depositTxs: Hex[] = [];

    inputValues?.forEach(({ token, amount, tickLower, tickUpper }) => {
      if (amount === BigInt(0) || !handlerAddress || !handlerPoolAddress) return;

      const { address } = token;
      const tokenZero =
        hexToBigInt(callToken.address as Address) < hexToBigInt(putToken.address as Address)
          ? callToken.address
          : putToken.address;

      const getLiquidityFn =
        hexToBigInt(address as Address) === hexToBigInt(tokenZero as Address)
          ? getLiquidityForAmount0
          : getLiquidityForAmount1;

      const liquidity = getLiquidityFn(
        getSqrtRatioAtTick(BigInt(tickLower)),
        getSqrtRatioAtTick(BigInt(tickUpper)),
        amount,
      );

      if (liquidity > BigInt(0)) {
        depositTxs.push(
          encodeFunctionData({
            abi: clammRouterAbi,
            functionName: 'mintPosition',
            args: [
              handlerAddress,
              encodeAbiParameters(
                [{ type: 'address' }, { type: 'address' }, { type: 'int24' }, { type: 'int24' }, { type: 'uint128' }],
                [handlerPoolAddress, hookAddress, tickLower, tickUpper, liquidity],
              ),
              userAddress,
              CLAMM_ROUTER_FRONTEND_ID,
              zeroHash,
            ],
          }),
        );
      }
    });

    return depositTxs;
  }, [inputValues, handlerPoolAddress, callToken.address, putToken.address, handlerAddress, hookAddress, userAddress]);

  const error = useMemo(
    () =>
      !userAddress
        ? 'Connect wallet to trade'
        : chainId != userChainId
          ? `Switch network to ${chainName}`
          : inputValues?.size === 0
            ? 'Enter amounts'
            : totalCostTokens.call === BigInt(0) && totalCostTokens.put === BigInt(0)
              ? 'Enter amounts for selected strikes'
              : tokenBalances && tokenBalances.callToken < totalCostTokens.call
                ? `Insufficient ${tokenBalances.callTokenSymbol}`
                : tokenBalances && tokenBalances.putToken < totalCostTokens.put
                  ? `Insufficient ${tokenBalances.putTokenSymbol}`
                  : depositTxs.length === 0
                    ? 'multicall data is empty'
                    : null,
    [
      chainId,
      chainName,
      depositTxs.length,
      inputValues?.size,
      tokenBalances,
      totalCostTokens.call,
      totalCostTokens.put,
      userAddress,
      userChainId,
    ],
  );

  const transactions = useMemo(
    () => [
      {
        enabled: allowances.callToken < (totalCostTokens.call * BigInt(1001)) / BigInt(1000),
        description: 'Approve Call Token',
        txParams: [
          {
            abi: erc20Abi,
            address: pair[0].address,
            functionName: 'approve',
            args: [clammRouterAddress, (totalCostTokens.call * BigInt(1001)) / BigInt(1000)],
          },
        ],
      },
      {
        enabled: allowances.putToken < (totalCostTokens.put * BigInt(1001)) / BigInt(1000),
        description: 'Approve Put Token',
        txParams: [
          {
            abi: erc20Abi,
            address: pair[1].address,
            functionName: 'approve',
            args: [clammRouterAddress, (totalCostTokens.put * BigInt(1001)) / BigInt(1000)],
          },
        ],
      },
      {
        enabled: depositTxs.length > 0,
        description: 'Depositing Liquidity (multi-call)',
        txParams: [
          {
            abi: clammRouterAbi,
            address: clammRouterAddress,
            functionName: 'multicall',
            args: [depositTxs],
          },
        ],
      },
    ],
    [
      allowances.callToken,
      allowances.putToken,
      clammRouterAddress,
      depositTxs,
      pair,
      totalCostTokens.call,
      totalCostTokens.put,
    ],
  ) as Transaction[];

  return (
    <div className="flex flex-col space-y-md bg-secondary p-md">
      <div className="flex justify-between">
        <Typography className="text-muted-foreground" variant="small-medium">
          Total amounts
        </Typography>
        <div>
          <div className="flex items-center justify-center space-x-1 text-sm">
            <Typography variant="small-medium">
              <NumberDisplay
                value={Number(formatUnits(totalCostTokens.call, callToken.decimals))}
                precision={4}
                format="tokenAmount"
              />
              {` ${callToken.symbol}`}
            </Typography>
            <Typography variant="small-medium">
              <NumberDisplay
                value={Number(formatUnits(totalCostTokens.put, putToken.decimals))}
                precision={4}
                format="tokenAmount"
              />
              {` ${putToken.symbol}`}
            </Typography>
          </div>
        </div>
      </div>

      <TransactionModalUncontrolled
        onClose={(isSuccess) => {
          refetchSidePanelTokenBalances();
          refetchAllowances();
          resetInputValues();
          setSelectedStrikes([]);
          refetchStrikesData();
          if (isSuccess) setActiveTradingDetailTab(TradingDetailTabs.LPPositions);
        }}
        successMsg="LP successful"
        disabled={Boolean(error)}
        transactions={transactions}>
        <Button variant={'accent'}>
          <Typography variant="small-medium">{error || 'Deposit'} </Typography>
        </Button>
      </TransactionModalUncontrolled>
    </div>
  );
};

export default InfoDeposit;
