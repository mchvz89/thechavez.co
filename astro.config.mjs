import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://thechavez.co',
  outDir: './docs',
  integrations: [tailwind()],
});
