import { Hex } from 'viem';
import { create } from 'zustand';

import { RowData } from '../../types';

interface GaugeControllerState {
  epoch: {
    epoch: bigint;
    epochEnd: bigint;
    epochLength: bigint;
  };
  selectedRow: RowData | null;
  gaugesArray: RowData[] | null;
  voteAmount: bigint;
  voteTransaction: any | null;
  totalXsyk: bigint;
  XsykBalance: bigint;
  accountPowerUsedPerEpoch: bigint;
  totalPowerUsedPerEpoch: bigint;
  setEpoch: (epoch: GaugeControllerState['epoch']) => void;
  updateSelectedRow: (newRow: RowData | null | ((prevRow: RowData | null) => RowData | null)) => void;
  setGaugesArray: (gaugesArray: RowData[] | null) => void;
  setVoteAmount: (voteAmount: bigint) => void;
  setVoteTransaction: (voteTransaction: any | null) => void;
  setTotalXsyk: (totalXsyk: bigint) => void;
  setXsykBalance: (XsykBalance: bigint) => void;
  setAccountPowerUsedPerEpoch: (accountPowerUsedPerEpoch: bigint) => void;
  setTotalPowerUsedPerEpoch: (totalPowerUsedPerEpoch: bigint) => void;
}

const useGaugeControllerStore = create<GaugeControllerState>((set) => ({
  epoch: {
    epoch: BigInt(0),
    epochEnd: BigInt(0),
    epochLength: BigInt(0),
  },
  selectedRow: null,
  gaugesArray: null,
  voteAmount: 0n,
  voteTransaction: null,
  totalXsyk: BigInt(0),
  XsykBalance: BigInt(0),
  accountPowerUsedPerEpoch: BigInt(0),
  totalPowerUsedPerEpoch: BigInt(0),
  setEpoch: (epoch) => set({ epoch }),
  updateSelectedRow: (newRow) =>
    set((state) => ({
      selectedRow: typeof newRow === 'function' ? newRow(state.selectedRow) : newRow,
    })),
  setGaugesArray: (gaugesArray) => set({ gaugesArray }),
  setVoteAmount: (voteAmount) => set({ voteAmount }),
  setVoteTransaction: (voteTransaction) => set({ voteTransaction }),
  setTotalXsyk: (totalXsyk) => set({ totalXsyk }),
  setXsykBalance: (XsykBalance) => set({ XsykBalance }),
  setAccountPowerUsedPerEpoch: (accountPowerUsedPerEpoch) => set({ accountPowerUsedPerEpoch }),
  setTotalPowerUsedPerEpoch: (totalPowerUsedPerEpoch) => set({ totalPowerUsedPerEpoch }),
}));

export default useGaugeControllerStore;
