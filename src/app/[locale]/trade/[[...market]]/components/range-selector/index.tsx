import { animated, useTransition } from '@react-spring/web';
import { AxisBottom } from '@visx/axis';
import { Brush } from '@visx/brush';
import { Bounds } from '@visx/brush/lib/types';
import { RectClipPath } from '@visx/clip-path';
import { LinearGradient } from '@visx/gradient';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Zoom } from '@visx/zoom';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface Domain {
  start: number;
  end: number;
}

interface TransformMatrix {
  scaleX: number;
  scaleY: number;
  translateX: number;
  translateY: number;
  skewX: number;
  skewY: number;
}

const dummyData = Array.from({ length: 70 }, (_, i) => {
  const strikePrice = 1750 + i * 50;
  const value = Math.floor(Math.random() * 100);
  return { strikePrice, value };
});

const width = 422;
const height = 120;

const margin = { top: 0, right: 0, bottom: 30, left: 20 };

const RangeSelector = ({
  data = dummyData,
  markPrice = 2561,
  initialSelectedDomain,
  dimensions = { width, height },
  onDomainChange,
  tickFormatter,
  zoomLevel = 1,
}: {
  data: {
    strikePrice: number;
    value: number;
  }[];
  markPrice: number;
  initialSelectedDomain?: Domain;
  onDomainChange?: (domain?: Domain) => void;
  dimensions?: { width: number; height: number };
  tickFormatter?: (value: number) => string;
  zoomLevel?: number;
}) => {
  const { width, height } = dimensions;
  const xScale = useMemo(
    () =>
      scaleBand({
        domain: data.map((d) => d.strikePrice),
        padding: 0.1,
        range: [margin.left, width],
      }),
    [data, width],
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, Math.max(...data.map((d) => d.value))],
        range: [height - margin.bottom, 0],
        nice: true,
      }),
    [data, height],
  );

  const [selectedDomain, setSelectedDomain] = useState<{ start: number; end: number }>(
    initialSelectedDomain || {
      start: xScale.domain()[0],
      end: xScale.domain()[xScale.domain().length - 1],
    },
  );

  const [percentages, setPercentages] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });

  const [brushPositions, setBrushPositions] = useState<{ start: number; end: number }>(() => {
    const startPosition = xScale(selectedDomain.start) || margin.left;
    const endPosition = (xScale(selectedDomain.end) || width) + (xScale.bandwidth() || 0);
    return { start: startPosition, end: endPosition };
  });

  const onBrushChange = (domain: Bounds | null) => {
    if (!domain) return;

    const { xValues } = domain;

    if (!xValues || xValues.length < 2) return;

    const updatedDomain = {
      start: xValues[0] as number,
      end: xValues[xValues.length - 1] as number,
    };

    setSelectedDomain(updatedDomain);
    onDomainChange?.(updatedDomain);

    updateBrushAndPercentages();
  };

  const zoomRef = useRef<{
    transformMatrix: TransformMatrix;
    setTransformMatrix: (matrix: TransformMatrix) => void;
  }>({
    transformMatrix: {
      scaleX: 1,
      scaleY: 1,
      translateX: 0,
      translateY: 0,
      skewX: 0,
      skewY: 0,
    },
    setTransformMatrix: () => {},
  });

  const zoomedXScale = useMemo(() => {
    const newDomain = xScale.domain();
    const leftRange = margin.left - ((zoomRef.current.transformMatrix.scaleX - 1) * (width - margin.left)) / 2;
    const rightRange = width + ((zoomRef.current.transformMatrix.scaleX - 1) * (width - margin.left)) / 2;

    return scaleBand({
      domain: newDomain,
      padding: xScale.padding(),
      range: [leftRange, rightRange] as [number, number],
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xScale, width, zoomRef.current.transformMatrix]);

  const updateBrushAndPercentages = useCallback(() => {
    const start = zoomedXScale(selectedDomain.start);
    const end = (zoomedXScale(selectedDomain.end) || 0) + (zoomedXScale.bandwidth() || 0);

    setBrushPositions({
      start: start || margin.left,
      end: end || width,
    });

    const startPercentage = ((selectedDomain.start - markPrice) / markPrice) * 100;
    const endPercentage = ((selectedDomain.end - markPrice) / markPrice) * 100;
    setPercentages({ start: startPercentage, end: endPercentage });
  }, [markPrice, selectedDomain.end, selectedDomain.start, width, zoomedXScale]);

  const numTicks = 5;
  const tickValues = useMemo(() => {
    const domain = zoomedXScale.domain();
    const visibleDomain = domain.filter((d) => zoomedXScale(d)! >= 0 && zoomedXScale(d)! <= width);

    if (visibleDomain.length <= numTicks) {
      return visibleDomain;
    }

    const step = (visibleDomain.length - 1) / (numTicks - 1);
    return Array.from({ length: numTicks }, (_, i) => {
      const index = Math.round(i * step);
      return visibleDomain[index];
    });
  }, [zoomedXScale, width, numTicks]);

  useEffect(() => {
    const newTranslateX = (-(zoomLevel - 1) * (width - margin.left)) / 2;
    zoomRef.current.setTransformMatrix({
      ...zoomRef.current.transformMatrix,
      scaleX: zoomLevel,
      translateX: newTranslateX,
    });
    updateBrushAndPercentages();
  }, [width, zoomLevel, selectedDomain, markPrice, updateBrushAndPercentages]);

  const getBarFill = (strikePrice: number) => {
    if (selectedDomain) {
      const { start, end } = selectedDomain;
      if (strikePrice >= start && strikePrice <= end) {
        return strikePrice < markPrice ? '#F83262' : '#16EF94'; // Red if below mark price, green if above
      }
    }
    return '#3C3C3C'; // Grey color if not in the selected range
  };

  yScale.range([height - margin.bottom, 0]);

  const svgHeight = height + margin.bottom;

  const transitions = useTransition(data, {
    keys: (d) => d.strikePrice,
    from: { opacity: 0, y: height, height: 0 },
    enter: (d) => ({ opacity: 1, y: yScale(d.value), height: height - yScale(d.value) }),
    update: (d) => ({ y: yScale(d.value), height: height - yScale(d.value) }),
    leave: { opacity: 0, y: height, height: 0 },
  });

  return (
    <div className="bg-background p-[1px] mx-2" style={{ position: 'relative' }}>
      <Zoom<SVGSVGElement> width={width} height={svgHeight} scaleXMin={1} scaleXMax={4} scaleYMin={1} scaleYMax={1}>
        {(zoom) => {
          zoomRef.current = zoom;

          return (
            <svg className="bg-primary" width={width + 4} height={svgHeight} ref={zoom.containerRef}>
              <RectClipPath id="zoom-clip" width={width} height={height} />
              <LinearGradient id="bar-fill-gradient" from="#000000" to="#000001" />
              <Group clipPath="url(#zoom-clip)">
                {transitions((styles, item, t, i) => (
                  <animated.rect
                    key={`bar-${i}`}
                    x={zoomedXScale(item.strikePrice)}
                    y={styles.y}
                    width={zoomedXScale.bandwidth()}
                    height={styles.height}
                    fill={getBarFill(item.strikePrice)}
                  />
                ))}
              </Group>

              <AxisBottom
                left={0}
                top={height + 4}
                scale={zoomedXScale}
                strokeWidth={1}
                stroke="#6F6F6F"
                tickStroke="#6F6F6F"
                tickLabelProps={() => ({
                  fill: '#6F6F6F',
                  fontSize: 12,
                  textAnchor: 'middle',
                  dy: `0.3em`,
                })}
                hideAxisLine
                tickValues={tickValues}
                tickLength={4}
                tickFormat={(value) => (tickFormatter ? tickFormatter(value) : value.toFixed(2))}
              />

              <Brush
                xScale={zoomedXScale}
                yScale={yScale}
                width={width}
                height={height}
                margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                handleSize={1}
                resizeTriggerAreas={['left', 'right']}
                brushDirection="horizontal"
                onChange={onBrushChange}
                initialBrushPosition={{
                  start: { x: brushPositions.start },
                  end: { x: brushPositions.end },
                }}
                selectedBoxStyle={{
                  fill: 'transparent',
                  stroke: 'transparent',
                }}
                disableDraggingOverlay
                disableDraggingSelection
                useWindowMoveEvents
                renderBrushHandle={({ x, height, isBrushActive }) => {
                  const isStartHandle = Math.abs(x - brushPositions.start) < Math.abs(x - brushPositions.end);
                  const percentage = isStartHandle ? percentages.start : percentages.end;

                  return (
                    <Group className="cursor-ew-resize">
                      <mask
                        id={`path-1-outside-1_1579_397709_${x}`}
                        maskUnits="userSpaceOnUse"
                        x={x + 8}
                        y={-1}
                        width={16}
                        height={height + 2}
                        fill="black">
                        <rect fill="white" x={x - 8} y={-1} width={16} height={height + 2} />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d={`M${x} 10.6729V${height}H${x - 3}V10.6735L${x - 7.96425} 1.75L${x - 7.96425} 0H${x - 3}H${x}H${x + 4.96425}V1.75L${x} 10.6729Z`}
                        />
                      </mask>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d={`M${x} 10.6729V${height}H${x - 3}V10.6735L${x - 7.96425} 1.75L${x - 7.96425} 0H${x - 3}H${x}H${x + 4.96425}V1.75L${x} 10.6729Z`}
                        fill="#EBFF00"
                      />
                      <path
                        d={`M${x} 10.6729L${x - 1.29859} 9.82097L${x - 1.5} 10.1382V10.6729H${x}ZM${x} ${height}V${height + 1}H${x + 1}V${height}H${x}ZM${x - 3} ${height}H${x - 4}V${height + 1}H${x - 3}V${height}ZM${x - 3} 10.6735H${x - 2}V10.3888L${x - 2.20141} 9.82159L${x - 3} 10.6735ZM${x - 7.96425} 1.75L${x - 8.96425} 1.75L${x - 8.96425} 2.08464L${x - 8.16566} 2.35187L${x - 7.96425} 1.75ZM${x - 7.96425} 0V-1H${x - 8.96425}L${x - 8.96425} 5.26679e-06L${x - 7.96425} 0ZM${x + 4.96425} 0H${x + 5.96425}V-1H${x + 4.96425}V0ZM${x + 4.96425} 1.75L${x + 5.76284} 2.35187L${x + 5.96425} 2.08464V1.75H${x + 4.96425}Z`}
                        fill="black"
                        mask={`url(#path-1-outside-1_1579_397709_${x})`}
                      />
                      <g transform={`translate(${x}, 0)`}>
                        <rect x="-15" y="3" width="30" height="20" fill="#000000" opacity={0.7} rx={4} />
                        <text x="0" y="13" fontSize={12} fill="#EBFF00" textAnchor="middle" dominantBaseline="middle">
                          {percentage.toFixed(2)}%
                        </text>
                      </g>
                    </Group>
                  );
                }}
              />
            </svg>
          );
        }}
      </Zoom>
    </div>
  );
};

export default RangeSelector;
