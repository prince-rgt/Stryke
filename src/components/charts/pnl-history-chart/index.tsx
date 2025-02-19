import { ParentSize } from '@visx/responsive';
import { ClassAttributes } from 'react';

import AreaChart, { Data } from './area';

function PnlHistoryChart({ data, className }: { data: Data[]; className?: string }) {
  return (
    <ParentSize className={className}>{({ width }) => <AreaChart data={data} height={250} width={width} />}</ParentSize>
  );
}

export default PnlHistoryChart;
