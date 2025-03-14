'use client';

import { PurchaseQuote } from '@/types/varrock';

import { QuoteResponseDto } from '@stryke-xyz/shared-types';
import axios from 'axios';
import { z } from 'zod';

import { VARROCK_BASE_API_URL } from '@/consts/env';

import {
  PriceAndTickResponseSchema,
  PriceAndTickSchema,
  PriceCandleResponseSchema,
  PriceCandles,
} from '@/schemas/varrock';

export interface QuoteRequestDto {
  user?: `0x${string}`;
  strike: number;
  markPrice: number;
  type: string;
  amount: number;
  ttl: number;
  chainId: 8453 | 5000 | 42161 | 81457 | 80084 | 146 | 421614;
  optionMarket: `0x${string}`;
}

export async function getMarkPrice(
  chainId = 42161,
  ticker = 'WETH/USDC',
): Promise<z.infer<typeof PriceAndTickResponseSchema>> {
  if (!ticker) return { markPrice: 0, tick: 0, markPriceUsd: 0, quoteAssetPriceUsd: 0 };

  return await axios
    .get<z.infer<typeof PriceAndTickSchema>>(
      `${VARROCK_BASE_API_URL}/uniswap-prices/mark-price?chainId=${chainId}&ticker=${ticker}`,
    )
    .then((res) => ({
      markPrice: res.data.markPrice,
      tick: res.data.tick,
      markPriceUsd: res.data.markPriceUsd,
      quoteAssetPriceUsd: res.data.quoteAssetPriceUsd,
    }))
    .catch((_) => ({
      markPrice: 0,
      tick: 0,
      markPriceUsd: 0,
      quoteAssetPriceUsd: 0,
    }));
}

const getSecondsFromNow = (interval: string) => {
  const now = new Date();
  switch (interval) {
    case '5m':
      return Math.ceil(now.getTime() / 1000) - 5 * 60;
    case '15m':
      return Math.ceil(now.getTime() / 1000) - 15 * 60;
    case '1h':
      return Math.ceil(now.getTime() / 1000) - 60 * 60;
    case '4h':
      return Math.ceil(now.getTime() / 1000) - 4 * 60 * 60;

    // enable wen it gets added to subgraph
    // case '1d':
    //   return Math.ceil(now.getTime() / 1000) - 24 * 60 * 60;
    default:
      throw new Error(`Unsupported interval: ${interval}`);
  }
};

export async function getPriceCandles(
  chainId: number = 42161,
  ticker: string = 'WETH/USDC',
  interval: string = '4h',
  from?: number,
  to?: number,
): Promise<z.infer<typeof PriceCandleResponseSchema>> {
  from = from || getSecondsFromNow(interval);
  to = to || Math.ceil(new Date().getTime() / 1000);

  return await axios
    .get<z.infer<typeof PriceCandles>>(
      `${VARROCK_BASE_API_URL}/uniswap-prices/candles?chainId=${chainId}&interval=${interval}&ticker=${ticker}&from=${from}&to=${to}`,
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error);
      throw new Error('Failed to fetch candle prices.');
    });
}

export async function calculatePurchaseCost(params: QuoteRequestDto): Promise<QuoteResponseDto> {
  const { chainId, optionMarket, user, strike, markPrice, type, amount, ttl } = params;
  return await axios
    .get<PurchaseQuote>(
      `${VARROCK_BASE_API_URL}/clamm/purchase/quote?chainId=${chainId}&optionMarket=${optionMarket}&user=${user}&strike=${strike}&markPrice=${markPrice}&type=${type}&amount=${amount}&ttl=${ttl}`,
    )
    .then((res) => res.data);
}
