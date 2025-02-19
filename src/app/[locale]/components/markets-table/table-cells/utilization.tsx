import NumberDisplay from '@/components/ui/number-display';
import { Progress } from '@/components/ui/progress';
import { Typography } from '@/components/ui/typography';

const UtilizationCell = ({ value }: { value: number }) => {
  return (
    <div className="flex justify-between items-center w-full pl-md">
      <Typography variant="small-medium">
        <NumberDisplay value={value} format="percent" />{' '}
      </Typography>
      <div className="w-[40%]">
        <Progress value={value} />
      </div>
    </div>
  );
};

export default UtilizationCell;
