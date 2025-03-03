'use client';

import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';
import { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';

interface tooltipProps {
  date: string;
  wbtcPrice: string;
  yearnUsdc: string;
  yearnWbtc: string;
  dwfUsdc: string;
  dwfWbtc: string;
}

const TooltipContent = ({ date, wbtcPrice, yearnUsdc, yearnWbtc, dwfUsdc, dwfWbtc }: tooltipProps) => {
  return (
    <div className="p-2 min-w-[6rem] bg-secondary border-[2px] border-black text-white text-xs flex flex-col gap-2 font-mono font-medium">
      <div>
        <h1 className="text-muted-foreground">Date</h1>
        <p>{date}</p>
      </div>
      <div>
        <h1 className="text-muted-foreground">WBTC Price</h1>
        <p>{wbtcPrice}</p>
      </div>
      <div>
        <h1 className="text-muted-foreground">YEARN PNL</h1>
        <div className="text-[#43E6F2]">
          <p>
            <span className="text-[#16EF94]">+</span> {yearnUsdc} USDC
          </p>
          <p>
            <span className="text-[#16EF94]">+</span> {yearnWbtc} WBTC
          </p>
        </div>
      </div>
      <div>
        <h1 className="text-gray-400">DWF LABS PNL</h1>
        <div>
          <p>
            <span className="text-[#16EF94]">+</span> {dwfUsdc} USDC
          </p>
          <p>
            <span className="text-[#16EF94]">+</span> {dwfWbtc} WBTC
          </p>
        </div>
      </div>
    </div>
  );
};

interface ChartProps {}

const PerformanceChart = ({}: ChartProps) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let root: am5.Root;

    try {
      // Create root element
      const rootElement = am5.Root.new('chartdiv');
      if (!rootElement) {
        throw new Error('Failed to create chart root');
      }
      root = rootElement;

      const myTheme = am5.Theme.new(root);

      myTheme.rule('Grid').setAll({
        strokeOpacity: 0.1,
        stroke: am5.color(0xaaaaaa),
      });

      myTheme.rule('Label').setAll({
        fill: am5.color(0xaaaaaa),
      });

      root.setThemes([am5themes_Animated.new(root), myTheme]);

      let chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: true,
          panY: true,
          wheelX: 'panX',
          wheelY: 'zoomX',
          pinchZoomX: true,
          paddingLeft: 0,
        }),
      );

      const data1 = [];
      const data2 = [];
      let value1 = 100;
      let value2 = 80;

      for (let i = 80000; i <= 100000; i += 5000) {
        value1 = Math.round(Math.random() * 10 - 5 + value1);
        value2 = Math.round(Math.random() * 10 - 5 + value2);
        data1.push({ x: i, y: value1 });
        data2.push({ x: i, y: value2 });
      }

      let xAxis = chart.xAxes.push(
        am5xy.ValueAxis.new(root, {
          maxDeviation: 0,
          min: 80000,
          max: 100000,
          strictMinMax: true,
          renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 50,
            stroke: am5.color(0xffffff),
            strokeWidth: 5,
          }),
          numberFormat: '#',
        }),
      );

      let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          maxDeviation: 0.2,
          renderer: am5xy.AxisRendererY.new(root, {
            minGridDistance: 30,
            stroke: am5.color(0xffffff),
            strokeWidth: 5,
          }),
          numberFormat: "#'%'",
        }),
      );

      function createSeries(color: string, name: string) {
        const series = chart.series.push(
          am5xy.LineSeries.new(root, {
            name: name,
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: 'y',
            valueXField: 'x',
            stroke: am5.color(color),
            tooltip: am5.Tooltip.new(root, {
              getFillFromSprite: false,
              labelHTML: ReactDOMServer.renderToString(
                <TooltipContent
                  date="7 Feb 2025"
                  wbtcPrice="69000.11"
                  yearnUsdc="171.31"
                  yearnWbtc="1.11"
                  dwfUsdc="171.31"
                  dwfWbtc="1.41"
                />,
              ),
              pointerOrientation: 'horizontal',
              background: am5.Rectangle.new(root, {
                fill: am5.color('#202020'),
                fillOpacity: 0,
              }),
            }),
            connect: true,
          }),
        );

        series.strokes.template.setAll({
          strokeWidth: 2,
        });

        series.appear(1000);
        return series;
      }

      let series1 = createSeries('#FFFFFF', 'Maximum');
      let series2 = createSeries('#43E6F2', 'Minimum');

      series1.data.setAll(data1);
      series2.data.setAll(data2);

      let cursor = chart.set(
        'cursor',
        am5xy.XYCursor.new(root, {
          behavior: 'none',
          xAxis: xAxis,
          yAxis: yAxis,
        }),
      );

      cursor.lineX.setAll({
        stroke: am5.color(0xffffff),
        strokeDasharray: [2, 2],
        strokeOpacity: 0.3,
        visible: true,
      });
      cursor.lineY.set('visible', false);

      chart.setAll({
        layout: root.verticalLayout,
      });
    } catch (err) {
      console.error('Error initializing chart:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize chart');
      return;
    }

    return () => {
      if (root) {
        root.dispose();
      }
    };
  }, []);

  if (error) {
    return <div className="text-red-500">Error loading chart: {error}</div>;
  }

  return (
    <div className="w-full relative">
      <div
        id="chartdiv"
        style={{
          width: '100%',
          minHeight: '210px',
          position: 'relative',
          backgroundColor: 'transparent',
        }}
      />
    </div>
  );
};

export default PerformanceChart;
