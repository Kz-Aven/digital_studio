import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    category: z.string(),
    period: z.string().optional(),
    role: z.string().optional(),
    status: z.string().optional(),
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    cover: z.object({
      src: z.string(),
      small: z.string().optional(),
      alt: z.string(),
      caption: z.string().optional(),
      width: z.number().positive(),
      height: z.number().positive(),
    }).optional(),
    decisions: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    order: z.number().optional(),
    seoDescription: z.string().optional(),
  }),
});

export const collections = { work };
