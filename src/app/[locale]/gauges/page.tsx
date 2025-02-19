'use client';

import Body from './components/body';
import Sidepanel from './components/sidepanel';

const GuagesRoot = () => {
  return (
    <div className="relative flex w-full h-full bg-primary border-t border-background divide-x divide-background">
      <Body />
      <Sidepanel />
    </div>
  );
};

export default GuagesRoot;
