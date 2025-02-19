import { z } from 'zod';

// TODO: add corr dto to be and remove usage of these
export const PriceAndTickSchema = z.object({
  markPrice: z.number(),
  tick: z.number(),
  markPriceUsd: z.number(),
  quoteAssetPriceUsd: z.number(),
});
export const PriceAndTickResponseSchema = z.promise(PriceAndTickSchema);

export const PriceCandleSchema = z.object({
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  time: z.number(),
});

export const PriceCandles = z.array(PriceCandleSchema);

export const PriceCandleResponseSchema = z.promise(PriceCandles);
