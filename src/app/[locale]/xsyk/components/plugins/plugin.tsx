import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

type Props = {
  title: string;
  body: string;
  cta: { url: string; label: string };
  icon?: React.ReactNode;
};

const Plugin = (props: Props) => {
  const { title, body, cta, icon } = props;

  return (
    <div className="flex flex-col p-md bg-secondary space-y-md">
      <div className="flex space-x-md">
        {icon ? icon : null}
        <span className="flex flex-col">
          <Typography variant="p-bold">{title}</Typography>
          <Typography variant="p-medium" className="text-muted-foreground">
            {body}
          </Typography>
        </span>
      </div>
      <Link href={cta.url} rel="noopener noreferrer" className="w-fit">
        <Button role="link" variant="secondary" size="sm">
          {cta.label}
        </Button>
      </Link>
    </div>
  );
};

export default Plugin;
