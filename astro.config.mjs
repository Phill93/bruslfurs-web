import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL || 'https://brusler-furs.de',
  output: 'static',
  integrations: [sitemap()],
  build: { format: 'directory' },
});
