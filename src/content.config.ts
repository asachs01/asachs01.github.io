import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional().default(''),
    categories: z.array(z.string()).optional().default([]),
    tags: z.array(z.string()).optional().default([]),
    slug: z.string(),
    draft: z.boolean().optional().default(false),
  }),
});

const archives = defineCollection({
  loader: glob({ base: './src/content/archives', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional().default(''),
    categories: z.array(z.string()).optional().default([]),
    tags: z.array(z.string()).optional().default([]),
    slug: z.string(),
    draft: z.boolean().optional().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    url: z.string().optional().default(''),
    repoUrl: z.string().optional().default(''),
    img: z.string(),
    img_alt: z.string().optional().default(''),
    tags: z.array(z.string()).optional().default([]),
    publishDate: z.coerce.date(),
  }),
});

export const collections = { posts, archives, projects };
