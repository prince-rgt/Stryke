'use client';

// Reference https://usehooks.com/useMedia/
import { ReactNode, useEffect, useState } from 'react';

function useMedia(queries: string[], values: ReactNode[], defaultValue?: ReactNode) {
  // // Array containing a media query list for each query
  // const mediaQueryLists = queries.map((q) => window?.matchMedia(q));
  // // Function that gets value based on matching media query
  // const getValue = () => {
  //   // Get index of first media query that matches
  //   const index = mediaQueryLists.findIndex((mql) => mql.matches);
  //   // Return related value or defaultValue if none
  //   return typeof values[index] !== 'undefined' ? values[index] : defaultValue;
  // };

  const getValue = () => {
    if (typeof window !== 'undefined') {
      // Array containing a media query list for each query
      const mediaQueryLists = queries.map((q) => window.matchMedia(q));

      // Get index of first media query that matches
      const index = mediaQueryLists.findIndex((mql) => mql.matches);

      // Return related value or defaultValue if none
      return typeof values[index] !== 'undefined' ? values[index] : defaultValue;
    }

    // Return defaultValue if window is not defined (server-side)
    return defaultValue;
  };

  // State and setter for matched value
  const [value, setValue] = useState(getValue);

  useEffect(
    () => {
      let mediaQueryLists: any[] = [];

      if (typeof window !== 'undefined') {
        // Array containing a media query list for each query
        mediaQueryLists = queries.map((q) => window.matchMedia(q));
      }

      // Event listener callback
      // Note: By defining getValue outside of useEffect we ensure that it has ...
      // ... current values of hook args (as this hook only runs on mount/dismount).
      const handler = () => setValue(getValue);
      // Set a listener for each media query with above handler as callback.
      mediaQueryLists.forEach((mql) => mql.addListener(handler));
      // Remove listeners on cleanup
      return () => mediaQueryLists.forEach((mql) => mql.removeListener(handler));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [], // Empty array ensures effect is only run on mount and unmount
  );
  return value;
}

const BREAKPOINT_QUERIES = {
  Desktop: '(min-width: 1024px)',
  Mobile: '(max-width: 767px)',
};

export enum ScreenTypeEnum {
  Desktop = 'DESKTOP',
  Mobile = 'MOBILE',
}

export type UseScreenReturnType = {
  screen: ScreenTypeEnum;
  isDesktop: boolean;
  isMobile: boolean;
};

function useScreen(): UseScreenReturnType {
  const screen = useMedia(
    [BREAKPOINT_QUERIES.Desktop, BREAKPOINT_QUERIES.Mobile],
    [ScreenTypeEnum.Desktop, ScreenTypeEnum.Mobile],
    ScreenTypeEnum.Desktop,
  ) as ScreenTypeEnum;

  const isDesktop = screen === ScreenTypeEnum.Desktop;
  const isMobile = screen === ScreenTypeEnum.Mobile;

  return { screen, isDesktop, isMobile };
}

export default useScreen;
