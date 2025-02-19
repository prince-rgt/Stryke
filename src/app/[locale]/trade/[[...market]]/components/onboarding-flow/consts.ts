import { APP_DISPLAY_LABEL } from '@/app/[locale]/components/sidebar/consts';

export const ONBOARDING_STEPS_CLASSES = {
  tradingPair: 'trading-pair',
  priceChart: 'price-chart',
  strikesChain: 'strike-chain',
  navigationPanel: 'navigation-panel',
  tradingSidepanel: 'trading-sidepanel',
};

export const ONBOARDING_STEPS = [
  {
    title: `Welcome to the ${APP_DISPLAY_LABEL} Trading Dashboard`,
    content:
      "You can use this dashboard to purchase options and deposit liquidity. We'll guide you through the main features.",
    target: null,
  },

  {
    title: 'Trading Pair Selection',
    content: 'Switch between markets to explore different trading pairs, compare trends, and diversify your portfolio.',
    target: `.${ONBOARDING_STEPS_CLASSES.tradingPair}`,
  },
  {
    title: 'Price Chart',
    content:
      'Analyze trends with the interactive chart. Use drawing tools, adjust timeframes, resize, and add indicators to customize your view and make informed trades.',
    target: `.${ONBOARDING_STEPS_CLASSES.priceChart}`,
  },
  {
    title: 'Strikes Chain',
    content:
      'Can find the available strikes, the corresponding liquidity and other relavant data for trading and providing liquidity here. You can also customize the columns to display and apply filters from the top.',
    target: `.${ONBOARDING_STEPS_CLASSES.strikesChain}`,
  },
  {
    title: 'Navigation Panel',
    content:
      'Use the navigation panel tabs to switch between views. The maximize/minimize buttons on the right allow you to adjust the dashboard layout for optimal viewing.',
    tip: 'Also check for hotkeys to switch between tabs which will appear when you hover over the tabs.',
    target: `.${ONBOARDING_STEPS_CLASSES.navigationPanel}`,
  },
  {
    title: 'Trade and LP panels',
    content:
      'Switch between Trade and Liquidity Provision modes at the top. Use this to create your trading and liquidity positions.',
    target: `.${ONBOARDING_STEPS_CLASSES.tradingSidepanel}`,
  },
];
