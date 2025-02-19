import * as React from 'react';
import { SVGProps } from 'react';

const StrykeLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 30 30" fill="none" {...props}>
    <path
      fill="#EBFF00"
      d="M17.837 1.5h5.136l-.9 5.057h-5.135l.899-5.057ZM5.475 6.557h11.463L15.437 15H3.974l1.501-8.443ZM25.4 23.443H13.939L15.44 15h11.463l-1.501 8.443ZM13.04 28.5H7.902l.9-5.057h5.135L13.04 28.5Z"
    />
  </svg>
);
export default StrykeLogo;
