import { create } from 'zustand';

import { TimeFrame } from '@/app/[locale]/leaderboard/consts';

interface TimeframeStore {
  timeframe: TimeFrame;
  setTimeframe: (timeframe: TimeFrame) => void;
}

// page depth must be 30
export const useTimeframeStore = create<TimeframeStore>((set) => ({
  timeframe: TimeFrame.OneDay,
  setTimeframe: (timeframe) => set({ timeframe }),
}));
