import { SupportedChainIdType } from '@/types';
import { PnlDelta } from '@/types/varrock';

import { useQuery } from '@tanstack/react-query';
import { Address, zeroAddress } from 'viem';

import { Data } from '@/components/charts/pnl-history-chart/area';

import { SUPPORTED_CHAIN_IDS } from '@/consts/chains';
import { VARROCK_BASE_API_URL } from '@/consts/env';

type Props = {
  chainIds?: SupportedChainIdType[];
  user?: Address;
  interval?: PnlDeltaIntervalsType;
};

export type PnlDeltaIntervalsType = '90D' | '30D' | '7D';

export enum PnlDeltaErrors {
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  FETCH_FAIL = 'FETCH_FAIL',
}

const ONE_DAY = 86400;

const intervalToTimeline = (interval: PnlDeltaIntervalsType) => {
  const currentTimestamp = Math.floor(new Date().getTime() / 1000);

  // 7 days default
  let timeline = {
    from: currentTimestamp - ONE_DAY * 7,
    to: currentTimestamp,
  };

  if (interval === '30D') {
    timeline.from = currentTimestamp - ONE_DAY * 30;
  }

  if (interval === '90D') {
    timeline.from = currentTimestamp - ONE_DAY * 90;
  }

  return timeline;
};

const QUERY_PATH = 'clamm/stats/delta';

const groupByHourlyChartData = (data: PnlDelta[]) => {
  if (data.length === 0) return [];

  data = data.sort((a, b) => a.timestamp - b.timestamp);

  const chartData: Data[] = [];
  const ONE_HOUR = 3600;

  const earliestTimestamp = data[0].timestamp;
  const latestTimestamp = data[data.length - 1].timestamp;
  const intervals = (latestTimestamp - earliestTimestamp) / ONE_HOUR;

  let deltaCummulative = 0;

  for (let i = 0; i < intervals; i++) {
    const start = earliestTimestamp + ONE_HOUR * i;
    const end = start + ONE_HOUR;
    const deltas = data.filter(({ timestamp }) => timestamp >= start && timestamp <= end);

    let totalDelta = deltas.reduce((prev, curr) => prev + curr.delta, 0);

    if (i !== 0 && totalDelta === 0) {
      totalDelta = chartData[i - 1].value;
    } else {
      deltaCummulative += totalDelta;
    }

    chartData.push({
      date: new Date(start * 1000).toISOString(),
      value: deltaCummulative,
    });
  }

  return chartData;
};

const frontFill = (data: PnlDelta[]) => {
  if (data.length === 0) return data;
  const currentTimestamp = Math.floor(new Date().getTime() / 1000);
  let latestTimestamp = data[data.length - 1].timestamp;
  const timegap = currentTimestamp - latestTimestamp;
  const fillsRequired = Math.floor(timegap / ONE_DAY);
  const lastDelta = data[data.length - 1].delta;
  if (timegap > 0 && fillsRequired > 1) {
    while (latestTimestamp < currentTimestamp) {
      latestTimestamp += ONE_DAY;
      data.push({
        delta: lastDelta,
        timestamp: latestTimestamp,
      });
    }
    return data.sort((a, b) => a.timestamp - b.timestamp);
  } else {
    return data;
  }
};

const backFill = (data: PnlDelta[], from: number) => {
  if (data.length === 0) return data;
  let earliestTimestamp = data[0].timestamp;
  const timegap = earliestTimestamp - from;
  const fillsRequired = Math.floor(timegap / ONE_DAY);
  if (timegap > 0 && fillsRequired > 1) {
    while (earliestTimestamp > from) {
      earliestTimestamp -= ONE_DAY;
      data.push({
        delta: 0,
        timestamp: earliestTimestamp,
      });
    }
    return data.sort((a, b) => a.timestamp - b.timestamp);
  } else {
    return data;
  }
};

const usePnlDelta = ({ user = zeroAddress, chainIds = [...SUPPORTED_CHAIN_IDS], interval = '7D' }: Props) => {
  const {
    data,
    isLoading,
    refetch,
    error: fetchError,
  } = useQuery<Data[]>({
    queryKey: ['pnl-delta', user, chainIds.toString(), interval],
    queryFn: async () => {
      if (user === zeroAddress) return [];
      const timeline = intervalToTimeline(interval);
      const url = new URL(`${VARROCK_BASE_API_URL}/${QUERY_PATH}`);
      url.searchParams.set('chains', chainIds.toString());
      url.searchParams.set('from', timeline.from.toString());
      url.searchParams.set('to', timeline.to.toString());
      url.searchParams.set('user', user);
      const response = await fetch(url)
        .then((res) => res.json() as Promise<PnlDelta[]>)
        .catch((err) => {
          console.error(err);
          return [];
        });

      const backFilled = backFill(response ?? [], timeline.from);
      const frontFilled = frontFill(backFilled ?? []);
      return groupByHourlyChartData(frontFilled);
    },
  });

  return {
    data: data ?? [],
    isLoading,
    refetch,
    error: user === zeroAddress ? PnlDeltaErrors.WALLET_NOT_CONNECTED : fetchError ? PnlDeltaErrors.FETCH_FAIL : null,
  };
};
export default usePnlDelta;
