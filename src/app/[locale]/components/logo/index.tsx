import { BUILD_APP_NAMES } from '@/types';

import { SVGProps } from 'react';

import KodiakLogo from '@/components/icons/kodiak-logo';
import PcsLogo from '@/components/icons/pcs-logo';
import StrykeLogo from '@/components/icons/stryke-logo';

import { BUILD_APP_NAME } from '@/consts/env';

const Logo = (props: SVGProps<SVGSVGElement>) => {
  if (BUILD_APP_NAME === BUILD_APP_NAMES.KODIAK) {
    return <KodiakLogo {...props} />;
  } else if (BUILD_APP_NAME === BUILD_APP_NAMES.PANCAKESWAP) {
    return <PcsLogo {...props} className="ml-1 mr-4" />;
  }
  return <StrykeLogo {...props} />;
};

export default Logo;
