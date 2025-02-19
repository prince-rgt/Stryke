import { Sparkles } from 'lucide-react';
import React from 'react';

import NumberDisplay from '@/components/ui/number-display';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Typography } from '@/components/ui/typography';

type APRBreakdown = {
  earnings: {
    low: number;
    high: number;
  };
  rewards?: {
    gems?: number;
    points?: number;
    other?: {
      label: string;
      value: number;
    }[];
  };
};

const APRCell = ({ breakdown }: { breakdown: APRBreakdown }) => {
  const hasRewards =
    breakdown.rewards &&
    (breakdown.rewards.gems ||
      breakdown.rewards.points ||
      (breakdown.rewards.other && breakdown.rewards.other.length > 0));

  const totalLow =
    breakdown.earnings.low +
    (breakdown.rewards?.gems || 0) +
    (breakdown.rewards?.points || 0) +
    (breakdown.rewards?.other?.reduce((acc, curr) => acc + curr.value, 0) || 0);

  const totalHigh =
    (breakdown.earnings.high || 0) +
    (breakdown.rewards?.gems || 0) +
    (breakdown.rewards?.points || 0) +
    (breakdown.rewards?.other?.reduce((acc, curr) => acc + curr.value, 0) || 0);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="flex items-center px-md">
          <Typography variant="small-medium" className="flex items-center gap-1">
            {totalLow === totalHigh ? (
              <NumberDisplay value={totalLow} format="percent" />
            ) : (
              <>
                <NumberDisplay value={totalLow} format="percent" />
                {' - '}
                <NumberDisplay value={totalHigh} format="percent" />
              </>
            )}
            {hasRewards && <Sparkles className="w-4 h-4 text-highlight" />}
          </Typography>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-2">
            <div className="font-medium">APR Breakdown</div>
            <div className="space-y-1">
              <div className="flex justify-between gap-4">
                <span>Premiums:</span>
                <span>
                  {breakdown.earnings.low === breakdown.earnings.high ? (
                    <NumberDisplay value={breakdown.earnings.low} format="percent" />
                  ) : (
                    <>
                      <NumberDisplay value={breakdown.earnings.low} format="percent" />
                      {' - '}
                      <NumberDisplay value={breakdown.earnings.high} format="percent" />
                    </>
                  )}
                </span>
              </div>
              {breakdown.rewards?.gems && (
                <div className="flex justify-between gap-4">
                  <span>Gems:</span>
                  <span>
                    <NumberDisplay value={breakdown.rewards.gems} format="percent" />
                  </span>
                </div>
              )}
              {breakdown.rewards?.points && (
                <div className="flex justify-between gap-4">
                  <span>Points:</span>
                  <span>
                    <NumberDisplay value={breakdown.rewards.points} format="percent" />
                  </span>
                </div>
              )}
              {breakdown.rewards?.other?.map((reward, index) => (
                <div key={index} className="flex justify-between gap-4">
                  <span>{reward.label}:</span>
                  <span>
                    <NumberDisplay value={reward.value} format="percent" />
                  </span>
                </div>
              ))}
              <div className="border-t pt-1 flex justify-between gap-4 font-medium">
                <span>Total:</span>
                <span>
                  {totalLow === totalHigh ? (
                    <NumberDisplay value={totalLow} format="percent" />
                  ) : (
                    <>
                      <NumberDisplay value={totalLow} format="percent" />
                      {' - '}
                      <NumberDisplay value={totalHigh} format="percent" />
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default APRCell;
