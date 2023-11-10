/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    publicDir: 'src/public',
    server: {
      host: process.env['SERVER_HOST'],
    },
    ssr: {
      noExternal: '@analogjs/trpc/**',
    },
    build: {
      target: ['es2020'],
    },
    plugins: [
      analog({
        nitro: {
          preset: 'vercel',
        },
        ssr: true,
      }),
      tsConfigPaths({
        root: '../../',
      }),
      splitVendorChunkPlugin(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      cache: {
        dir: `../../node_modules/.vitest`,
      },
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});
