import { Typography } from '@/components/ui/typography';

type Props = {
  label: React.ReactNode;
  value?: React.ReactNode;
  prop?: React.ReactElement;
};

const Panel = (props: Props) => {
  return (
    <div className="flex flex-row items-center justify-between gap-md p-md">
      <Typography as="p" variant="extra-small-regular" className="uppercase text-muted-foreground">
        {props.label}
      </Typography>
      {props.value ? (
        <Typography as="p" variant="extra-small-regular">
          {props.value}
        </Typography>
      ) : (
        props.prop
      )}
    </div>
  );
};

export default Panel;
