import * as React from 'react';
import { SVGProps } from 'react';

interface EtherscanLogoProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const EtherscanLogo: React.FC<EtherscanLogoProps> = ({ className = '', ...props }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 123 123"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`h-4 w-4 ${className}`}
    {...props}>
    <path
      d="M25.79 58.415a5.157 5.157 0 0 1 5.181-5.156l8.59.028a5.164 5.164 0 0 1 5.164 5.164v32.48c.967-.287 2.209-.593 3.568-.913a4.3 4.3 0 0 0 3.317-4.187V45.54a5.165 5.165 0 0 1 5.164-5.165h8.607a5.165 5.165 0 0 1 5.164 5.165v37.393s2.155-.872 4.254-1.758a4.311 4.311 0 0 0 2.632-3.967V32.63a5.164 5.164 0 0 1 5.163-5.164H91.2a5.164 5.164 0 0 1 5.164 5.164V69.34c7.462-5.408 15.024-11.912 21.025-19.733a8.662 8.662 0 0 0 1.319-8.092A60.792 60.792 0 0 0 60.567.686 60.788 60.788 0 0 0 8.577 91.75a7.688 7.688 0 0 0 7.334 3.8c1.628-.143 3.655-.346 6.065-.63a4.3 4.3 0 0 0 3.815-4.268l-.001-32.236Z"
      fill="#21325B"
    />
    <path
      d="M25.602 110.51a60.813 60.813 0 0 0 63.371 5.013 60.815 60.815 0 0 0 33.212-54.203c0-1.4-.065-2.785-.158-4.162-22.219 33.138-63.244 48.63-96.423 53.347"
      fill="#979695"
    />
  </svg>
);

export default EtherscanLogo;
