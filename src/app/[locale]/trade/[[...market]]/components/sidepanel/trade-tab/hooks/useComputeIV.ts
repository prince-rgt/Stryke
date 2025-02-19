import { getAddress, zeroAddress } from 'viem';
import { useReadContract } from 'wagmi';

import { OptionPricingLinearV2 } from '@/abi/OptionPricingLinearV2';

const useComputeIV = ({
  optionsPricingAddress,
  selectedTTL,
}: {
  optionsPricingAddress: string;
  selectedTTL: number;
}) => {
  const {
    data: iv = BigInt('0'),
    refetch,
    isLoading,
    isError,
  } = useReadContract({
    abi: OptionPricingLinearV2,
    address: getAddress(optionsPricingAddress ?? zeroAddress),
    functionName: 'ttlToVol',
    args: [BigInt(selectedTTL)],
  });

  return { iv, refetch, isLoading, isError };
};

export default useComputeIV;
