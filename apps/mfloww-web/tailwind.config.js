const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');
const { join } = require('path');
const { screens: defaultScreens, colors: defaultColors } = require('tailwindcss/defaultTheme');

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
        ...defaultScreens
      }
    },
    colors: {
      mfloww_bg: 'var(--app-background)',
      mfloww_fg: 'var(--app-foreground)',
      mfloww_fg_hover: 'var(--app-foreground-hover)',
      mfloww_blue: 'var(--app-blue)',
      mfloww_success: 'var(--app-success)',
      mfloww_warn: 'var(--app-warn)',
      ...defaultColors
    }
  },
  plugins: [],
};
