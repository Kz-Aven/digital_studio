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

/** Work then Studio, the order used by the home index and every detail page. */
export async function portfolio() {
  const [work, studio] = await Promise.all([publicWork(), publicStudio()]);
  const items = [
    ...work.map((entry) => ({ kind: 'work' as const, id: entry.id, title: entry.data.title, href: `/work/${entry.id}/` })),
    ...studio.map((entry) => ({ kind: 'studio' as const, id: entry.id, title: entry.data.title, href: `/studio/${entry.id}/` })),
  ];
  const at = (kind: 'work' | 'studio', id: string) => {
    const i = items.findIndex((item) => item.kind === kind && item.id === id);
    return { no: i + 1, total: items.length, prev: items[i - 1], next: items[i + 1] };
  };
  return { items, at };
}

export const pad = (n: number) => String(n).padStart(2, '0');

export const studioCategories = {
  agent: 'Agent 工程',
  industry: '行业研究',
  media: '设计与多媒体',
  life: '生活与趣味',
  hardware: '硬件与实验',
};

export const studioStatuses = {
  released: '已发布',
  prototype: '原型',
  exploring: '探索中',
};

const dateFormatter = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'long', timeZone: 'Asia/Shanghai' });

export function formatDate(date: Date) {
  return dateFormatter.format(date);
}
