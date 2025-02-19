'use client';

import React, { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';

import numberFormatter from '@/utils/numberFormatter';
import { cn } from '@/utils/styles';

import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';

const chartConfig = {
  pnl: {
    label: 'PNL',
    color: 'hsl(var(--colors-accent-DEFAULT))',
  },
  price: {
    label: 'Mark Price',
    color: 'hsl(var(--colors-accent-DEFAULT))',
  },
} satisfies ChartConfig;

interface Item {
  price: number;
  pnl: number;
}

function findSmallestNonZeroPnlIndex(items: Item[]): number {
  let smallestPnl = Infinity;
  let smallestPnlIndex = -1;

  for (let i = 0; i < items.length; i++) {
    if (items[i].pnl > 0 && items[i].pnl < smallestPnl) {
      smallestPnl = items[i].pnl;
      smallestPnlIndex = i;
    }
  }

  return smallestPnlIndex;
}

function findClosestToMarkPrice(items: Item[], markPrice: number): Item | null {
  if (items.length === 0) {
    return null;
  }

  return items.reduce((closest, current) => {
    const closestDiff = Math.abs(closest.price - markPrice);
    const currentDiff = Math.abs(current.price - markPrice);
    return currentDiff < closestDiff ? current : closest;
  });
}

export default function Chart({
  data,
  markPrice,
  isMemePair,
}: {
  data: { price: number; pnl: number }[];
  markPrice: number;
  isMemePair: boolean;
}) {
  const { minX, minY, x, markPriceX } = useMemo(() => {
    if (data.length !== 0)
      return {
        minX: Math.min(...data.map((d) => d.price)),
        minY: Math.min(...data.map((d) => d.pnl)),
        x: findSmallestNonZeroPnlIndex(data),
        markPriceX: findClosestToMarkPrice(data, markPrice)?.price,
      };

    return {
      minX: 0,
      minY: 0,
      x: 0,
      markPriceX: 0,
    };
  }, [data, markPrice]);

  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={data}
        width={280}
        margin={{
          left: 12,
          right: 12,
        }}>
        <CartesianGrid className="opacity-20" />
        <YAxis
          type="number"
          domain={['dataMax', 'auto']}
          axisLine={false}
          className="text-[10px]"
          width={25}
          tickLine={false}
          tickFormatter={(value) => `${value}`}
          allowDataOverflow
          strokeWidth={minX < 0 ? 0 : 1}
        />
        <XAxis
          dataKey="price"
          tickLine={false}
          axisLine={false}
          domain={['auto', 'auto']}
          tickMargin={5}
          className="text-[10px]"
          minTickGap={15}
          tickFormatter={(value) =>
            numberFormatter({
              value,
              format: 'tokenAmount',
              precision: isMemePair ? 6 : 2,
              showDecimalZerosSubscript: true,
            })
          }
          allowDataOverflow
          strokeWidth={minY < 0 ? 0 : 1}
        />
        <ReferenceLine y={0} stroke="gray" strokeWidth={1.5} strokeOpacity={0.65} />
        <ReferenceLine x={data[x]?.price ?? 0} stroke="gray" strokeWidth={1.5} strokeOpacity={0.65} />
        <ReferenceLine
          x={markPriceX}
          stroke="#808080"
          strokeWidth={1.5}
          strokeDasharray="3 3"
          label={{ value: 'Current Price', fill: 'hsl(var(--colors-foreground))' }}
          className="text-[10px]"
        />
        <ChartTooltip cursor={false} content={<CustomTooltip />} />
        <defs>
          <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--colors-pnl)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-pnl)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area dataKey="pnl" fill="url(#fill)" fillOpacity={0.4} stroke="var(--color-pnl)" />
      </AreaChart>
    </ChartContainer>
  );
}

const CustomTooltip = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Tooltip> &
    React.ComponentProps<'div'> & {
      hideLabel?: boolean;
      hideIndicator?: boolean;
      indicator?: 'line' | 'dot' | 'dashed';
      nameKey?: string;
      labelKey?: string;
    }
>(({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-secondary p-2 rounded-sm text-muted-foreground border-[1px] border-background">
        <p>MARK PRICE</p>
        <p className="text-foreground mb-2">{numberFormatter({ value: label, format: 'usd' })}</p>
        <p>PNL($)</p>
        <p
          className={cn(
            (payload[0].value as number) > 0 ? 'text-success' : 'text-destructive',
          )}>{`$${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
});

CustomTooltip.displayName = 'CustomTooltip';
