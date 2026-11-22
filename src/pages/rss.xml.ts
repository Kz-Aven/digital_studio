import type { APIRoute } from 'astro';
import rss from '@astrojs/rss';
import { writing, writingTopics } from '../config/writing';
import { site } from '../config/site';

export const GET: APIRoute = ({ site: origin }) => rss({
  title: `${site.name} · 文章`,
  description: site.writingDescription,
  site: origin!,
  customData: '<language>zh-CN</language>',
  items: writing.map((entry) => ({
    title: entry.title,
    description: entry.excerpt,
    pubDate: entry.publishedAt ? new Date(entry.publishedAt) : undefined,
    link: entry.sourceUrl,
    categories: [writingTopics[entry.topic].label, ...entry.tags],
  })),
});
