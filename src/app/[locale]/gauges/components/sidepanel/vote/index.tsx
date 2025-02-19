import Image from 'next/image';
import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Typography } from '@/components/ui/typography';
import GagueSelector from '../components/gauge-selector';

import useGaugeControllerStore from '../../../hooks/store/useGaugeControllerStore';

interface GaugeVoteSelectorProps {
  maxVoteAmount: bigint;
}

const GaugeVoteSelector: React.FC<GaugeVoteSelectorProps> = ({ maxVoteAmount }) => {
  const { selectedRow, voteAmount, setVoteAmount, XsykBalance } = useGaugeControllerStore();
  const [amount, setAmount] = React.useState(0);

  useEffect(() => {
    if (selectedRow) {
      setVoteAmount(0n); // Reset vote amount when selected gauge changes
      setAmount(0);
    }
  }, [selectedRow, setVoteAmount]);

  if (!selectedRow) return null;

  const handleVoteAmountChange = (value: number) => {
    if (maxVoteAmount < BigInt(value * 1e18)) {
      setVoteAmount(maxVoteAmount);
      setAmount(Number(maxVoteAmount) / 1e18);
    } else {
      setVoteAmount(BigInt(value * 1e18));
      setAmount(value);
    }
  };

  const max = () => {
    setVoteAmount(maxVoteAmount);
    setAmount(Number(maxVoteAmount) / 1e18);
  };

  return (
    <div className="mb-4 space-y-4">
      <Typography variant="small-medium" className="text-muted-foreground">
        Select Gauge
      </Typography>
      <GagueSelector />
      <div className="flex flex-col">
        <div className="flex flex-row items-center justify-between bg-selected p-2 pb-6">
          <div>
            <Typography variant="small-medium" className="text-muted-foreground">
              Vote Amount
            </Typography>
            <Input
              type="number"
              name="voteAmount"
              id="voteAmount"
              variant="ghost"
              className="text-lg text-foreground"
              value={amount}
              onChange={(e) => handleVoteAmountChange(Number(e.target.value))}
              min={0}
              max={Number(maxVoteAmount) / 1e18}
            />
          </div>
          <Button variant="ghost" className="text-muted-foreground" onClick={max}>
            <div className="content-center">
              <div className="flex flex-row bg-muted p-2">
                <Image src="/images/tokens/xsyk.svg" alt="XSYK" width={16} height={16} />
                <Typography variant="small-medium" className="ml-1 text-white">
                  MAX
                </Typography>
              </div>
            </div>
          </Button>
        </div>
        <div className="flex flex-row items-center justify-between bg-selected p-2">
          <Typography variant="small-medium" className="text-muted-foreground">
            Balance: <span className="text-white">{(Number(XsykBalance) / 1e18).toFixed(2)}</span> xSYK
          </Typography>
          <Typography variant="small-medium" className="text-muted-foreground">
            Votable: <span className="text-white">{(Number(maxVoteAmount) / 1e18).toFixed(2)}</span> xSYK
          </Typography>
        </div>
      </div>
      <div className="pl-2">
        <Slider
          value={[Number(amount)]}
          onValueChange={([value]) => handleVoteAmountChange(value)}
          max={Number(maxVoteAmount) / 1e18}
          step={1}
          className="w-full bg-selected"
        />
      </div>
    </div>
  );
};

export default GaugeVoteSelector;
