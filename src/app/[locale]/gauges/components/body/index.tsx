import React from 'react';

import GaugeDetails from './gauge-details';
import Header from './header';
import Info from './info';

const Body = () => {
  return (
    <div className="w-full divide-y divide-background">
      <div className="p-md gap-md flex flex-col">
        <Header />
        <Info />
      </div>
      <GaugeDetails />
    </div>
  );
};

export default Body;
