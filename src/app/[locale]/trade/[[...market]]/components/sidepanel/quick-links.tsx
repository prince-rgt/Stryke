import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import React from 'react';

import { Link } from '@/navigation';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

const QuickLinks = () => {
  return (
    <div className="flex w-full flex-col space-y-md bg-secondary p-md">
      <div>
        <Typography className="p-bold">Quick Links</Typography>
        <Typography className="text-muted-foreground" variant={'small-medium'}>
          Got questions, need a tutorial or contract addresses?
        </Typography>
      </div>
      <Link className="w-full" target="_blank" href={'https://docs.stryke.xyz/ui-walkthroughs/clamm-walkthrough'}>
        <Button variant={'secondary'} size="sm" className="w-full justify-between">
          <Typography variant={'small-medium'}>CLAMM Walkthrough</Typography>
          <OpenInNewWindowIcon className="h-4 w-4" />
        </Button>
      </Link>
      <Link className="w-full" target="_blank" href={'https://blog.stryke.xyz/'}>
        <Button variant={'secondary'} size="sm" className="w-full justify-between">
          <Typography variant={'small-medium'}>Documentation</Typography>
          <OpenInNewWindowIcon className="h-4 w-4" />
        </Button>
      </Link>
      <Link className="w-full" target="_blank" href={'https://dune.com/kaiblade/strykemetrics'}>
        <Button variant={'secondary'} size="sm" className="w-full justify-between">
          <Typography variant={'small-medium'}>Dune Dashboard</Typography>
          <OpenInNewWindowIcon className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
};

export default QuickLinks;
