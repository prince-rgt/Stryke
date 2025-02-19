import { Address, encodeFunctionData, Hex, PublicClient } from 'viem';

import { TENDERLY_ACCOUNT_SLUG, TENDERLY_PROJECT_SLUG } from '@/consts/env';

const bigIntSerializer = (key: string, value: any) => {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
};

interface SimulationParams {
  publicClient: PublicClient;
  userAddress?: Address;
  chainId?: number;
  txParams: {
    abi: any;
    address: Address;
    functionName: string;
    args?: any[];
  };
  value?: bigint;
}

const generateTenderlySimulationLink = async ({
  publicClient,
  txParams,
  value = 0n,
  userAddress,
  chainId,
}: SimulationParams): Promise<string> => {
  if (!TENDERLY_ACCOUNT_SLUG || !TENDERLY_PROJECT_SLUG) {
    throw new Error('Tenderly account slug or project slug is not defined in environment variables');
  }

  if (!chainId) {
    throw new Error('Chain is not defined');
  }

  if (!userAddress) {
    throw new Error('Account is not defined');
  }

  if (txParams.args === undefined) {
    throw new Error('Function arguments are not defined');
  }

  const [block, gasPrice] = await Promise.all([publicClient.getBlock(), publicClient.getGasPrice()]);

  const data = encodeFunctionData({
    abi: txParams.abi,
    functionName: txParams.functionName,
    args: txParams.args,
  });
  const encodedArgs = data.slice(10);

  // console.log('Data:', data, JSON.stringify([encodedArgs]));

  const simulationParams = new URLSearchParams({
    rawFunctionInput: '',
    block: block.number.toString(),
    blockIndex: '0',
    from: userAddress,
    gas: '8000000',
    gasPrice: gasPrice.toString(),
    value: value.toString(),
    contractAddress: txParams.address,
    contractFunction: data.slice(0, 10), // Function signature
    functionInputs: JSON.stringify([data]),
    network: chainId.toString(),
    headerBlockNumber: '',
    headerTimestamp: '',
  });

  const simulationUrl = `https://dashboard.tenderly.co/${TENDERLY_ACCOUNT_SLUG}/${TENDERLY_PROJECT_SLUG}/simulator/new?${simulationParams.toString()}`;

  return simulationUrl;
};

export { generateTenderlySimulationLink, bigIntSerializer };
