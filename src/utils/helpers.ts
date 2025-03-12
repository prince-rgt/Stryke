import { format } from 'date-fns';

export const formatDate = (date: Date | null) => {
  if (!date) return '-';
  return format(date, 'MMM d, yyyy');
};
