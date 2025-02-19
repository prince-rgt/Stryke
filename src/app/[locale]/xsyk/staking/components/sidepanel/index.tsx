import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import QuickLinks from './quick-links';
import StakeTab from './stake-tab';
import UnstakeTab from './unstake-tab';

const Sidepanel = () => {
  return (
    <div className="flex flex-col space-y-[1px] bg-secondary h-full divide-y divide-background">
      <Tabs defaultValue="stake" className="w-[401px] h-full">
        <TabsList className="w-full border-b border-background">
          <TabsTrigger className="h-full w-1/2" value="stake">
            Stake
          </TabsTrigger>
          <TabsTrigger className="h-full w-1/2" value="unstake">
            Unstake
          </TabsTrigger>
        </TabsList>
        <TabsContent className="text-muted-foreground" value="stake">
          <StakeTab />
        </TabsContent>
        <TabsContent className="text-muted-foreground" value="unstake">
          <UnstakeTab />
        </TabsContent>
      </Tabs>
      <QuickLinks />
    </div>
  );
};

export default Sidepanel;
