import { FONTS } from '@/styles/themes/consts';

export const generateCSSVariables = (obj: any, prefix = ''): { [key: string]: string } => {
  let cssVariables: { [key: string]: string } = {};
  for (const key in obj) {
    if (key === 'fonts') {
      // Skip fonts that are in the FONTS enum (i.e., loaded fonts)
      for (const fontKey in obj[key]) {
        if (!Object.values(FONTS).includes(obj[key][fontKey] as FONTS)) {
          cssVariables[`--${prefix}${key}-${fontKey}`] = obj[key][fontKey];
        }
      }
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      const nestedVariables = generateCSSVariables(obj[key], `${prefix}${key}-`);
      cssVariables = { ...cssVariables, ...nestedVariables };
    } else {
      const value = obj[key].toString();
      const cssValue = value.startsWith('hsl(') ? value.replace('hsl(', '').replace(')', '') : value;
      cssVariables[`--${prefix}${key}`] = cssValue;
    }
  }
  return cssVariables;
};

export const applyCSSVariables = (variables: { [key: string]: string }, target: HTMLElement | null = null) => {
  const root = target || document.documentElement;
  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};
