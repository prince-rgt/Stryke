import * as React from 'react';
import { SVGProps } from 'react';

const KodiakTextLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={62} height={30} viewBox="0 0 62 30" fill="none" {...props}>
    <text fill="white" font-size="20" font-family="Inter, sans-serif" font-weight="500" x="2" y="24">
      Kodiak
    </text>
  </svg>
);

export default KodiakTextLogo;
