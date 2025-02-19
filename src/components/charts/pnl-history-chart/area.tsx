import { curveMonotoneX } from '@visx/curve';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { scaleLinear, scaleTime } from '@visx/scale';
import { AreaClosed, Bar, Line, LinePath } from '@visx/shape';
import { defaultStyles, Tooltip, TooltipWithBounds, withTooltip } from '@visx/tooltip';
import { bisector, extent, max, min, range } from 'd3-array';
import { timeFormat } from 'd3-time-format';
import React, { useMemo } from 'react';

export type Data = {
  date: string;
  value: number;
};

// Util functions
const formatDate = timeFormat('%b %d');
const formatValue = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

// Accessors
const getDate = (d: Data) => new Date(d.date);
const getValue = (d: Data) => d.value;
const bisectDate = bisector<Data, Date>((d) => new Date(d.date)).left;

function reduceArrayToSize(arr: any[], targetSize: number) {
  if (targetSize >= arr.length) {
    return arr; // If target size is greater or equal to the array length, return the original array
  }

  // Generate indices for downsampling
  const indices = range(0, arr.length, arr.length / targetSize);

  // Filter original array based on the generated indices
  const result = indices.map((index) => arr[Math.floor(index)]);

  return result;
}

export type AreaProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  data: Data[];
};

// Styles
const background = '#141414';
const accentColor = '#6F6F6F';
const tooltipStyles = {
  ...defaultStyles,
  background,
  border: '1px solid white',
  color: 'white',
};

export default withTooltip<AreaProps, Data>(
  ({
    width,
    height,
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
    data,
  }) => {
    if (width < 10) return null;

    // Bounds
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Scales
    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [margin.left, innerWidth + margin.left],
          domain: extent(data, getDate) as [Date, Date],
        }),
      [innerWidth, margin.left, data],
    );
    const valueScale = useMemo(
      () =>
        scaleLinear({
          range: [innerHeight + margin.top - 32, margin.top],
          domain: [(min(data, getValue) || 0) - 30, (max(data, getValue) || 0) + 30],
        }),
      [innerHeight, margin.top, data],
    );

    // Tooltip handler
    const handleTooltip = (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = dateScale.invert(x);
      const index = bisectDate(data, x0, 1);
      const d0 = data[index - 1];
      const d1 = data[index];
      let d = d0;
      if (d1 && getDate(d1)) {
        d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;
      }
      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: valueScale(getValue(d)),
      });
    };

    return (
      <div>
        <svg width={width} height={height}>
          <svg width={width} height={height - 32}>
            <defs>
              <LinearGradient id="area-gradient" from={accentColor} to={background} toOpacity={0.1} />
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.2" />
              </pattern>
            </defs>
            <rect x={0} y={0} width={width} height={height} fill={background} />
            <rect x={0} y={0} width={width} height={height} fill="url(#grid)" />
            <AreaClosed<Data>
              data={data}
              x={(d) => dateScale(getDate(d)) ?? 0}
              y={(d) => valueScale(getValue(d)) ?? 0}
              yScale={valueScale}
              strokeWidth={0}
              stroke={accentColor}
              fill="url(#area-gradient)"
              curve={curveMonotoneX}
            />
            <LinePath<Data>
              curve={curveMonotoneX}
              data={data}
              x={(d) => dateScale(getDate(d)) ?? 0}
              y={(d) => valueScale(getValue(d)) ?? 0}
              stroke={'white'}
              strokeWidth={1.5}
            />
            <Bar
              x={margin.left}
              y={margin.top}
              width={innerWidth}
              height={innerHeight}
              fill="transparent"
              onTouchStart={handleTooltip}
              onTouchMove={handleTooltip}
              onMouseMove={handleTooltip}
              onMouseLeave={() => hideTooltip()}
            />
            {tooltipData && (
              <g>
                <Line
                  from={{ x: tooltipLeft, y: margin.top }}
                  to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                  stroke={accentColor}
                  strokeWidth={2}
                  pointerEvents="none"
                  strokeDasharray="5,2"
                />
                <circle
                  cx={tooltipLeft}
                  cy={tooltipTop + 1}
                  r={4}
                  fill="black"
                  fillOpacity={0.1}
                  stroke="black"
                  strokeOpacity={0.1}
                  strokeWidth={2}
                  pointerEvents="none"
                />
                <circle
                  cx={tooltipLeft}
                  cy={tooltipTop}
                  r={4}
                  fill={accentColor}
                  stroke="white"
                  strokeWidth={2}
                  pointerEvents="none"
                />
              </g>
            )}
          </svg>
          <g transform={`translate(0, ${innerHeight + margin.top - 32})`}>
            {data.map((d, i) => {
              const x = dateScale(getDate(d));
              // Include dates only first, last and 5 in between dates
              const latest = data[data.length - 1].date;
              const earliest = data[0].date;
              const reduced = reduceArrayToSize(
                data.map(({ date }) => date),
                5,
              );
              reduced.push(latest);
              reduced.push(earliest);
              return (
                <g key={i}>
                  {reduced.includes(d.date) && ( // Render a tick and label every 5 data points for clarity
                    <text
                      fill={accentColor}
                      x={i === 0 ? x + 20 : i === data.length - 1 ? x - 20 : x}
                      y={15}
                      dy=".32em"
                      fontSize={10}
                      textAnchor="middle">
                      {formatDate(getDate(d))}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
        {tooltipData && (
          <div>
            <TooltipWithBounds key={Math.random()} top={tooltipTop - 12} left={tooltipLeft + 12} style={tooltipStyles}>
              {formatValue(getValue(tooltipData))}
            </TooltipWithBounds>
            <Tooltip
              top={innerHeight + margin.top - 32}
              left={tooltipLeft}
              style={{
                ...defaultStyles,
                minWidth: 72,
                textAlign: 'center',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
              }}>
              {formatDate(getDate(tooltipData))}
            </Tooltip>
          </div>
        )}
      </div>
    );
  },
);
