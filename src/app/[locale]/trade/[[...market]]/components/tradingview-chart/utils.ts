function generateTradingViewCSS() {
  const styles = getComputedStyle(document.documentElement);

  function getHSLValue(property: string) {
    const value = styles.getPropertyValue(property).trim();
    return value ? `hsl(${value})` : '';
  }

  let cssContent = `.theme-dark:root {
      --tv-color-platform-background: ${getHSLValue('--colors-secondary-DEFAULT')};
      --tv-color-pane-background: ${getHSLValue('--colors-secondary-DEFAULT')};
      --tv-color-toolbar-button-background-hover: ${getHSLValue('--colors-selected-DEFAULT')};
      --tv-color-toolbar-button-background-expanded: ${getHSLValue('--colors-selected-DEFAULT')};
      --tv-color-toolbar-button-background-active: ${getHSLValue('--colors-accent-DEFAULT')};
      --tv-color-toolbar-button-background-active-hover: ${getHSLValue('--colors-selected-DEFAULT')};
      --tv-color-toolbar-button-text: ${getHSLValue('--colors-subtle-DEFAULT')};
      --tv-color-toolbar-button-text-hover: ${getHSLValue('--colors-foreground')};
      --tv-color-toolbar-button-text-active: ${getHSLValue('--colors-highlight')};
      --tv-color-toolbar-button-text-active-hover: ${getHSLValue('--colors-foreground')};
      --tv-color-item-active-text: ${getHSLValue('--colors-success-DEFAULT')};
      --tv-color-toolbar-toggle-button-background-active: ${getHSLValue('--colors-primary-DEFAULT')};
      --tv-color-toolbar-toggle-button-background-active-hover: ${getHSLValue('--colors-background')};
      --tv-color-toolbar-divider-background: ${getHSLValue('--colors-subtle-DEFAULT')};
      --tv-color-toolbar-save-layout-loader: ${getHSLValue('--colors-subtle-DEFAULT')};
      --tv-color-popup-background: ${getHSLValue('--colors-primary-DEFAULT')};
      --tv-color-popup-element-text: ${getHSLValue('--colors-subtle-DEFAULT')};
      --tv-color-popup-element-text-hover: ${getHSLValue('--colors-foreground')};
      --tv-color-popup-element-background-hover: ${getHSLValue('--colors-selected-DEFAULT')};
      --tv-color-popup-element-divider-background: ${getHSLValue('--colors-subtle-DEFAULT')};
      --tv-color-popup-element-secondary-DEFAULT-text: ${getHSLValue('--colors-foreground')};
      --tv-color-popup-element-hint-text: ${getHSLValue('--colors-subtle-DEFAULT')};
      --tv-color-popup-element-text-active: ${getHSLValue('--colors-highlight')};
      --tv-color-popup-element-background-active: ${getHSLValue('--colors-primary-DEFAULT')};
      --tv-color-popup-element-toolbox-text: ${getHSLValue('--colors-foreground')};
      --tv-color-popup-element-toolbox-text-hover: ${getHSLValue('--colors-highlight')};
      --tv-color-popup-element-toolbox-text-active-hover: ${getHSLValue('--colors-foreground')};
      --tv-color-popup-element-toolbox-background-hover: ${getHSLValue('--colors-destructive-DEFAULT')};
      --tv-color-popup-element-toolbox-background-active-hover: ${getHSLValue('--colors-foreground')};
    }`;

  return cssContent;
}

export function createCSSBlobURL() {
  const cssContent = generateTradingViewCSS();
  const blob = new Blob([cssContent], { type: 'text/css' });
  return URL.createObjectURL(blob);
}

export function getBackgroundColorString(): string {
  const styles = getComputedStyle(document.documentElement);
  const hslValue = styles.getPropertyValue('--colors-primary-DEFAULT').trim();

  if (!hslValue) {
    return 'rgb(0, 0, 0)'; // Default to black if the variable is not set
  }

  // Split the HSL values
  const [hue, saturation, lightness] = hslValue.split(' ');

  // Convert HSL to RGB
  const h = parseInt(hue) / 360;
  const s = parseInt(saturation.replace('%', '')) / 100;
  const l = parseInt(lightness.replace('%', '')) / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  // Convert RGB values to 0-255 range
  const toRGB = (x: number) => Math.round(x * 255);

  return `rgb(${toRGB(r)}, ${toRGB(g)}, ${toRGB(b)})`;
}
