import { useTranslations } from 'next-intl';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Earnings from './earnings';

const Tables = () => {
  const t = useTranslations('xSYK.Staking');
  return (
    <div className="flex flex-col space-y-[1px]">
      <Tabs defaultValue="earnings" className="h-full">
        <TabsList className="h-[32px] w-full justify-start border-b border-background">
          <TabsTrigger className="h-full w-1/4" value="earnings">
            {t('Earnings')}
          </TabsTrigger>
          {/* <TabsTrigger className="h-full w-1/4" value="current_epoch_data">
            {t('EpochData')}
          </TabsTrigger> */}
        </TabsList>
        <TabsContent className="flex flex-col space-y-[1px] min-h-[201px]" value="earnings">
          <Earnings />
        </TabsContent>
        {/* <TabsContent className="flex flex-col space-y-[1px] text-muted-foreground" value="current_epoch_data">
          <EpochData />
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default Tables;
