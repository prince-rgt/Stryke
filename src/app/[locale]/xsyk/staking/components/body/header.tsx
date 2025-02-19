import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { Typography } from '@/components/ui/typography';

const Header = () => {
  const t = useTranslations('xSYK.Staking.Banner');
  return (
    <div className="w-full flex flex-col p-lg gap-md">
      <span className="flex space-x-2 items-center">
        <Image src="/images/misc/staking_plugin.svg" alt="stake_icon" width={50} height={50} />
        <Typography as="h1" variant="h4-bold">
          {t('Heading.Text')} <i className="text-highlight not-italic">{t('Heading.Emphasized')}</i>
        </Typography>
      </span>
      <Typography as="p" variant="p-medium" className="text-muted-foreground">
        {t('Body')}
      </Typography>
    </div>
  );
};

export default Header;
