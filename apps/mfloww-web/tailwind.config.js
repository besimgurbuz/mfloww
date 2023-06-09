const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');
const defaultTheme = require('tailwindcss/defaultTheme');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      screens: {
        xs: '475px',
      },
      colors: {
        mfloww_bg: {
          300: '#1A2026',
          500: 'var(--app-background)',
          DEFAULT: 'var(--app-background)',
        },
        mfloww_fg: {
          300: 'var(--app-foreground-hover)',
          500: 'var(--app-foreground)',
          DEFAULT: 'var(--app-foreground)',
        },
        mfloww_fg_hover: 'var(--app-foreground-hover)',
        mfloww_blue: 'var(--app-blue)',
        mfloww_white: 'var(--app-white)',
        mfloww_success: 'var(--app-success)',
        mfloww_warn: 'var(--app-warn)',
        mfloww_fatal: 'var(--app-fatal)',
      },
      fontFamily: {
        sans: ["'Krona One'", ...defaultTheme.fontFamily.sans],
        roboto: ['Roboto', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        grow_x: {
          '0%': {
            width: '0%',
          },
        },
      },
      animation: {
        grow_x: 'grow_x 1s ease-in-out',
      },
    },
  },
  plugins: [],
};
