import { getCollection } from 'astro:content';

export async function publicWork() {
  const entries = await getCollection('work', ({ data, body }) => !data.draft && Boolean(body?.trim()));
  return entries.sort((a, b) =>
    (a.data.order ?? Infinity) - (b.data.order ?? Infinity)
    || (b.data.publishedAt?.valueOf() ?? 0) - (a.data.publishedAt?.valueOf() ?? 0)
    || a.id.localeCompare(b.id),
  );
}
