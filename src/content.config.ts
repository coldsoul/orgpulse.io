import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    type: z.enum(['tutorial', 'how-to', 'reference', 'explanation']),
    order: z.number().int().positive(),
    category: z.enum(['tutorials', 'how-to', 'reference', 'explanation']),
  }),
});

export const collections = { docs };
