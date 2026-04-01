// astro.config.mjs
import { defineConfig } from 'astro/config';
import pagefind from 'astro-pagefind';

export default defineConfig({
  site: 'https://orgpulse.io',
  output: 'static',
  integrations: [pagefind()],
  vite: {
    build: {
      rollupOptions: {
        external: [/\/pagefind\//],
      },
    },
  },
});
