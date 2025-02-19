'use client';

import type { ElementRef } from 'react';
import { SupportedChainIdType } from '@/types';

import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  ResolutionString,
  widget,
} from '@/../public/charting_library';
import { noop } from 'lodash';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/utils/styles';
import { createCSSBlobURL, getBackgroundColorString } from './utils';

import {
  TV_CHART_RELOAD_INTERVAL,
  TV_CHART_RELOAD_TIMESTAMP_KEY,
} from '@/app/[locale]/trade/[[...market]]/components/tradingview-chart/consts';
import useDatafeed from '@/app/[locale]/trade/[[...market]]/components/tradingview-chart/useDatafeed';

import useLocalStorage from '@/app/[locale]/hooks/useLocalStorage';

import { ONBOARDING_STEPS_CLASSES } from '../onboarding-flow/consts';

type ChartSettings = {
  interval: ResolutionString;
};

const TradingViewChart = ({ ticker, chainId }: { ticker: string; chainId: number }) => {
  const containerRef = useRef<ElementRef<'div'>>(null);
  const widgetRef = useRef<IChartingLibraryWidget | null>(null);
  const [cssBlobURL, setCssBlobURL] = useState<string | null>(null);

  useEffect(() => {
    const url = createCSSBlobURL();
    setCssBlobURL(url);

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, []);

  const [settings, setSettings] = useLocalStorage<ChartSettings>('chart-settings', {
    // Add more settings as needed here
    interval: '4H' as ResolutionString,
  });

  const { datafeed, resetCache } = useDatafeed({ chainId: chainId as SupportedChainIdType });

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        localStorage.setItem(TV_CHART_RELOAD_TIMESTAMP_KEY, Date.now().toString());
      } else {
        const tvReloadTimestamp = Number(localStorage.getItem(TV_CHART_RELOAD_TIMESTAMP_KEY));
        if (tvReloadTimestamp && Date.now() - tvReloadTimestamp > TV_CHART_RELOAD_INTERVAL) {
          if (resetCache) {
            resetCache();
            widgetRef.current?.activeChart().resetData();
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [resetCache]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        localStorage.setItem(TV_CHART_RELOAD_TIMESTAMP_KEY, Date.now().toString());
      } else {
        const tvReloadTimestamp = Number(localStorage.getItem(TV_CHART_RELOAD_TIMESTAMP_KEY));
        if (tvReloadTimestamp && Date.now() - tvReloadTimestamp > TV_CHART_RELOAD_INTERVAL) {
          if (resetCache) {
            resetCache();
            widgetRef.current?.activeChart().resetData();
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [resetCache]);

  useEffect(() => {
    if (!containerRef.current || !cssBlobURL) return;
    const backgroundColorString = getBackgroundColorString();

    let _options: ChartingLibraryWidgetOptions = {
      theme: 'dark',
      symbol: ticker,
      interval: settings.interval,
      time_frames: [
        { text: '1d', resolution: settings.interval, description: '1 Day' },
        { text: '1w', resolution: settings.interval, description: '1 Week' },
        { text: '1m', resolution: settings.interval, description: '1 Month' },
      ],
      library_path: '/charting_library/',
      locale: 'en',
      charts_storage_url: 'https://saveload.tradingview.com',
      charts_storage_api_version: '1.1',
      client_id: 'tradingview.com',
      user_id: 'public_user_id',
      fullscreen: false,
      autosize: true,
      options: {},
      settings_adapter: {
        initialSettings: settings,
        setValue: (key, value) => {
          if (key == 'chart.lastUsedTimeBasedResolution') setSettings({ interval: value as ResolutionString });
        },
        removeValue: noop,
      },
      // @ts-ignore
      datafeed,
      container: containerRef.current,
      disabled_features: [
        'header_saveload',
        'header_settings',
        'show_right_widgets_panel_by_default',
        'use_localstorage_for_settings',
        'volume_force_overlay',
        'create_volume_indicator_by_default',
        'header_compare',
        'display_market_status',
        'show_interval_dialog_on_key_press',
        'header_symbol_search',
        'popup_hints',
        'header_in_fullscreen_mode',
        'use_localstorage_for_settings',
        'right_bar_stays_on_scroll',
        'symbol_info',
        'mouse_wheel_scale',
      ],
      enabled_features: [
        'side_toolbar_in_fullscreen_mode',
        'header_in_fullscreen_mode',
        'hide_resolution_in_legend',
        'items_favoriting',
        'show_zoom_and_move_buttons_on_touch',
        'pinch_scale',
      ],
      loading_screen: {
        backgroundColor: backgroundColorString,
        foregroundColor: backgroundColorString,
      },
      overrides: {
        'paneProperties.backgroundGradientStartColor': backgroundColorString,
        'paneProperties.backgroundGradientEndColor': backgroundColorString,
      },
      custom_css_url: cssBlobURL,
    };

    const _widget = new widget(_options);

    _widget.onChartReady(() => {
      widgetRef.current = _widget;
    });

    return () => {
      if (widgetRef.current) {
        widgetRef.current.remove();
        widgetRef.current = null;
      }
    };
  }, [cssBlobURL, datafeed, setSettings, settings, ticker]);

  return <div className={cn(ONBOARDING_STEPS_CLASSES['priceChart'], 'h-full w-full')} ref={containerRef} />;
};

export default TradingViewChart;
