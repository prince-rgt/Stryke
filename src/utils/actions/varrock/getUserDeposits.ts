import axios from 'axios';

const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/74138/strykevault_subgraph/version/latest';

interface Deposit {
  id: string;
  epoch: string;
  vaultAddress: string;
  totalAssets?: string;
  user: string;
}

interface SubgraphResponse {
  data: {
    deposits: Deposit[];
  };
}

export async function getUserDeposits(vaultAddress: string, userAddress: string): Promise<Deposit[]> {
  const queryString = `
  {
    userEpochDeposits(where: { vaultAddress: "${vaultAddress}", userAddress: "${userAddress.toLowerCase()}" }) {
      id
      vaultAddress
      totalAssets
      epoch
      user
    }
  }
  `;

  try {
    const response = await axios.post<SubgraphResponse>(
      SUBGRAPH_URL,
      { query: queryString },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    console.log(response, 'response');

    if (response.data && response.data.data && response.data.data.userEpochDeposits) {
      return response.data.data.userEpochDeposits;
    }

    return [];
  } catch (error) {
    console.error('Failed to fetch user deposits:', error);
    return [];
  }
}
