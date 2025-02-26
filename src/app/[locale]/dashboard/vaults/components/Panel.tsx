import { Typography } from '@/components/ui/typography';

type Props = {
  label: React.ReactNode;
  value?: React.ReactNode;
  prop?: React.ReactElement;
  labelClasses?: string;
};

const Panel = (props: Props) => {
  return (
    <div className={`flex flex-row items-center justify-between gap-md p-md`}>
      <div className={`${props.labelClasses}`}>
        <Typography as="p" variant="extra-small-regular" className="uppercase text-muted-foreground">
          {props.label}
        </Typography>
      </div>
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
