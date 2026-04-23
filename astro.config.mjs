import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// VELYOS — Astro config
// Docs: https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
    // User site on GitHub Pages: https://stepanmanda.github.io/
    // Po migraci na velyos.ai změnit pouze tuto hodnotu.
    site: 'https://stepanmanda.github.io',
    trailingSlash: 'never',
    build: {
        format: 'file', // generuje /firmy.html místo /firmy/index.html — hezčí URL pro statický hosting
    },
    devToolbar: {
        enabled: false, // bez Astro devbaru, má vlastní vizuál (preview ribbon)
    },
    integrations: [
        sitemap({
            changefreq: 'monthly',
            priority: 0.7,
            lastmod: new Date(),
        }),
    ],
});
