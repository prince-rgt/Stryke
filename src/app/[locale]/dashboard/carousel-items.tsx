interface CarouselItem {
  text: React.ReactNode;
  imageUrl: string;
  button: {
    label: string;
    href: string;
    openInNewWindow: boolean;
  };
}

const CAROUSEL_ITEMS: CarouselItem[] = [
  {
    text: (
      <>
        Sonic markets now live! Trade <span className="text-highlight">$S and $wETH</span> to earn points and gems.
      </>
    ),
    imageUrl: '/images/carousel/sonic_launch.webp',
    button: {
      label: 'Trade now',
      href: '/trade/Sonic/WS-USDC.e',
      openInNewWindow: false,
    },
  },

  {
    text: (
      <>
        New to options trading? Check out our <span className="text-highlight">Options 101</span> guide to get started.
      </>
    ),
    imageUrl: '/images/carousel/options_101.webp',
    button: {
      label: 'Learn now',
      href: 'https://learn.stryke.xyz/quick-start/essential-series-1-discovering-options-trading-on-stryke',
      openInNewWindow: true,
    },
  },

  {
    text: (
      <>
        Welcome to <span className="text-highlight"> Stryke</span>. If you’re new, start by reading more about our
        flagship products, or scroll for more information.{' '}
      </>
    ),
    imageUrl: '/images/carousel/exchanges.webp',
    button: {
      label: 'CLAMMs',
      href: 'https://docs.stryke.xyz/ui-walkthroughs/clamm-walkthrough',
      openInNewWindow: true,
    },
  },

  {
    text: (
      <>
        Reward Gauges deployed! Rewards will be distributed in
        <span className="text-highlight"> 50% $SYK and 50% xSYK, with 50k SYK/xSYK </span> total emitted every week.
      </>
    ),
    imageUrl: '/images/carousel/gauges-launch.webp',
    button: {
      label: 'Vote Now',
      href: '/gauges',
      openInNewWindow: false,
    },
  },
  {
    text: (
      <>
        Never miss another trade with
        <span className="text-highlight"> Limit Exercise </span>
      </>
    ),
    imageUrl: '/images/carousel/limit-exercise.webp',
    button: {
      label: 'Learn More',
      href: 'https://blog.stryke.xyz/11a643cdd120804ebbe7d3f925295cfd',
      openInNewWindow: true,
    },
  },
  {
    text: (
      <>
        Get behind-the-scenes look at{' '}
        <span className="text-stryke-yellow">enhancements, bug fixes, and new features</span> — turning your feedback
        into action!
      </>
    ),
    imageUrl: '/images/carousel/changelog.webp',
    button: {
      label: 'Changelog',
      href: 'https://www.stryke.xyz/changelog',
      openInNewWindow: true,
    },
  },
  // {
  //   text: 'We’ve moved from DPX and rDPX to a unified token model that is also cross-chain. Please migrate to SYK at your earliest convenience.',
  //   imageUrl: '/images/carousel/dpx-to-stryke.webp',
  //   button: {
  //     label: 'Migration Page',
  //     href: '/migrate',
  //     openInNewWindow: false,
  //   },
  // },
];

export { CAROUSEL_ITEMS };
