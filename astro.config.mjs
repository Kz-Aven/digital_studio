import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const site = process.env.SITE_URL || 'https://digital-studio-dbr.pages.dev';

export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (url) => !['/search/', '/404/', '/404.html'].includes(new URL(url).pathname) })],
  vite: { plugins: [tailwindcss()] },
  markdown: {
    processor: satteri({
      mdastPlugins: [{
        html(node, context) { context.removeNode(node); },
      }],
      hastPlugins: [{
        element: [
          {
            filter: ['table'],
            visit(node, context) {
              context.wrapNode(node, {
                type: 'element',
                tagName: 'div',
                properties: { className: ['prose-table'], tabIndex: 0, role: 'region', ariaLabel: '表格，可横向滚动' },
                children: [],
              });
            },
          },
          {
            filter: ['img'],
            visit(node, context) {
              context.setProperty(node, 'loading', 'lazy');
              context.setProperty(node, 'decoding', 'async');
            },
          },
        ],
      }],
    }),
  },
});
