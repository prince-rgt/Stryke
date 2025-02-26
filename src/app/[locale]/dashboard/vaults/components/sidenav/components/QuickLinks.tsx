import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import React from 'react';

import { Link } from '@/navigation';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

import { Dune } from '@/assets/images';

const QuickLinks = () => {
  return (
    <div className="flex flex-col w-full bg-secondary p-md space-y-md">
      <div>
        <Typography className="font-bold text-md text-white">Quick Links</Typography>
        <Typography className="text-muted-foreground" variant={'small-medium'}>
          Got questions, need a tutorial or contract addresses?
        </Typography>
      </div>
      <Link className="w-full" target="_blank" href="#">
        <Button variant={'secondary'} size="sm" className="w-full justify-between">
          <Typography variant={'small-medium'}>Vaults Introduction</Typography>
          <OpenInNewWindowIcon className="w-4 h-4" />
        </Button>
      </Link>
      <Link className="w-full" target="_blank" href="#">
        <Button variant={'secondary'} size="sm" className="w-full justify-between">
          <Typography variant={'small-medium'}>Documentation</Typography>
          <OpenInNewWindowIcon className="w-4 h-4" />
        </Button>
      </Link>
      <Link className="w-full" target="_blank" href="#">
        <Button variant={'secondary'} size="sm" className="w-full justify-between">
          <div className="flex gap-2">
            <Image src={Dune} alt="" />
            <Typography variant={'small-medium'}>Dune Analytics</Typography>
          </div>
          <OpenInNewWindowIcon className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
};

export default QuickLinks;
