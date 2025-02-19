import { BUILD_APP_NAMES } from '@/types';

import { SVGProps } from 'react';

import KodiakTextLogo from '@/components/icons/kodiak-text-logo';
import PCSTextLogo from '@/components/icons/pcs-text-logo';
import StrykeTextLogo from '@/components/icons/stryke-text-logo';

import { BUILD_APP_NAME } from '@/consts/env';

const TextLogo = (props: SVGProps<SVGSVGElement>) => {
  if (BUILD_APP_NAME === BUILD_APP_NAMES.KODIAK) {
    return <KodiakTextLogo {...props} />;
  } else if (BUILD_APP_NAME === BUILD_APP_NAMES.PANCAKESWAP) {
    return <PCSTextLogo {...props} className="-translate-x-10" />;
  }
  return <StrykeTextLogo {...props} />;
};

export default TextLogo;
