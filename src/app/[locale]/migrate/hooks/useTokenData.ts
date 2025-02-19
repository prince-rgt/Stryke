import { erc20Abi, zeroAddress } from 'viem';
import { useAccount, useReadContracts } from 'wagmi';

import { DPX_ADDRESS, MIGRATOR_ADDRESS, RDPX_ADDRESS, SYK_ADDRESS, XSYK_ADDRESS } from '../consts';

export default function useTokenData() {
  const { address: user = zeroAddress } = useAccount();

  const reads = useReadContracts({
    contracts: [
      { address: DPX_ADDRESS, abi: erc20Abi, functionName: 'balanceOf', args: [user] },
      { address: RDPX_ADDRESS, abi: erc20Abi, functionName: 'balanceOf', args: [user] },
      { address: SYK_ADDRESS, abi: erc20Abi, functionName: 'balanceOf', args: [user] },
      { address: DPX_ADDRESS, abi: erc20Abi, functionName: 'allowance', args: [user, MIGRATOR_ADDRESS] },
      { address: RDPX_ADDRESS, abi: erc20Abi, functionName: 'allowance', args: [user, MIGRATOR_ADDRESS] },
      { address: SYK_ADDRESS, abi: erc20Abi, functionName: 'allowance', args: [user, XSYK_ADDRESS] },
      { address: XSYK_ADDRESS, abi: erc20Abi, functionName: 'balanceOf', args: [user] },
    ],
  });

  if (reads.isSuccess) {
    return {
      balances: {
        dpx: reads.data[0].result!,
        rdpx: reads.data[1].result!,
        syk: reads.data[2].result!,
        xsyk: reads.data[6].result!,
      },
      allowances: {
        dpx: reads.data[3].result!,
        rdpx: reads.data[4].result!,
        syk: reads.data[5].result!,
      },
      refetch: reads.refetch,
    };
  } else {
    return {
      balances: {
        dpx: 0n,
        rdpx: 0n,
        syk: 0n,
        xsyk: 0n,
      },
      allowances: {
        dpx: 0n,
        rdpx: 0n,
        syk: 0n,
      },
      refetch: reads.refetch,
    };
  }
}
