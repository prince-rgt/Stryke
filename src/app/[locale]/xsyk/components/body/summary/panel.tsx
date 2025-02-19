import { Typography } from '@/components/ui/typography';

type Props = {
  label: React.ReactNode;
  value: React.ReactNode;
};

const Panel = (props: Props) => {
  return (
    <div className="p-md gap-md">
      <Typography as="p" variant="p-medium">
        {props.value}
      </Typography>
      <Typography as="p" variant="small-medium" className="text-muted-foreground uppercase">
        {props.label}
      </Typography>
    </div>
  );
};

export default Panel;
