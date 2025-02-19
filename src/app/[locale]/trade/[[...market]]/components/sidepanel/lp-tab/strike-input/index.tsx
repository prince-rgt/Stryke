import { TokenData } from '@/types';

import { useCallback, useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';

import useTokenBalances from '../../../../hooks/useTokenBalances';
import { useLpStore } from '../hooks/store/useLpStore';

const StrikeInput = ({
  token,
  tickLower,
  tickUpper,
  strikePrice,
}: {
  token: TokenData;
  strikePrice: number;
  tickLower: number;
  tickUpper: number;
}) => {
  const { setInputValue, inputValues, unsetInputValue } = useLpStore();
  const { decimals, symbol } = token;
  const value = inputValues?.get(strikePrice)?.amount || BigInt(0);

  const [localInputValue, setLocalInputValue] = useState<string>(formatUnits(value, token.decimals));

  const { tokenBalances } = useTokenBalances({});

  const {
    callToken: callTokenBalance = BigInt(0),
    putToken: putTokenBalance = BigInt(0),
    callTokenSymbol,
  } = tokenBalances ?? {};

  const maxValue = symbol == callTokenSymbol ? callTokenBalance : putTokenBalance;

  // effect to unset the value
  useEffect(() => {
    return () => {
      unsetInputValue(strikePrice);
    };
  }, [unsetInputValue, strikePrice]);

  const updateInputValue = useCallback(
    (value: bigint) => {
      setInputValue(strikePrice, { amount: value, token, tickLower, tickUpper });
    },
    [setInputValue, strikePrice, tickLower, tickUpper, token],
  );

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (newValue === '.') {
      newValue = '0.';
    }
    setLocalInputValue(newValue);
    // console.log('newValue', newValue, e.target.value);
    updateInputValue(parseUnits(newValue, decimals));
  };

  const handlePercentageClick = useCallback(
    (percentage: number) => {
      const value = (maxValue * BigInt(percentage)) / BigInt(100);
      setLocalInputValue(formatUnits(value, decimals));
      updateInputValue(value);
    },
    [decimals, maxValue, updateInputValue],
  );

  return (
    <>
      <Input
        value={localInputValue}
        type="number"
        onChange={handleValueChange}
        className="ml-md text-foreground"
        variant={'ghost'}
      />
      <div className="relative inline-block">
        <div className="group relative inline-block">
          <Button
            className="peer ml-1"
            onClick={() => {
              handlePercentageClick(100);
            }}
            size={'sm'}
            variant={'secondary'}>
            <Typography variant="extra-small-regular">Max</Typography>
          </Button>
          <div className="pointer-events-none absolute -left-[68px] top-0.5 flex items-center space-x-1 bg-secondary opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100 peer-hover:pointer-events-auto">
            <Button
              onClick={() => {
                handlePercentageClick(50);
              }}
              size={'sm'}
              className="border border-border"
              variant={'secondary'}>
              <Typography variant="extra-small-regular">50%</Typography>
            </Button>
            <Button
              onClick={() => {
                handlePercentageClick(75);
              }}
              size={'sm'}
              className="border border-border"
              variant={'secondary'}>
              <Typography variant="extra-small-regular">75%</Typography>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StrikeInput;
