import * as React from 'react';
import { SVGProps } from 'react';

const CoinbaseLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
    <g fillRule="evenodd" clipRule="evenodd">
      <path
        fill="#0052FF"
        d="M3.332 0h9.335C14.508 0 16 1.605 16 3.585v8.83C16 14.395 14.508 16 12.668 16H3.332C1.492 16 0 14.395 0 12.415v-8.83C0 1.605 1.492 0 3.332 0Z"
      />
      <path fill="#fff" d="M8 2.317a5.682 5.682 0 1 1 0 11.365A5.682 5.682 0 0 1 8 2.317Z" />
      <path
        fill="#0052FF"
        d="M6.6 6.184H9.4c.23 0 .417.2.417.448v2.736c0 .247-.187.448-.417.448H6.6c-.23 0-.416-.201-.416-.448V6.632c0-.247.187-.448.416-.448Z"
      />
    </g>
  </svg>
);
export default CoinbaseLogo;
