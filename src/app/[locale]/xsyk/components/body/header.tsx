import { useTranslations } from 'next-intl';

import { Typography } from '@/components/ui/typography';

const Header = () => {
  const t = useTranslations('xSYK.Banner');
  return (
    <div className="w-full flex flex-col p-lg gap-md">
      <Typography as="h1" variant="h4-bold">
        {t('Heading.Text')} <i className="text-highlight not-italic">{t('Heading.Emphasized')}</i>
      </Typography>
      <Typography as="p" variant="p-medium" className="text-muted-foreground">
        {t('Body')}
      </Typography>
    </div>
  );
};

export default Header;
