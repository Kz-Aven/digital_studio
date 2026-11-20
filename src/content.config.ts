import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const cover = z.object({
  src: z.string(),
  small: z.string().optional(),
  alt: z.string(),
  caption: z.string().optional(),
  width: z.number().positive(),
  height: z.number().positive(),
});

const common = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()).default([]),
  cover: cover.optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  seoDescription: z.string().optional(),
});

const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '*.md' }),
  schema: common.extend({
    subtitle: z.string().optional(),
    category: z.string(),
    period: z.string().optional(),
    role: z.string().optional(),
    status: z.string().optional(),
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    decisions: z.array(z.string()).optional(),
    order: z.number().optional(),
  }),
});

const studio = defineCollection({
  loader: glob({ base: './src/content/studio', pattern: '*.md' }),
  schema: common.extend({
    publishedAt: z.coerce.date(),
    status: z.enum(['released', 'prototype', 'exploring']),
    stack: z.array(z.string()).default([]),
    githubUrl: z.url({ protocol: /^https$/ }).optional(),
    demoUrl: z.url({ protocol: /^https$/ }).optional(),
  }),
});

export const collections = { work, studio };
