// fetchUserRecapData.ts

const GRAPHQL_ENDPOINT = 'https://ponder-play-production.up.railway.app';

// ------------------
// 1) Main function
// ------------------
export async function fetchAndAggregateUserRecapData(userId: string) {
  const startTimestamp = 1704067200; // Jan 1, 2024
  const endTimestamp = 1735689599; // Dec 31, 2024

  // 1. Fetch userCumulativeMetric (single row, no pagination needed)
  const userCumulativeMetric = await fetchUserCumulativeMetric(userId);

  // 2. Fetch all mint logs
  const allMintLogs = await fetchAllMintLogs(userId, startTimestamp, endTimestamp);

  // 3. Fetch all exercise logs
  const allExerciseLogs = await fetchAllExerciseLogs(userId, startTimestamp, endTimestamp);

  // 4. (Optional) Fetch all settle logs if you need them
  const allSettleLogs = await fetchAllSettleLogs(userId, startTimestamp, endTimestamp);

  // 5. Aggregate results
  const data = {
    userCumulativeMetric,
    optionMintLogs: { items: allMintLogs },
    optionExerciseLogs: { items: allExerciseLogs },
    optionSettleLogs: { items: allSettleLogs },
  };

  return aggregateUserYearRecap(data);
}

// -----------------------------
// 2) Helper: Fetch user metric
// -----------------------------
async function fetchUserCumulativeMetric(userId: string) {
  const query = `
    query ($userId: String!) {
      userCumulativeMetric(userId: $userId) {
        userId
        cumulativeVolume
        cumulativePremium
        cumulativePnl
        totalOptionsBought
        totalOptionsExercised
      }
    }
  `;
  const res = await callGraphQL(query, { userId });
  // Return the single object (or null if not found)
  return res.userCumulativeMetric ?? {};
}

// ------------------------------------------
// 3) Helpers to fetch logs with pagination
// ------------------------------------------
async function fetchAllMintLogs(userId: string, startTimestamp: number, endTimestamp: number) {
  let items: any[] = [];
  let hasNextPage = true;
  let afterCursor: string | null = null;

  while (hasNextPage) {
    const query = `
    query fetchMintLogs(
      $userId: String!
      $startTimestamp: Int!
      $endTimestamp: Int!
      $after: String
    ) {
      optionMintLogs(
        limit: 1000
        after: $after
        where: {
          ownerId: $userId
          timestamp_gt: $startTimestamp
          timestamp_lt: $endTimestamp
        }
      ) {
        items {
          protocolFee
          premium
          callAssetPriceUSD
          putAssetPriceUSD
          timestamp
          isCall
          marketAddress
        }
        totalCount
        pageInfo {
          startCursor
          endCursor
          hasNextPage
        }
      }
    }
    `;
    const variables = { userId, startTimestamp, endTimestamp, after: afterCursor };
    const res = await callGraphQL(query, variables);
    const logsPage = res.optionMintLogs;

    if (!logsPage) break; // defensive check

    // Accumulate items
    items.push(...logsPage.items);

    // Prepare for next loop if any
    hasNextPage = logsPage.pageInfo.hasNextPage;
    afterCursor = logsPage.pageInfo.endCursor;
  }

  return items;
}

async function fetchAllExerciseLogs(userId: string, startTimestamp: number, endTimestamp: number) {
  let items: any[] = [];
  let hasNextPage = true;
  let afterCursor: string | null = null;

  while (hasNextPage) {
    const query = `
    query fetchExerciseLogs(
      $userId: String!
      $startTimestamp: Int!
      $endTimestamp: Int!
      $after: String
    ) {
      optionExerciseLogs(
        limit: 1000
        after: $after
        where: {
          ownerId: $userId
          timestamp_gt: $startTimestamp
          timestamp_lt: $endTimestamp
        }
      ) {
        items {
          profitUSD
          timestamp
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
    `;
    const variables = { userId, startTimestamp, endTimestamp, after: afterCursor };
    const res = await callGraphQL(query, variables);

    if (!res.optionExerciseLogs) break;

    items.push(...res.optionExerciseLogs.items);

    hasNextPage = res.optionExerciseLogs.pageInfo.hasNextPage;
    afterCursor = res.optionExerciseLogs.pageInfo.endCursor;
  }

  return items;
}

async function fetchAllSettleLogs(userId: string, startTimestamp: number, endTimestamp: number) {
  let items: any[] = [];
  let hasNextPage = true;
  let afterCursor: string | null = null;

  while (hasNextPage) {
    const query = `
    query fetchSettleLogs(
      $userId: String!
      $startTimestamp: Int!
      $endTimestamp: Int!
      $after: String
    ) {
      optionSettleLogs(
        limit: 1000
        after: $after
        where: {
          ownerId: $userId
          timestamp_gt: $startTimestamp
          timestamp_lt: $endTimestamp
        }
      ) {
        items {
          timestamp
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
    `;
    const variables = { userId, startTimestamp, endTimestamp, after: afterCursor };
    const res = await callGraphQL(query, variables);

    if (!res.optionSettleLogs) break;

    items.push(...res.optionSettleLogs.items);

    hasNextPage = res.optionSettleLogs.pageInfo.hasNextPage;
    afterCursor = res.optionSettleLogs.pageInfo.endCursor;
  }

  return items;
}

// ----------------------------------------------
// 4) Low-level callGraphQL utility function
// ----------------------------------------------
async function callGraphQL(query: string, variables: any) {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error(JSON.stringify(json.errors));
  }
  return json.data;
}

// --------------------------------------------
// 5) The aggregator (same as before, minimal)
// --------------------------------------------
export function aggregateUserYearRecap(data: any) {
  const cum = data.userCumulativeMetric ?? {};

  const mintLogs = data.optionMintLogs?.items ?? [];
  const exerciseLogs = data.optionExerciseLogs?.items ?? [];
  // If you need settle logs for anything, fetch them but we're skipping them here.

  // Convert your lifetimeVolume / lifetimePnl to strings with a `$` prefix
  const lifetimeVolume = `$${cum.cumulativeVolume || '0'}`;
  const lifetimePnl = `$${cum.cumulativePnl || '0'}`;

  // 1) Distinct days traded (mint + exercise)
  const daysSet = new Set<string>();
  [mintLogs, exerciseLogs].forEach((arr) => {
    arr.forEach((log: any) => {
      const day = new Date((log.timestamp ?? 0) * 1000).toISOString().split('T')[0];
      daysSet.add(day);
    });
  });
  const uniqueDaysTraded = daysSet.size;

  // 2) Biggest profit from exercise logs
  let biggestProfitUSD = 0;
  for (const ex of exerciseLogs) {
    const p = Number(ex.profitUSD) || 0;
    if (p > biggestProfitUSD) biggestProfitUSD = p;
  }

  // 3) Total spent on fees + premium (we assume 18 decimals for the token)
  const DECIMALS = 18;
  let totalFeeRaw = BigInt(0);
  let totalPremiumRaw = BigInt(0);

  // 4) Favorite market by **count of mints**
  //    We'll track how many times each market appears in mintLogs
  const mintCountByMarket: Record<string, number> = {};

  for (const mint of mintLogs) {
    // Sum up protocolFee + premium
    const feeBn = BigInt(mint.protocolFee ?? '0');
    const premiumBn = BigInt(mint.premium ?? '0');
    totalFeeRaw += feeBn;
    totalPremiumRaw += premiumBn;

    // Count how many logs each market has
    const marketAddr = mint.marketAddress ?? 'unknown';
    if (!mintCountByMarket[marketAddr]) {
      mintCountByMarket[marketAddr] = 0;
    }
    mintCountByMarket[marketAddr] += 1;
  }

  // Convert from raw to float
  const totalFeeToken = Number(totalFeeRaw) / 10 ** DECIMALS;
  const totalPremiumToken = Number(totalPremiumRaw) / 10 ** DECIMALS;
  const totalSpentToken = totalFeeToken + totalPremiumToken;

  // 5) Identify the market with the highest *count* of minted logs
  let favoriteMarket = 'N/A';
  let maxMints = 0;
  for (const [mAddr, count] of Object.entries(mintCountByMarket)) {
    if (count > maxMints) {
      maxMints = count;
      favoriteMarket = mAddr;
    }
  }

  // Return final recap object
  return {
    userAddress: cum.userId ?? '0x',
    uniqueDaysTraded,
    lifetimeVolume,
    lifetimePnl,
    biggestProfitUSD,
    totalSpentToken,
    favoriteMarket,
  };
}
