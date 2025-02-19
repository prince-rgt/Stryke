import { create } from 'zustand';

interface ManageStore {
  refetch: () => void;
  setRefetch: (refetch: () => void) => void;
}

const useManageStore = create<ManageStore>((set) => ({
  refetch: () => {},
  setRefetch: (refetch) => set({ refetch }),
}));

export default useManageStore;
