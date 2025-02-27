'use client';

import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';
import { useEffect, useState } from 'react';

interface ChartProps {
  // Add any props you need
}

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

      // Configure theme for better grid visibility and text color
      myTheme.rule('Grid').setAll({
        strokeOpacity: 0.1,
        stroke: am5.color(0xaaaaaa), // Lighter grey for grid
      });

      // Set text color for all labels
      myTheme.rule('Label').setAll({
        fill: am5.color(0xaaaaaa), // Greyish-white for text
      });

      // Set themes
      root.setThemes([am5themes_Animated.new(root), myTheme]);

      // Create chart
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

      // Generate data for two series
      const data1 = [];
      const data2 = [];
      let value1 = 100;
      let value2 = 80;

      // Generate data from 80000 to 100000
      for (let i = 80000; i <= 100000; i += 5000) {
        value1 = Math.round(Math.random() * 10 - 5 + value1);
        value2 = Math.round(Math.random() * 10 - 5 + value2);
        data1.push({
          x: i,
          y: value1,
        });
        data2.push({
          x: i,
          y: value2,
        });
      }

      // Create axes
      let xAxis = chart.xAxes.push(
        am5xy.ValueAxis.new(root, {
          maxDeviation: 0,
          min: 80000,
          max: 100000,
          strictMinMax: true,
          renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 50,
            strokeOpacity: 0.1,
          }),
          numberFormat: '#',
        }),
      );

      let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          maxDeviation: 0.2,
          renderer: am5xy.AxisRendererY.new(root, {
            minGridDistance: 30,
            strokeOpacity: 0.1,
          }),
          numberFormat: "#'%'",
        }),
      );

      // Create series
      function createSeries(color: string) {
        const series = chart.series.push(
          am5xy.LineSeries.new(root, {
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: 'y',
            valueXField: 'x',
            stroke: am5.color(color),
            tooltip: am5.Tooltip.new(root, {
              labelText: '{valueY}%',
              pointerOrientation: 'horizontal',
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

      // Add two series with specified colors
      let series1 = createSeries('#FFFFFF'); // White
      let series2 = createSeries('#43E6F2'); // Cyan

      series1.data.setAll(data1);
      series2.data.setAll(data2);

      // Add cursor
      let cursor = chart.set(
        'cursor',
        am5xy.XYCursor.new(root, {
          behavior: 'none',
          xAxis: xAxis,
          yAxis: yAxis,
        }),
      );
      cursor.lineY.set('visible', false);

      // Set initial zoom to show all values
      xAxis.zoomToValues(80000, 100000);

      // Make chart responsive
      chart.setAll({
        layout: root.verticalLayout,
      });
    } catch (err) {
      console.error('Error initializing chart:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize chart');
      return;
    }

    // Cleanup on unmount
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
          //   height: "250px",
          minHeight: '150px',
          position: 'relative',
          backgroundColor: 'transparent',
        }}
      />
    </div>
  );
};

export default PerformanceChart;
