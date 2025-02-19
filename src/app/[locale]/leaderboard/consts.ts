export enum TimeFrame {
  OneDay = '1D',
  OneWeek = '1W',
  OneMonth = '1M',
  SixMonths = '6M',
}

export const LB_TIMEFRAMES: { [key in TimeFrame]: number } = {
  [TimeFrame.OneDay]: 86400,
  [TimeFrame.OneWeek]: 86400 * 7,
  [TimeFrame.OneMonth]: 86400 * 30,
  [TimeFrame.SixMonths]: 86400 * 30 * 6,
};
