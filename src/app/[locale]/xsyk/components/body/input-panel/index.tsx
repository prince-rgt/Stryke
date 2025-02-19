'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConvertTab from '@/app/[locale]/xsyk/components/body/input-panel/convert-tab';
import RedeemTab from '@/app/[locale]/xsyk/components/body/input-panel/redeem-tab';

const InputPanel = () => {
  return (
    <div className="flex flex-col space-y-[1px]">
      <Tabs defaultValue="convert">
        <TabsList className="w-full border-b border-background">
          <TabsTrigger className="h-full w-1/2" value="convert">
            Convert
          </TabsTrigger>
          <TabsTrigger className="h-full w-1/2" value="redeem">
            Redeem
          </TabsTrigger>
        </TabsList>
        <TabsContent className="flex flex-col mt-[1px] space-y-[1px] text-muted-foreground" value="convert">
          <ConvertTab />
        </TabsContent>
        <TabsContent className="flex flex-col space-y-[1px] text-muted-foreground" value="redeem">
          <RedeemTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InputPanel;
