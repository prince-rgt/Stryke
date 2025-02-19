import { useCallback, useEffect, useMemo, useState } from 'react';
import { useToggle } from 'react-use';
import { encodeAbiParameters, formatUnits, getAddress, Hash, Hex, parseUnits, zeroAddress } from 'viem';
import { useAccount, usePublicClient, useReadContract, useSignTypedData, useWriteContract } from 'wagmi';

import { Transaction, TransactionActionParams } from '@/app/[locale]/components/transaction-modal';

import { BuyPositionType } from '../hooks/useBuyPositionsData';
import useStrikesStore from '@/app/[locale]/trade/[[...market]]/hooks/store/useStrikesStore';

import DopexV2OptionMarket from '@/abi/DopexV2OptionMarket';
import { LimitOrdersAbi } from '@/abi/LimitOrdersAbi';

import {
  LIMIT_EXERCICSE_MARKET_ONLY_FLAG,
  LIMIT_EXERCISE_MARKET_ONLY_FLAG_HEX,
  LIMIT_ORDERS_CONTRACT_BY_CHAIN_ID,
  LIMIT_ORDERS_CONTRACT_NAME,
  LIMIT_ORDERS_CONTRACT_VERSION,
} from '@/consts/clamm';
import { VARROCK_BASE_API_URL } from '@/consts/env';

enum SUCCESS_MESSAGE {
  SET = 'Target set successfully',
  REMOVE = 'Target removed successfully',
}

const LimitOrderType = {
  Order: [
    { name: 'createdAt', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
    { name: 'maker', type: 'address' },
    { name: 'validator', type: 'address' },
    { name: 'flags', type: 'uint32' },
    { name: 'data', type: 'bytes' },
  ],
} as const;

const useLimitExercise = ({ positionData }: { positionData: BuyPositionType }) => {
  const {
    strike,
    type,
    optionsAmount,
    meta: { tokenId, expiry },
    sellOrder,
  } = positionData;

  const { selectedMarket } = useStrikesStore();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync, isPending } = useWriteContract({});
  const { signTypedDataAsync } = useSignTypedData();
  const { address: optionMarketAddress, chainId, pair } = selectedMarket;
  const [mode, setMode] = useState<'create' | 'remove'>('create');
  const [targetPrice, setTargetPrice] = useState('');
  const [transactionModalOpen, toggleTransactionModal] = useToggle(false);

  const callToken = pair[0];
  const putToken = pair[1];

  const profitToken = type.toLowerCase() === 'put' ? callToken : putToken;

  const limitOrdersContractAddress = useMemo(() => {
    return LIMIT_ORDERS_CONTRACT_BY_CHAIN_ID[chainId as keyof typeof LIMIT_ORDERS_CONTRACT_BY_CHAIN_ID];
  }, [chainId]);

  const {
    data: isDelegatorApproved,
    refetch,
    isSuccess,
  } = useReadContract({
    abi: DopexV2OptionMarket,
    functionName: 'exerciseDelegator',
    address: optionMarketAddress,
    chainId,
    args: [address || zeroAddress, limitOrdersContractAddress],
  });

  const minProfitExistingOrder = isDelegatorApproved ? (sellOrder ? sellOrder.payment : null) : null;

  const minProfit = useMemo(() => {
    if (!targetPrice) return 0n;

    const targetPriceNumber = Math.max(0, parseFloat(targetPrice));

    if (isNaN(targetPriceNumber) || targetPriceNumber <= 0) return 0n;

    const isCall = type.toLowerCase() === 'call';
    let profit = 0;

    if (isCall) {
      profit = Math.max(0, (targetPriceNumber - strike) * optionsAmount);
    } else {
      profit = Math.max(0, ((strike - targetPriceNumber) * optionsAmount) / targetPriceNumber);
    }

    return parseUnits(profit.toFixed(profitToken.decimals), profitToken.decimals);
  }, [targetPrice, type, profitToken.decimals, optionsAmount, strike]);

  const convertMinProfitToTargetPrice = useCallback(
    (minProfit: string): string => {
      const minProfitBigInt = BigInt(minProfit);
      const minProfitNumber = Number(formatUnits(minProfitBigInt, profitToken.decimals));

      if (type.toLowerCase() === 'call') {
        const targetPrice = strike + minProfitNumber / optionsAmount;
        return targetPrice.toFixed(profitToken.decimals);
      } else {
        const targetPrice = (strike * optionsAmount) / (minProfitNumber + optionsAmount);
        return Math.max(0, targetPrice).toFixed(profitToken.decimals);
      }
    },
    [profitToken.decimals, type, strike, optionsAmount],
  );

  const prevTargetPrice = minProfitExistingOrder ? convertMinProfitToTargetPrice(minProfitExistingOrder) : null;

  useEffect(() => {
    if (sellOrder && sellOrder.payment) {
      const calculatedTargetPrice = convertMinProfitToTargetPrice(sellOrder.payment);
      setTargetPrice(calculatedTargetPrice);
    }
  }, [convertMinProfitToTargetPrice, sellOrder]);

  const handleEnableLimitExercise = useCallback(
    async (onSuccessFn?: () => void, onError?: (err: any) => void) => {
      const hash = await writeContractAsync(
        {
          abi: DopexV2OptionMarket,
          functionName: 'updateExerciseDelegate',
          address: optionMarketAddress,
          args: [limitOrdersContractAddress, true],
        },
        {
          onError: (err) => {
            onError?.(err);
          },
        },
      );

      publicClient
        ?.waitForTransactionReceipt({ confirmations: 2, hash })
        .then((res) => {
          onSuccessFn?.();
        })
        .catch((err) => {
          onError?.(err);
        });
    },
    [optionMarketAddress, publicClient, writeContractAsync, limitOrdersContractAddress],
  );

  const handleCreateLimitExerciseOrder = useCallback(
    async (onSuccessFn?: () => void, onError?: (err: any) => void) => {
      const latestBlock = await publicClient!.getBlock();
      const createdAt = BigInt(latestBlock.timestamp);
      try {
        const data = encodeAbiParameters(
          [
            {
              type: 'uint256',
            },
            {
              type: 'uint256',
            },
            {
              type: 'address',
            },
          ],
          [minProfit, BigInt(tokenId), optionMarketAddress],
        );

        const message = {
          createdAt,
          deadline: BigInt(expiry),
          maker: address!,
          validator: zeroAddress,
          flags: LIMIT_EXERCICSE_MARKET_ONLY_FLAG,
          data,
        } as const;

        const signatureHex = await signTypedDataAsync({
          types: LimitOrderType,
          primaryType: 'Order',
          account: address!,
          domain: {
            name: LIMIT_ORDERS_CONTRACT_NAME,
            version: LIMIT_ORDERS_CONTRACT_VERSION,
            chainId,
            verifyingContract: limitOrdersContractAddress,
          },
          message,
        });

        const bodyParams = {
          chainId,
          createdAt: createdAt.toString(),
          deadline: expiry.toString(),
          maker: address!,
          validator: zeroAddress,
          flags: LIMIT_EXERCISE_MARKET_ONLY_FLAG_HEX,
          data: message.data,
          signature: signatureHex,
        };

        const response = await fetch(`${VARROCK_BASE_API_URL}/clamm/orders/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyParams),
        });

        if (!response.ok) {
          throw new Error('Failed to create limit exercise order');
        }
        onSuccessFn?.();
      } catch (err) {
        console.error('Error creating limit exercise order:', err);
        onError?.(err);
      }
    },

    [
      limitOrdersContractAddress,
      publicClient,
      signTypedDataAsync,
      address,
      chainId,
      tokenId,
      minProfit,
      expiry,
      optionMarketAddress,
    ],
  );

  const handleRemoveLimitExerciseOrder = useCallback(
    async (onSuccessFn?: () => void, onError?: (err: any) => void) => {
      if (!sellOrder) {
        onError?.('No limit order found');
        return;
      }
      const { data, deadline, flags, validator, v, r, s, createdAt } = sellOrder;

      if (!publicClient) return;

      const hash = await writeContractAsync(
        {
          abi: LimitOrdersAbi,
          functionName: 'cancel',
          address: limitOrdersContractAddress,
          args: [
            {
              createdAt: BigInt(createdAt),
              deadline: BigInt(deadline),
              maker: address!,
              validator: getAddress(validator),
              flags: Number(flags),
              data: data as Hex,
            },
            { r: r as Hash, s: s as Hash, v },
          ],
        },
        {
          onError: (err) => {
            onError?.(err);
          },
        },
      );

      publicClient
        ?.waitForTransactionReceipt({ confirmations: 5, hash })
        .then(async () => {
          const bodyParams = {
            chainId,
            tokenId,
            optionMarket: optionMarketAddress,
          };

          const response = await fetch(`${VARROCK_BASE_API_URL}/clamm/orders/delete`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyParams),
          });

          if (!response.ok) {
            throw new Error('Failed to create limit exercise order');
          }
        })
        .catch((err) => {
          onError?.(err);
        })
        .then(() => onSuccessFn?.());
    },

    [
      sellOrder,
      publicClient,
      writeContractAsync,
      address,
      limitOrdersContractAddress,
      chainId,
      optionMarketAddress,
      tokenId,
    ],
  );

  const createTransactions = useMemo(
    () => [
      ...(!isDelegatorApproved
        ? [
            {
              description: 'Enable Limit Exercise',
              onAction: ({ onSuccessFn, onError }: TransactionActionParams) =>
                handleEnableLimitExercise(onSuccessFn, onError),
            },
          ]
        : []),
      ...(minProfit > 0n
        ? [
            {
              description: 'Set Price Target',
              onAction: ({ onSuccessFn, onError }: TransactionActionParams) =>
                handleCreateLimitExerciseOrder(onSuccessFn, onError),
            },
          ]
        : []),
    ],
    [isDelegatorApproved, minProfit, handleEnableLimitExercise, handleCreateLimitExerciseOrder],
  ) as Transaction[];

  const cancelTransactions = useMemo(
    () => [
      ...(!!sellOrder
        ? [
            {
              description: 'Remove Price Target',
              onAction: ({ onSuccessFn, onError }: TransactionActionParams) =>
                handleRemoveLimitExerciseOrder(onSuccessFn, onError),
            },
          ]
        : []),
    ],
    [handleRemoveLimitExerciseOrder, sellOrder],
  ) as Transaction[];

  const handleCreateClick = useCallback(() => {
    setMode('create');
    toggleTransactionModal();
  }, [toggleTransactionModal]);

  const handleCancelClick = useCallback(() => {
    setMode('remove');
    toggleTransactionModal();
  }, [toggleTransactionModal]);

  return {
    minProfit,
    handleEnableLimitExercise,
    transactions: mode === 'create' ? createTransactions : cancelTransactions,
    isPending,
    isDelegatorApproved,
    toggleTransactionModal,
    transactionModalOpen,
    successMessage: mode === 'create' ? SUCCESS_MESSAGE.SET : SUCCESS_MESSAGE.REMOVE,
    targetPrice,
    setTargetPrice,
    prevTargetPrice,
    handleCancelClick,
    handleCreateClick,
    refetchDelegate: refetch,
  };
};

export default useLimitExercise;
