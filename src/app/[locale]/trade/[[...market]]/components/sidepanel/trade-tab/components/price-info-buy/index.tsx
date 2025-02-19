import { useMemo } from 'react';
import {
  Address,
  encodeFunctionData,
  erc20Abi,
  formatUnits,
  Hex,
  hexToBigInt,
  parseUnits,
  zeroAddress,
  zeroHash,
} from 'viem';
import { useAccount, useReadContract } from 'wagmi';

import logPurchase from '@/utils/actions/varrock/log-purchase';
import {
  getAmount0ForLiquidity,
  getAmount1ForLiquidity,
  getLiquidityForAmount0,
  getLiquidityForAmount1,
} from '@/utils/math/liquidityAmountMath';
import { getSqrtRatioAtTick } from '@/utils/math/tickMath';
import { findMinAmountForNonZeroLiquidity } from './utils';

import { Button } from '@/components/ui/button';
import NumberDisplay from '@/components/ui/number-display';
import { Typography } from '@/components/ui/typography';
import TransactionModalUncontrolled, { Transaction } from '@/app/[locale]/components/transaction-modal-uncontrolled';

import useStrikesStore, { TradingDetailTabs } from '../../../../../hooks/store/useStrikesStore';
import useTokenBalances from '../../../../../hooks/useTokenBalances';
import { ExpiryOption, TTL_TO_EXPIRY, useTradeStore } from '../../hooks/store/useTradeStore';
import useComputeIV from '../../hooks/useComputeIV';
import useTokenBalancesStore from '@/app/[locale]/trade/[[...market]]/hooks/store/useTokenBalancesStore';

import clammRouterAbi from '@/abi/clammRouterAbi';
import DopexV2OptionMarketV2 from '@/abi/DopexV2OptionMarketV2';

import { DEFAULT_CHAIN_ID } from '@/consts/chains';
import {
  AUTO_EXERCISER_TIME_BASED_BY_CHAIN_ID,
  CLAMM_ROUTER_ADDRESS_BY_CHAIN_ID,
  CLAMM_ROUTER_FE_ID_BY_BUILD_APP,
} from '@/consts/clamm';
import { BUILD_APP_NAME } from '@/consts/env';

const PriceInfoBuy = ({ selectedTTL }: { selectedTTL: number }) => {
  const {
    selectedMarket,
    markPrice,
    quoteAssetPriceUsd,
    strikes,
    setSelectedStrikes,
    refetchStrikesData,
    setActiveTradingDetailTab,
  } = useStrikesStore();
  const { optionsPricing, pair, chainId = DEFAULT_CHAIN_ID, chainName, address: optionMarketAddress } = selectedMarket;
  const { iv, isLoading: ivLoading } = useComputeIV({ optionsPricingAddress: optionsPricing, selectedTTL });
  const clammRouterAddress = CLAMM_ROUTER_ADDRESS_BY_CHAIN_ID[chainId as keyof typeof CLAMM_ROUTER_ADDRESS_BY_CHAIN_ID];

  const AUTO_EXERCISER_TIME_BASED_ADDRESS =
    AUTO_EXERCISER_TIME_BASED_BY_CHAIN_ID[chainId as keyof typeof AUTO_EXERCISER_TIME_BASED_BY_CHAIN_ID] ?? zeroAddress;

  const { refetchTokenBalances: refetchSidePanelTokenBalances } = useTokenBalancesStore();
  const { purchaseMetaByStrike, inputValues, resetInputValues, fetchingQuotes, errors, setTotalCostUsd } =
    useTradeStore();

  const { tokenBalances, allowances, refetchAllowances } = useTokenBalances({
    allowanceContract: clammRouterAddress,
  });

  const { address: userAddress = zeroAddress, chainId: userChainId } = useAccount();

  const { data: isDelegatorApproved = false } = useReadContract({
    abi: DopexV2OptionMarketV2,
    functionName: 'exerciseDelegator',
    address: optionMarketAddress,
    args: [userAddress || zeroAddress, AUTO_EXERCISER_TIME_BASED_ADDRESS],
  });

  const [totalProtocolFees, totalPremium, totalCostTokens, totalCostUSD] = useMemo(() => {
    const _totalProtocolFees = new Map<string, number>();
    const _totalPremium = new Map<string, number>();
    const _totalCostTokens = { call: BigInt(0), put: BigInt(0) };
    let _totalCostUSD = 0;

    purchaseMetaByStrike.forEach(({ token, fees, premium }, strike) => {
      const { symbol, decimals, address } = token;
      const currFees = _totalProtocolFees.get(symbol);
      const currPremium = _totalPremium.get(symbol);
      const feesAmountInNumber = Number(formatUnits(BigInt(fees), decimals));
      const premiumAmountInNumber = Number(formatUnits(BigInt(premium), decimals));

      const isCall = strike > markPrice;

      const cost = parseUnits(fees, 0) + parseUnits(premium, 0);
      _totalCostTokens[isCall ? 'call' : 'put'] += cost;

      const usdValue = isCall
        ? markPrice * (feesAmountInNumber + premiumAmountInNumber)
        : feesAmountInNumber + premiumAmountInNumber;
      _totalCostUSD += usdValue * quoteAssetPriceUsd;

      if (currFees) {
        _totalProtocolFees.set(symbol, currFees + feesAmountInNumber);
      } else {
        _totalProtocolFees.set(symbol, feesAmountInNumber);
      }

      if (currPremium) {
        _totalPremium.set(symbol, currPremium + premiumAmountInNumber);
      } else {
        _totalPremium.set(symbol, premiumAmountInNumber);
      }
      return [_totalProtocolFees, _totalPremium];
    });

    const totalCostUSDwithSlippage = _totalCostUSD * 1.05;
    setTotalCostUsd(totalCostUSDwithSlippage);

    return [_totalProtocolFees, _totalPremium, _totalCostTokens, totalCostUSDwithSlippage];
  }, [markPrice, purchaseMetaByStrike, quoteAssetPriceUsd, setTotalCostUsd]);

  const totalNotionalSize = useMemo(() => {
    let size = 0;
    inputValues?.forEach(({ amount, token }, strikePrice) => {
      const isPut = strikePrice < markPrice;

      size += isPut
        ? Number(formatUnits(amount, token.decimals)) / markPrice
        : Number(formatUnits(amount, token.decimals));
    });
    return size;
  }, [inputValues, markPrice]);

  const purchaseTxs = useMemo(() => {
    const purchaseTxs: Hex[] = [];

    inputValues?.forEach(({ token, amount }, strike) => {
      if (amount === BigInt(0)) return;
      const strikeData = strikes.find((strikeData) => strikeData.strikePrice === strike);
      const { address } = token;
      if (!strikeData) return;

      const purchaseMeta = purchaseMetaByStrike.get(strike);
      if (!purchaseMeta) return;
      const { premium, fees } = purchaseMeta;
      const cost = parseUnits(fees, 0) + parseUnits(premium, 0);

      const {
        tickLower,
        tickUpper,
        handlersLiquidityData: handlersLiquidityDataAll,
        handlersLiquidityDataWeekly,
        callToken,
        putToken,
      } = strikeData;

      const handlersLiquidityData = (
        TTL_TO_EXPIRY[selectedTTL] === ExpiryOption.OneWeek ? handlersLiquidityDataWeekly : handlersLiquidityDataAll
      ).filter(({ handler, pool }) => {
        // TODO: Remove this once filter/check is on varrock response itself
        if (
          handler.toLowerCase() === '0x9ae336b61d7d2e19a47607f163a3fb0e46306b7b' &&
          pool.toLowerCase() === '0xc6962004f452be9203591991d15f6b388e09e8d0'
        ) {
          return false;
        }
        return true;
      });

      const isCall = strike > markPrice;
      const tokenZero =
        hexToBigInt(callToken.address.toLowerCase() as Address) < hexToBigInt(putToken.address.toLowerCase() as Address)
          ? callToken.address
          : putToken.address;

      const getLiquidityForPremiumToken =
        hexToBigInt(address.toLowerCase() as Address) === hexToBigInt(tokenZero.toLowerCase() as Address)
          ? getLiquidityForAmount0
          : getLiquidityForAmount1;

      const getLiquidityForProfitToken =
        hexToBigInt(address.toLowerCase() as Address) === hexToBigInt(tokenZero.toLowerCase() as Address)
          ? getLiquidityForAmount1
          : getLiquidityForAmount0;

      const getPremiumTokenAmountFn =
        hexToBigInt(address.toLowerCase() as Address) === hexToBigInt(tokenZero.toLowerCase() as Address)
          ? getAmount0ForLiquidity
          : getAmount1ForLiquidity;

      const liquidityRequired =
        getLiquidityForPremiumToken(
          getSqrtRatioAtTick(BigInt(tickLower)),
          getSqrtRatioAtTick(BigInt(tickUpper)),
          amount,
        ) - BigInt(1);

      const { minAmountForNonZeroLiquidity } = findMinAmountForNonZeroLiquidity(
        tickLower,
        tickUpper,
        getPremiumTokenAmountFn,
      );

      // min liquidity such that corresponding premium is minAmountForNonZeroLiquidity
      const minLiqForNonZeroPremium = cost ? (minAmountForNonZeroLiquidity * liquidityRequired) / cost : BigInt(0);

      // min liquidity for non zero corresponding profit token
      const minLiqForNonZeroProfitToken = getLiquidityForProfitToken(
        getSqrtRatioAtTick(BigInt(tickLower)),
        getSqrtRatioAtTick(BigInt(tickUpper)),
        BigInt(2),
      );

      // use max of above two as min required liquidity
      const minLiqPerHandler =
        minLiqForNonZeroProfitToken > minLiqForNonZeroPremium ? minLiqForNonZeroProfitToken : minLiqForNonZeroPremium;

      // console.log({
      //   minLiqPerHandler,
      //   liquidityRequired,
      //   minAmountForNonZeroLiquidity,
      //   minLiqForNonZeroPremium,
      //   minLiqForNonZeroProfitToken,
      // });

      if (liquidityRequired < minLiqPerHandler) {
        return;
      }

      let indexOfHandlerWithEnough = -1;

      handlersLiquidityData.forEach(({ availableLiquidity }, index) => {
        if (availableLiquidity >= liquidityRequired) {
          indexOfHandlerWithEnough = index;
        }
      });

      let liquidityCumulative = BigInt(0);

      const optionTicks: {
        _handler: Address;
        pool: Address;
        hook: Address;
        tickLower: number;
        tickUpper: number;
        liquidityToUse: bigint;
      }[] = [];

      // console.log({ indexOfHandlerWithEnough, liquidityRequired, handlersLiquidityData });

      if (indexOfHandlerWithEnough !== -1) {
        // Use this handler entirely if it meets the full requirement
        const { handler, pool, hook } = handlersLiquidityData[indexOfHandlerWithEnough];
        optionTicks.push({
          _handler: handler,
          pool,
          hook: hook as Address,
          tickLower,
          tickUpper,
          liquidityToUse: liquidityRequired,
        });
      } else {
        // Distribute liquidity across handlers with at least the minimum liquidity per handler
        for (let i = 0; i < handlersLiquidityData.length; i++) {
          const { availableLiquidity: _availableLiquidity, pool, handler, hook } = handlersLiquidityData[i];
          const availableLiquidity = _availableLiquidity - BigInt(1);

          if (liquidityCumulative >= liquidityRequired) break; // Stop if requirement is met
          if (availableLiquidity < minLiqPerHandler) continue; // Skip handlers that cannot meet the minimum addition

          let liquidityToUse = liquidityRequired - liquidityCumulative;
          let contribution = availableLiquidity >= liquidityToUse ? liquidityToUse : availableLiquidity;

          // Ensure each handler contributes at least the minimum liquidity, or the rest of the requirement, whichever is smaller
          contribution = contribution > minLiqPerHandler ? contribution : minLiqPerHandler;

          // Adjust contribution if it's larger than what's needed or available
          if (contribution > availableLiquidity) {
            contribution = availableLiquidity;
          }

          optionTicks.push({
            _handler: handler,
            pool,
            hook: hook as Address,
            tickLower,
            tickUpper,
            liquidityToUse: contribution,
          });

          liquidityCumulative += contribution;
        }
      }

      if (optionTicks.length === 0) return;

      // console.log({
      //   minAmountForNonZeroLiquidity,
      //   minLiqPerHandler,
      //   cost,
      //   optionTicks,
      //   liquidityCumulative,
      //   liquidityRequired,
      // });

      purchaseTxs.push(
        encodeFunctionData({
          abi: clammRouterAbi,
          functionName: 'mintOption',
          args: [
            {
              optionTicks,
              tickLower,
              tickUpper,
              ttl: BigInt(selectedTTL),
              isCall,
              maxCostAllowance: (cost * BigInt(107)) / BigInt(100),
            },
            optionMarketAddress,
            userAddress,
            CLAMM_ROUTER_FE_ID_BY_BUILD_APP[BUILD_APP_NAME],
            zeroHash,
          ],
        }),
      );
    });

    return purchaseTxs;
  }, [inputValues, strikes, purchaseMetaByStrike, selectedTTL, markPrice, optionMarketAddress, userAddress]);

  const error = useMemo(
    () =>
      !userAddress
        ? 'Connect wallet to trade'
        : chainId != userChainId
          ? `Switch network to ${chainName}`
          : inputValues?.size === 0
            ? 'Select strikes'
            : totalCostTokens.call === BigInt(0) && totalCostTokens.put === BigInt(0)
              ? 'Entered amounts too less'
              : tokenBalances && tokenBalances.callToken < totalCostTokens.call
                ? `Insufficient ${tokenBalances.callTokenSymbol}`
                : tokenBalances && tokenBalances.putToken < totalCostTokens.put
                  ? `Insufficient ${tokenBalances.putTokenSymbol}`
                  : purchaseTxs.length === 0
                    ? 'options liquidity too low'
                    : null,
    [
      chainId,
      chainName,
      inputValues?.size,
      purchaseTxs.length,
      tokenBalances,
      totalCostTokens.call,
      totalCostTokens.put,
      userAddress,
      userChainId,
    ],
  );

  // order is important here
  const transactions = useMemo(
    () => [
      {
        enabled: allowances.callToken < (totalCostTokens.call * BigInt(107)) / BigInt(100),
        description: 'Approve Call Token',
        txParams: [
          {
            abi: erc20Abi,
            address: pair?.[0].address,
            functionName: 'approve',
            args: [clammRouterAddress, (totalCostTokens.call * BigInt(107)) / BigInt(100)],
          },
        ],
      },
      {
        enabled: allowances.putToken < (totalCostTokens.put * BigInt(107)) / BigInt(100),
        description: 'Approve Put Token',
        txParams: [
          {
            abi: erc20Abi,
            address: pair?.[1].address,
            functionName: 'approve',
            args: [clammRouterAddress, (totalCostTokens.put * BigInt(107)) / BigInt(100)],
          },
        ],
      },
      {
        enabled: purchaseTxs.length > 0,
        description: (
          <div className="flex flex-col space-y-md">
            <Typography variant="small-medium">Purchasing Options (multi-call).</Typography>
            {!isDelegatorApproved ? (
              <Typography variant="small-medium">
                Note: <span className="text-accent">Auto-Exercise is currently disabled</span> for this market. You must
                manually exercise your options before expiry.
              </Typography>
            ) : null}
          </div>
        ),
        txParams: [
          {
            abi: clammRouterAbi,
            address: clammRouterAddress,
            functionName: 'multicall',
            args: [purchaseTxs],
          },
          {
            onSuccess: (hash) => {
              const submit = logPurchase.bind(null, {
                chainId: chainId.toString(),
                ticker: selectedMarket.pairLabel,
                notional: totalNotionalSize.toString(),
                premium: Array.from(totalPremium)
                  .reduce(
                    (prev, [symbol, amount]) => (symbol === 'USDC' ? prev + amount / markPrice : prev + amount),
                    0,
                  )
                  .toString(),
                hash: hash as string,
                source: 'stryke-xyz',
              });
              submit();
            },
          },
        ],
      },
    ],
    [
      allowances.callToken,
      allowances.putToken,
      chainId,
      clammRouterAddress,
      markPrice,
      pair,
      purchaseTxs,
      selectedMarket.pairLabel,
      totalCostTokens.call,
      totalCostTokens.put,
      totalNotionalSize,
      totalPremium,
      isDelegatorApproved,
    ],
  ) as Transaction[];

  return (
    <div className="flex flex-col space-y-md bg-secondary p-md">
      <div className="flex justify-between">
        <Typography className="text-muted-foreground" variant="small-medium">
          IV
        </Typography>
        <Typography variant="small-medium">{ivLoading ? '...' : formatUnits(iv, 0)}</Typography>
      </div>
      <div className="flex justify-between">
        <Typography className="text-muted-foreground" variant="small-medium">
          Premium
        </Typography>
        <div>
          {totalPremium.size
            ? Array.from(totalPremium).map(([symbol, amount], index) => (
                <div key={index} className="flex items-center justify-center space-x-1 text-sm">
                  <Typography variant="small-medium">
                    <NumberDisplay value={amount * 1.05} precision={6} format="tokenAmount" />
                    {` ${symbol}`}
                  </Typography>
                </div>
              ))
            : '-'}
        </div>
      </div>

      <div className="flex justify-between">
        <Typography className="text-muted-foreground" variant="small-medium">
          Protocol Fees
        </Typography>
        <div>
          {totalProtocolFees.size
            ? Array.from(totalProtocolFees).map(([symbol, amount], index) => (
                <div key={index} className="flex items-center justify-center space-x-1 text-sm">
                  <Typography variant="small-medium">
                    <NumberDisplay value={amount * 1.05} precision={6} format="tokenAmount" />
                    {` ${symbol}`}
                  </Typography>
                </div>
              ))
            : '-'}
        </div>
      </div>
      <div className="flex justify-between">
        <Typography className="text-muted-foreground" variant="small-medium">
          Total Cost
        </Typography>
        <Typography variant="small-medium">
          <NumberDisplay precision={6} value={totalCostUSD} format="usd" />
        </Typography>
      </div>
      <div className="flex justify-between">
        <Typography className="text-muted-foreground" variant="small-medium">
          Total Size
        </Typography>
        <div className="space-x flex">
          <Typography variant="small-medium">
            {totalNotionalSize.toFixed(6)} {pair?.[0].symbol}
          </Typography>
        </div>
      </div>

      <TransactionModalUncontrolled
        onClose={(complete?: boolean) => {
          refetchAllowances();
          refetchSidePanelTokenBalances();
          if (complete) {
            resetInputValues();
            setSelectedStrikes([]);
            setActiveTradingDetailTab(TradingDetailTabs.BuyPositions);
          }
          refetchStrikesData();
        }}
        successMsg="Trade successful"
        disabled={
          Boolean(error) || Boolean(errors?.size) || fetchingQuotes || (!totalCostTokens.call && !totalCostTokens.put)
        }
        transactions={transactions}>
        <Button variant={'accent'}>
          <Typography variant="small-medium">{error || 'Purchase'} </Typography>
        </Button>
      </TransactionModalUncontrolled>
    </div>
  );
};

export default PriceInfoBuy;
