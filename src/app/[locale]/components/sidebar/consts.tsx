import { BUILD_APP_NAMES } from '@/types';

import { ROUTE_PATTERNS } from '@/middleware';
import { DashboardIcon } from '@radix-ui/react-icons';
import {
  ArrowLeftRight,
  CandlestickChartIcon,
  Gavel,
  LockKeyhole,
  LucideChartColumnIncreasing,
  TimerResetIcon,
} from 'lucide-react';

import { BUILD_APP_NAME } from '@/consts/env';

const isRouteAllowed = (path: string) => {
  return BUILD_APP_NAME === BUILD_APP_NAMES.STRYKE
    ? true
    : (ROUTE_PATTERNS[path]?.includes(BUILD_APP_NAME as BUILD_APP_NAMES) ?? false);
};

export const ALL_SIDEBAR_ITEMS = [
  // {
  //   Icon: Grid2X2,
  //   label: 'Dashboard',
  //   href: '/',
  // },
  {
    Icon: DashboardIcon,
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    Icon: CandlestickChartIcon,
    label: 'Trade',
    href: '/trade',
  },
  {
    Icon: ArrowLeftRight,
    label: 'Migrate',
    href: '/migrate',
  },
  {
    Icon: LockKeyhole,
    label: 'xSyk',
    href: '/xsyk',
  },
  {
    Icon: TimerResetIcon,
    label: 'Staking',
    href: '/xsyk/staking',
  },
  {
    Icon: Gavel,
    label: 'Gauges',
    href: '/gauges',
  },
  {
    Icon: LucideChartColumnIncreasing,
    label: 'Leaderboard',
    href: '/leaderboard',
  },
];

export const SIDEBAR_ITEMS = ALL_SIDEBAR_ITEMS.filter((item) => isRouteAllowed(item.href));

const LOGO_HREF_BY_BUILD_APP = {
  [BUILD_APP_NAMES.STRYKE]: '/dashboard',
  [BUILD_APP_NAMES.BERACHAIN_TESTNET]: '/trade',
  [BUILD_APP_NAMES.KODIAK]: '/trade',
  [BUILD_APP_NAMES.PANCAKESWAP]: '/trade',
};

export const LOGO_CLICK_HREF = LOGO_HREF_BY_BUILD_APP[BUILD_APP_NAME];

const DISPLAY_LABEL_BY_BUILD_APP = {
  [BUILD_APP_NAMES.STRYKE]: 'Stryke',
  [BUILD_APP_NAMES.BERACHAIN_TESTNET]: 'BeraChain',
  [BUILD_APP_NAMES.KODIAK]: 'Kodiak',
  [BUILD_APP_NAMES.PANCAKESWAP]: 'PancakeSwap',
};

export const APP_DISPLAY_LABEL = DISPLAY_LABEL_BY_BUILD_APP[BUILD_APP_NAME];
