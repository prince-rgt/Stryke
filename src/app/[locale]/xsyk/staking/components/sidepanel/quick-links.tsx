import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import React from 'react';

import { Link } from '@/navigation';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

const QuickLinks = () => {
  return (
    <div className="flex flex-col w-full bg-secondary p-md space-y-md">
      <div>
        <Typography className="p-bold">Quick Links</Typography>
        <Typography className="text-muted-foreground" variant={'small-medium'}>
          Got questions, need a tutorial or contract addresses?
        </Typography>
      </div>
      <Link className="w-full" target="_blank" href="/xsyk">
        <Button variant={'secondary'} size="sm" className="w-full justify-between">
          <Typography variant={'small-medium'}>Convert SYK to XSYK</Typography>
          <OpenInNewWindowIcon className="w-4 h-4" />
        </Button>
      </Link>
      <Link className="w-full" target="_blank" href={'/migrate'}>
        <Button variant={'secondary'} size="sm" className="w-full justify-between">
          <Typography variant={'small-medium'}>Migrate your DPX & RDPX to SYK</Typography>
          <OpenInNewWindowIcon className="w-4 h-4" />
        </Button>
      </Link>
      <Link className="w-full" target="_blank" href="https://docs.stryke.xyz/tokenomics/xsyk-token">
        <Button variant={'secondary'} size="sm" className="w-full justify-between">
          <Typography variant={'small-medium'}>Staking XSYK</Typography>
          <OpenInNewWindowIcon className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
};

export default QuickLinks;
