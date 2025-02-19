import { z } from 'zod';

import { getMarkPrice, getPriceCandles } from '@/utils/actions/varrock/price';

import { PriceCandleSchema } from '@/schemas/varrock';

type Bar = z.infer<typeof PriceCandleSchema>;

export default class Datafeed {
  lastBar: Bar | null = null;
  bars: Bar[] = [];

  /**
   * @param chainId   the chain ID
   * @param ticker    the ticker / token pair to poll prices from
   * @param interval  the candlestick interval ('5m', '15m', '1h', '4h', '1d')
   * @param from      the lower limit unix timestamp of the historic price feed
   * @param to        the upper limit unix timestamp of the historic
   * @returns         array of candlesticks containing ```{ open, high, low, close, time }``` objects
   */
  public async getOHLC(chainId: number, ticker: string, interval: string, from: number, to: number) {
    this.bars = [];
    return await getPriceCandles(chainId, ticker, interval, from, to);
  }

  /**
   * @param chainId   the chain ID
   * @param ticker    the ticker / token pair to fetch the price from
   * @returns         the last price for the specified asset ticker in-terms-of quote asset
   */
  public async getLastPrice(chainId: number, ticker: string) {
    return getMarkPrice(chainId, ticker)
      .then(async (res) => (await res).markPriceUsd)
      .catch(() => {
        console.error('Failed to latest price for ', ticker);
        return this.lastBar?.close ?? 0;
      });
  }

  /**
   * @param bar   the last candlestick containing ```open, high, low, close```
   * @note        setter; this bar is to be frequently updated for a responsive chart
   */
  public setLastBar(bar: Bar) {
    this.lastBar = bar;
  }

  /**
   * @param bars   bars data containing array of ```{ open, high, low, close, time }``` object
   * @note         setter
   */
  public saveBars(bars: Bar[]) {
    this.bars = bars;
  }
}
