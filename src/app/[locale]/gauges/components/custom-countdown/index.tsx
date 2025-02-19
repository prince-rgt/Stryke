import React from 'react';
import Countdown, { CountdownRenderProps } from 'react-countdown';

import { Typography, TypographyProps } from '@/components/ui/typography';

type TypographyVariant = NonNullable<TypographyProps['variant']>;

interface CustomCountdownProps {
  date: number | string | Date;
  variant: TypographyVariant;
  onComplete?: () => void;
}

const CustomCountdown: React.FC<CustomCountdownProps> = ({ date, variant, onComplete }) => {
  const renderer = ({ days, hours, minutes, completed }: CountdownRenderProps) => {
    if (completed) {
      if (date === 1000) return <Typography variant={variant}>GENESIS HAS NOT BEEN SET</Typography>;
      return <Typography variant={variant}>EPOCH ENDED</Typography>;
    } else {
      return (
        <Typography variant={variant}>
          {days}d {hours}h {minutes}m
        </Typography>
      );
    }
  };

  return <Countdown date={date} renderer={renderer} onComplete={onComplete} />;
};

export default CustomCountdown;
