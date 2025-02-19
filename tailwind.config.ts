import type { Config } from 'tailwindcss';

const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette');

const config = {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        open_sans: ['var(--fonts-open-sans)'],
        sans: [
          'var(--fonts-sans)',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        mono: [
          'var(--fonts-mono)',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },
      colors: {
        border: 'hsl(var(--colors-border) / <alpha-value>)',
        input: 'hsl(var(--colors-input) / <alpha-value>)',
        ring: 'hsl(var(--colors-ring) / <alpha-value>)',
        background: 'hsl(var(--colors-background) / <alpha-value>)',
        foreground: 'hsl(var(--colors-foreground) / <alpha-value>)',
        highlight: 'hsl(var(--colors-highlight) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--colors-primary-DEFAULT) / <alpha-value>)',
          foreground: 'hsl(var(--colors-primary-foreground) / <alpha-value>)',
        },
        active: {
          DEFAULT: 'hsl(var(--colors-active-DEFAULT) / <alpha-value>)',
          foreground: 'hsl(var(--colors-active-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--colors-secondary-DEFAULT) / <alpha-value>)',
          foreground: 'hsl(var(--colors-secondary-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--colors-destructive-DEFAULT) / <alpha-value>)',
          light: 'hsl(var(--colors-destructive-light) / <alpha-value>)',
          foreground: 'hsl(var(--colors-destructive-foreground) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'hsl(var(--colors-success-DEFAULT) / <alpha-value>)',
          light: 'hsl(var(--colors-success-light) / <alpha-value>)',
          foreground: 'hsl(var(--colors-success-foreground) / <alpha-value>)',
        },
        selected: {
          DEFAULT: 'hsl(var(--colors-selected-DEFAULT) / <alpha-value>)',
          foreground: 'hsl(var(--colors-selected-foreground) / <alpha-value>)',
        },
        subtle: {
          DEFAULT: 'hsl(var(--colors-subtle-DEFAULT) / <alpha-value>)',
          foreground: 'hsl(var(--colors-subtle-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--colors-muted-DEFAULT) / <alpha-value>)',
          foreground: 'hsl(var(--colors-muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--colors-accent-DEFAULT) / <alpha-value>)',
          foreground: 'hsl(var(--colors-accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--colors-popover-DEFAULT) / <alpha-value>)',
          foreground: 'hsl(var(--colors-popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--colors-card-DEFAULT) / <alpha-value>)',
          foreground: 'hsl(var(--colors-card-foreground) / <alpha-value>)',
        },
      },
      borderRadius: {
        lg: 'var(--borderRadius-lg)',
        md: 'var(--borderRadius-md)',
        sm: 'var(--borderRadius-sm)',
        custom: 'var(--borderRadius-custom)',
      },
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
      },
      backgroundImage: {
        'rgby-gradient':
          "url('/rgby-gradient.svg'),radial-gradient(circle at top left, rgba(22, 239, 148, 0.1) 0%, transparent 90%), radial-gradient(circle at top right, rgba(235, 255, 0, 0.2) 0%, transparent 100%), radial-gradient(circle at bottom right, rgba(67, 230, 242, 0.2) 0%, transparent 100%), radial-gradient(circle at bottom left, rgba(248, 50, 98, 0.2) 0%, transparent 100%), linear-gradient(to bottom, #FFFFFF, #FFFFFF)",
        'x-logo': "url('/x-bg.png')",
        'discord-logo': "url('/discord-bg.png')",
        'alert-gradient': ` radial-gradient(at 100% 100%, rgba(235, 255, 0, 0.1) 0%, rgba(235, 255, 0, 0) 100%),
        radial-gradient(at 0% 0%, rgba(22, 239, 148, 0.014) 0%, rgba(235, 255, 0, 0) 100%)`,
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        blur: {
          '0%': { filter: 'blur(0)' },
          '50%': { filter: 'blur(10px)' },
          '100%': { filter: 'blur(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        blur: 'blur 2s infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), addVariablesForColors],
} satisfies Config;

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme('colors'));
  let newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]));

  addBase({
    ':root': newVars,
  });
}

export default config;
