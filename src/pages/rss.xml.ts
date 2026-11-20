import type { APIRoute } from 'astro';
import rss from '@astrojs/rss';
import { publicWriting } from '../config/content';
import { site } from '../config/site';

export const GET: APIRoute = async ({ site: origin }) => rss({
  title: `${site.name} · Writing`,
  description: site.writingDescription,
  site: origin!,
  customData: '<language>zh-CN</language>',
  items: (await publicWriting()).map(({ id, data }) => ({
    title: data.title,
    description: data.description,
    pubDate: data.publishedAt,
    link: `/writing/${id}/`,
    categories: [data.category, ...data.tags],
  })),
});
