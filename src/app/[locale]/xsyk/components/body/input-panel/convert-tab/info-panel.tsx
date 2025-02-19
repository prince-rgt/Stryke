import { TimerIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Typography } from '@/components/ui/typography';

const InfoPanel = ({ i18nKey }: { i18nKey: string }) => {
  const t = useTranslations(i18nKey);

  return (
    <div className="bg-alert-gradient p-md rounded-sm space-y-md border border-white/10">
      <span className="flex gap-x-md text-foreground">
        <TimerIcon width={16} height={16} />
        <Typography variant="small-medium" className="my-auto">
          {t('Heading')}
        </Typography>
      </span>
      <Typography variant="small-medium">{t('Body')}</Typography>
    </div>
  );
};

export default InfoPanel;
