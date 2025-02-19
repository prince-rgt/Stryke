import { addDays } from 'date-fns';
import { DateRange, SelectRangeEventHandler } from 'react-day-picker';
import { create } from 'zustand';

type Filter = {
  period: DateRange;
  setPeriod: SelectRangeEventHandler;
};

const useFilterStore = create<Filter>((set, _) => ({
  period: {
    from: addDays(new Date(), -7), // by default, show activity in the past week
    to: new Date(),
  },
  setPeriod: (period: DateRange | undefined) => set((prev) => ({ ...prev, period })),
}));

export default useFilterStore;
