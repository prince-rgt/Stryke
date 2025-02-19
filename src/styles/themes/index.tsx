import { generateCSSVariables } from './utils';

import { DEFAULT_THEME, themes } from './consts';

import { ThemeConfig } from './types';

export function createTheme(themeName: keyof typeof themes): ThemeConfig {
  return themes[themeName];
}

export const DEFAULT_THEME_CONFIG = createTheme(DEFAULT_THEME);

export const InitialTheme = () => {
  const cssVariables = generateCSSVariables(DEFAULT_THEME_CONFIG);
  const cssString = Object.entries(cssVariables)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n');

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
        :root {
          ${cssString}
        }
      `,
      }}
    />
  );
};
