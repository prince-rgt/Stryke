import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { chain } from 'lodash';
import React, { use } from 'react';
import { useAccount } from 'wagmi';

import { Link } from '@/navigation';

import EtherscanLogo from '@/components/icons/etherscan-logo';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

import useGaugeController from '../../hooks/useGaugeController';

import { CHAINS, DEFAULT_CHAIN_ID } from '@/consts/chains';
import { SUPPORTED_GAUGE_CHAINS } from '../../consts';

const QuickLinks = () => {
  let { chainId = DEFAULT_CHAIN_ID } = useAccount();
  const { gaugeControllersByChain } = useGaugeController();
  if (chainId in SUPPORTED_GAUGE_CHAINS) {
  } else {
    chainId = SUPPORTED_GAUGE_CHAINS[0];
  }
  const gaugeControllerAddress = gaugeControllersByChain[chainId];
  return (
    <div className="flex flex-col w-full bg-secondary p-md space-y-md">
      <div>
        <Typography className="p-bold">Quick Links</Typography>
        <Typography className="text-muted-foreground" variant="small-medium">
          Need Help
        </Typography>
      </div>
      <Link className="w-full" target="_blank" href="/xsyk">
        <Button variant={'secondary'} size="sm" className="w-full justify-between">
          <Typography variant="small-medium">Convert SYK to XSYK</Typography>
          <OpenInNewWindowIcon className="w-4 h-4" />
        </Button>
      </Link>
      <Link className="w-full" target="_blank" href="https://docs.stryke.xyz/tokenomics/xsyk-token">
        <Button variant={'secondary'} size="sm" className="w-full justify-between">
          <Typography variant="small-medium">Staking XSYK</Typography>
          <OpenInNewWindowIcon className="w-4 h-4" />
        </Button>
      </Link>
      <Link className="w-full" target="_blank" href={CHAINS[chainId].explorer + `address/` + gaugeControllerAddress}>
        <Button variant={'secondary'} size="sm" className="w-full justify-between">
          <div className="flex flex-row">
            <EtherscanLogo className="mr-2" />
            <Typography variant="small-medium">Gauge Controller</Typography>
          </div>
          <OpenInNewWindowIcon className="w-4 h-4" />
        </Button>
      </Link>
      <Link
        className="w-full"
        target="_blank"
        href="https://arbiscan.io/address/0x50e04e222fc1be96e94e86acf1136cb0e97e1d40">
        <Button variant={'secondary'} size="sm" className="w-full justify-between">
          <div className="flex flex-row">
            <EtherscanLogo className="mr-2" />
            <Typography variant="small-medium">XSYK</Typography>
          </div>
          <OpenInNewWindowIcon className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
};

export default QuickLinks;
