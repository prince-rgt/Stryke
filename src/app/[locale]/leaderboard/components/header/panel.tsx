import { Typography } from '@/components/ui/typography';

type Props = {
  label: string;
  data: React.ReactNode;
};
const Panel = ({ label, data }: Props) => {
  return (
    <div className="flex w-full justify-between bg-secondary p-md font-mono">
      <Typography variant="extra-small-regular" className="text-muted-foreground capitalize">
        {label}
      </Typography>
      <Typography variant="extra-small-regular" className="text-foreground">
        {data}
      </Typography>
    </div>
  );
};

export default Panel;
