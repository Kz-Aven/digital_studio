import { getCollection, type CollectionKey } from 'astro:content';

export function publicEntries<C extends CollectionKey>(collection: C) {
  return getCollection(collection, ({ data, body }) => !data.draft && Boolean(body?.trim()));
}

export async function publicWork() {
  const entries = await publicEntries('work');
  return entries.sort((a, b) =>
    (a.data.order ?? Infinity) - (b.data.order ?? Infinity)
    || (b.data.publishedAt?.valueOf() ?? 0) - (a.data.publishedAt?.valueOf() ?? 0)
    || a.id.localeCompare(b.id),
  );
}

export async function publicStudio() {
  const entries = await publicEntries('studio');
  return entries.sort((a, b) =>
    Number(b.data.featured) - Number(a.data.featured)
    || b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf()
    || a.id.localeCompare(b.id),
  );
}

export async function publicWriting() {
  const entries = await publicEntries('writing');
  return entries.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf() || a.id.localeCompare(b.id));
}

export const studioStatuses = {
  released: '已发布',
  prototype: '原型',
  exploring: '探索中',
};

const dateFormatter = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'long', timeZone: 'Asia/Shanghai' });

export function formatDate(date: Date) {
  return dateFormatter.format(date);
}

export function readingMinutes(markdown = '') {
  const text = markdown.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  const chinese = text.match(/\p{Script=Han}/gu)?.length ?? 0;
  const words = text.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)?.length ?? 0;
  return Math.max(1, Math.ceil(chinese / 400 + words / 220));
}
