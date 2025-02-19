import { ResolutionString } from '@/../../public/charting_library/charting_library';

export const RESOLUTION_TO_VARROCK_INTERVAL: { [key: ResolutionString]: [string, number] } = {
  ['5' as ResolutionString]: ['5m', 60 * 5],
  ['15' as ResolutionString]: ['15m', 60 * 15],
  ['60' as ResolutionString]: ['1h', 60 * 60],
  ['240' as ResolutionString]: ['4h', 4 * 60 * 60],
};

export const TV_CHART_RELOAD_INTERVAL = 15 * 60;

export const TV_CHART_RELOAD_TIMESTAMP_KEY = 'tv-reload-cache-key';
