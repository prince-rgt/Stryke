import { format } from 'date-fns';

export const formatDate = (date: Date | null) => {
  if (!date) return '-';
  return format(date, 'MMM d, yyyy');
};
export const formatAddress = (address: string) => {
  if (!address) return '0x000...000';
  return `${address.substring(0, 5)}...${address.substring(address.length - 3)}`;
};
