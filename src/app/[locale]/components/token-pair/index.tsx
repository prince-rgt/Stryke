import { MarketData } from '@/types';

import Image from 'next/image';
import React from 'react';

import { getTokenLogoURI } from '@/utils/tokens';

import { Typography, TypographyProps } from '@/components/ui/typography';

const TokenPair = ({
  pair,
  typographyVariant,
}: {
  pair: MarketData['pair'];
  typographyVariant?: TypographyProps['variant'];
}) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative inline-block">
        <Image
          width={24}
          height={24}
          src={getTokenLogoURI(pair[0])}
          alt={pair[0].symbol}
          className="h-6 w-6 rounded-full"
        />
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 transform">
          <Image
            width={12}
            height={12}
            src={getTokenLogoURI(pair[1])}
            alt={pair[1].symbol}
            className="h-3 w-3 rounded-full"
          />
        </div>
      </div>
      <Typography variant={typographyVariant || 'small-medium'}>{pair[0].symbol} </Typography>
      <Typography className="text-muted-foreground" variant={typographyVariant || 'small-medium'}>
        {'/ '}
        {pair[1].symbol}
      </Typography>
    </div>
  );
};

export default TokenPair;
