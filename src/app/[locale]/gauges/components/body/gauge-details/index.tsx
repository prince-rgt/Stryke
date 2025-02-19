import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Typography } from '@/components/ui/typography';

import Gauges from './gauge-tab';
import Votes from './votes-tab';

enum TableTabs {
  Gauges = 'Gauges',
  Votes = 'Your Votes',
}

const TABS_TRIGGER_CLASSNAME = 'group h-full flex space-x-md items-center';

const GaugeDetails = () => {
  const [isDetailsCollapsed, setDetailsCollapsed] = React.useState(false);
  const [activeDetailTab, setActiveDetailTab] = React.useState(TableTabs.Gauges);

  const toggleTable = () => {
    setDetailsCollapsed(!isDetailsCollapsed);
  };

  return (
    <Collapsible
      className="max-h-full border-background py-md pl-md data-[state=open]:h-full data-[state=open]:flex-grow"
      open={!isDetailsCollapsed}
      onOpenChange={toggleTable}>
      <Tabs
        className="h-full max-h-full"
        value={activeDetailTab}
        onValueChange={(v) => setActiveDetailTab(v as TableTabs)}>
        <div className="flex justify-between border-l border-t border-b border-background bg-primary">
          <TabsList className="grid h-8 grid-cols-2 border-r border-background bg-black">
            <TabsTrigger className={TABS_TRIGGER_CLASSNAME} value={TableTabs.Gauges}>
              <Typography variant="small-medium">Gauges</Typography>
            </TabsTrigger>
            <TabsTrigger className={TABS_TRIGGER_CLASSNAME} value={TableTabs.Votes}>
              <Typography variant="small-medium">Your Votes</Typography>
            </TabsTrigger>
          </TabsList>
          <CollapsibleTrigger>
            <Button variant={'ghost'} onClick={toggleTable}>
              {isDetailsCollapsed ? <PlusIcon className="h-4 w-4" /> : <MinusIcon className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="h-full flex-grow border border-r-0 border-background bg-secondary border-t-0">
          <div className="h-full flex-grow">
            <TabsContent className="h-full" value={TableTabs.Gauges}>
              <Gauges />
            </TabsContent>
            <TabsContent value={TableTabs.Votes}>
              <Votes />
            </TabsContent>
          </div>
        </CollapsibleContent>
      </Tabs>
    </Collapsible>
  );
};

export default GaugeDetails;
