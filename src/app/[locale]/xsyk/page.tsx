import { Metadata } from 'next';

import Body from './components/body';
import Plugins from './components/plugins';

import { OPEN_GRAPH_BASE_DATA } from '@/consts/metadata';

export const metadata: Metadata = {
  title: 'xSYK | Stryke',
  description: 'Convert your SYK to xSYK to earn rewards and participate in gauge voting.',
  openGraph: {
    title: 'xSYK | Stryke',
    description: 'Convert your SYK to xSYK to earn rewards and participate in gauge voting.',
    ...OPEN_GRAPH_BASE_DATA,
  },
};

const XSykRoot = () => {
  return (
    <div className="relative flex w-full h-full divide-x divide-background bg-primary border-t border-background">
      <Body />
      <Plugins />
    </div>
  );
};

export default XSykRoot;
