import { BUILD_APP_NAMES } from '@/types';

import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { GraduationCap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { Link, usePathname } from '@/navigation';

import { badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Typography } from '@/components/ui/typography';

import { useGlobalUiStore } from '../../hooks/useGlobalUiStore';

import { BUILD_APP_NAME } from '@/consts/env';

import Logo from '../logo';
import TextLogo from '../logo/text';
import ConnectWallet from './connect-wallet';
import Prices from './prices';
import RecapButton from './recap';

const BUILD_APP_CONFIG = {
  [BUILD_APP_NAMES.STRYKE]: {
    badgeData: {
      url: 'https://blog.stryke.xyz/articles/introducing-reward-gauges-maximizing-lp-rewards-in-weth-and-wbtc-markets',
      text: 'BadgeText',
    },
    displayBranding: false,
    landingPage: 'https://stryke.xyz',
  },
  [BUILD_APP_NAMES.BERACHAIN_TESTNET]: {
    badgeData: {
      url: 'https://blog.stryke.xyz/articles/introducing-reward-gauges-maximizing-lp-rewards-in-weth-and-wbtc-markets',
      text: 'BadgeText',
    },
    displayBranding: false,
    landingPage: 'https://www.berachain.com/',
  },
  [BUILD_APP_NAMES.KODIAK]: {
    badgeData: {
      url: 'https://medium.com/@KodiakFi/introducing-kodiak-berachains-native-liquidity-hub-63c3e7749b30',
      text: 'BadgeTextKodiak',
    },
    displayBranding: false,
    landingPage: 'https://kodiak.finance/',
  },
  [BUILD_APP_NAMES.PANCAKESWAP]: {
    badgeData: {
      url: 'https://docs.pancakeswap.finance/products/options',
      text: 'BadgeTextPancake',
    },
    displayBranding: true,
    landingPage: 'https://pancakeswap.finance/home',
  },
};

const BADGE_DATA = BUILD_APP_CONFIG[BUILD_APP_NAME].badgeData;
const SHOW_BRANDING_IN_HEADER = BUILD_APP_CONFIG[BUILD_APP_NAME].displayBranding;
const LANDING_PAGE = BUILD_APP_CONFIG[BUILD_APP_NAME].landingPage;

const HeaderDesktop = () => {
  const t = useTranslations('Header');
  const pathname = usePathname();
  const isTradePage = useMemo(() => pathname.includes('/trade'), [pathname]);
  const { triggerTradeOnboardingFlow } = useGlobalUiStore();

  return (
    <div className="z-20 flex items-center justify-between bg-primary px-md py-[6px] border-b-2 border-black">
      {SHOW_BRANDING_IN_HEADER ? (
        <Link href={LANDING_PAGE} target="_self" rel="noopener noreferrer" className="flex">
          <Logo /> <TextLogo />
        </Link>
      ) : null}
      <div className="flex h-full items-center space-x-md">
        <Prices />
        <Separator orientation="vertical" />

        <Typography className="flex gap-2" variant={'extra-small-regular'}>
          <span> 21 </span>
          <span className="text-muted-foreground">GWEI</span>
        </Typography>

        <Separator orientation="vertical" />
        <Link
          target="_blank"
          href={BADGE_DATA.url}
          className={`${badgeVariants({ bgColor: 'white' })} flex items-center px-1.5`}>
          <span className="mt-1"> {t(BADGE_DATA.text)} </span>
          <OpenInNewWindowIcon className="ml-md h-3 w-3" />
        </Link>
      </div>

      {isTradePage && (
        <Tooltip>
          <TooltipTrigger asChild className="ml-auto mr-md flex h-full items-center py-0.5">
            <Button onClick={triggerTradeOnboardingFlow} size={'sm'} variant={'ghost'}>
              <GraduationCap className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Show the onboarding guide</TooltipContent>
        </Tooltip>
      )}
      <div className="flex items-center">
        {/* {BUILD_APP_NAME === BUILD_APP_NAMES.STRYKE && <RecapButton />} */}
        <ConnectWallet />
      </div>
    </div>
  );
};

export default HeaderDesktop;
