import { Address } from 'viem';

export const smartTrim = (address: Address) => {
  return address.slice(0, 4).concat('...').concat(address.slice(38, 42));
};
