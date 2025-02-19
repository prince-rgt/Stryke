'use client';

import { MinusIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Typography } from '@/components/ui/typography';
import VestingPositions from '@/app/[locale]/xsyk/components/body/tables/vesting-positions';

import useXSykData from '@/app/[locale]/xsyk/hooks/useXSykData';

const Tables = () => {
  const [isTableCollapsed, setTableCollapsed] = useState(false);

  const { vestedPositionsCount } = useXSykData();

  const toggleTable = () => {
    setTableCollapsed(!isTableCollapsed);
  };

  return (
    <Collapsible
      className="data-[state=open]:flex-grow data-[state=open]:h-full max-h-full"
      open={!isTableCollapsed}
      onOpenChange={toggleTable}>
      <Tabs className="max-h-full h-full divide-y divide-background" defaultValue="vesting">
        <div className="flex bg-primary justify-between">
          <TabsList className="h-8">
            <TabsTrigger className="h-full gap-md" value="vesting">
              <Typography variant="small-medium">Vesting</Typography>
              {vestedPositionsCount > 0 ? (
                <Typography className="px-1 rounded-sm bg-foreground text-background font-mono" variant="small-medium">
                  {vestedPositionsCount}
                </Typography>
              ) : null}
            </TabsTrigger>
            {/* <TabsTrigger className="h-full hover:cursor-not-allowed" value="cross" disabled>
              <Typography variant="small-medium">[Redacted]</Typography>
            </TabsTrigger> */}
          </TabsList>
          <CollapsibleTrigger className="p-2">
            {isTableCollapsed ? <PlusIcon className="w-4 h-4" /> : <MinusIcon className="w-4 h-4" />}
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="flex-grow h-full">
          <TabsContent className="h-full" value="vesting">
            <VestingPositions />
          </TabsContent>
          {/*** @todo: implement cross-chain interactions ***/}
          {/* <TabsContent value="cross">Cross-Chain</TabsContent> */}
        </CollapsibleContent>
      </Tabs>
    </Collapsible>
  );
};

export default Tables;
