import { Typography } from '@/components/ui/typography';

type Props = {
  label: string;
  data: React.ReactElement | string;
};

export const PanelInfoRow = ({ label, data }: Props) => {
  return (
    <span className="flex w-full justify-between">
      <Typography variant="small-medium" className="text-muted-foreground">
        {label}
      </Typography>
      {typeof data === 'string' ? (
        <Typography variant="small-medium" className="text-foreground">
          {data}
        </Typography>
      ) : (
        data
      )}
    </span>
  );
};
