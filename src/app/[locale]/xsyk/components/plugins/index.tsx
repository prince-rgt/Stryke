import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { Typography } from '@/components/ui/typography';

import VedpxConverter from '../vedpx-converter';
import Plugin from './plugin';

const Plugins = () => {
  const t = useTranslations('xSYK.Plugins.Staking');
  const t2 = useTranslations('xSYK.Plugins.Voting');

  return (
    <div className="w-1/2 p-md flex flex-col space-y-md">
      <Typography variant="p-bold">Available Plugins</Typography>
      <Plugin
        title={t('Heading')}
        body={t('Body')}
        cta={{
          url: '/xsyk/staking',
          label: t('ctaLabel'),
        }}
        icon={<Image src="/images/misc/staking_plugin.svg" height={32} width={32} alt="staking" />}
      />
      {/** Hacked, to fix */}
      <div className="flex-grow">
        <Plugin
          title={t2('Heading')}
          body={t2('Body')}
          cta={{
            url: '/gauges',
            label: t2('ctaLabel'),
          }}
        />
      </div>
      {/*** @note add additional plugins here ***/}
      <VedpxConverter />
    </div>
  );
};

export default Plugins;
