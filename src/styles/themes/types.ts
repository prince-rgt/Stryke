export interface ThemeConfig {
  colors: {
    background: string;
    foreground: string;
    border: string;
    input: string;
    ring: string;
    highlight: string;
    primary: {
      DEFAULT: string;
      foreground: string;
    };
    secondary: {
      DEFAULT: string;
      foreground: string;
    };
    destructive: {
      DEFAULT: string;
      light: string;
      foreground: string;
    };
    success: {
      DEFAULT: string;
      light: string;
      foreground: string;
    };
    selected: {
      DEFAULT: string;
      foreground: string;
    };
    active: {
      DEFAULT: string;
      foreground: string;
    };
    muted: {
      DEFAULT: string;
      foreground: string;
    };
    accent: {
      DEFAULT: string;
      foreground: string;
    };
    subtle: {
      DEFAULT: string;
      foreground: string;
    };
    popover: {
      DEFAULT: string;
      foreground: string;
    };
    card: {
      DEFAULT: string;
      foreground: string;
    };
  };
  borderRadius: {
    custom: string;
    sm: string;
    md: string;
    lg: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
  };
  fonts: {
    sans: string;
    mono: string;
  };
}
