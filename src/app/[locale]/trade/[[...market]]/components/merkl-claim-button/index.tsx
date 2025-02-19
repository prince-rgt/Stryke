import { useMemo } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useAccount, useChainId } from 'wagmi';

import { Button } from '@/components/ui/button';
import NumberDisplay from '@/components/ui/number-display';
import { Typography } from '@/components/ui/typography';

import useStrikesStore from '@/app/[locale]/trade/[[...market]]/hooks/store/useStrikesStore';
import useMerklData from '@/app/[locale]/trade/[[...market]]/hooks/useMerklData';

const ClaimButton = () => {
  const chainId = useChainId();
  const { address: user } = useAccount();

  const { selectedMarket } = useStrikesStore();

  const { claimableTokensData, claimable, claim, claiming, refetch } = useMerklData({
    user,
    chainId,
    pool: selectedMarket?.primePool,
  });

  const nothingToClaim = useMemo(() => {
    return claimableTokensData.every((token) => BigInt(token.unclaimed) === 0n);
  }, [claimableTokensData]);

  if (!user || claimableTokensData.length == 0) return;

  return (
    <div className="flex space-x-2">
      <span className="flex items-center space-x-1 rounded-sm bg-primary px-md text-center text-xs">
        <Typography variant="small-bold" className="text-muted-foreground">
          Rewards accrued:{' '}
        </Typography>
        <span className="flex space-x-2">
          {claimableTokensData.map(
            (token, index) =>
              token && (
                <>
                  <Typography className="text-success" key={index} variant="small-bold">
                    {Number(token.unclaimed) === 0 ? (
                      '0'
                    ) : BigInt(token.unclaimed) < parseUnits('1', parseInt(token.decimals) - 3) ? (
                      '<0.001'
                    ) : (
                      <NumberDisplay
                        value={Number(formatUnits(BigInt(token.unclaimed), parseInt(token.decimals)))}
                        format="tokenAmount"
                      />
                    )}
                  </Typography>
                  <Typography className="text-muted-foreground" variant="small-bold">
                    {token.symbol}
                  </Typography>
                </>
              ),
          )}
        </span>
      </span>
      <Button
        size="sm"
        className="flex space-x-2 disabled:bg-gradient-to-r disabled:from-[#fdceaa]/50 disabled:to-[#faf1e7]/50 bg-gradient-to-r from-[#fdceaa] to-[#faf1e7]"
        onClick={() =>
          claim()
            .then(() => console.log('claimed'))
            .catch((e) => console.error(e))
            .finally(() => refetch())
        }
        disabled={!claimable || claiming || nothingToClaim}>
        <Typography className="place-items-start text-xs text-background">
          {claiming ? 'Claiming...' : 'Claim'}
        </Typography>
      </Button>
    </div>
  );
};

export default ClaimButton;
