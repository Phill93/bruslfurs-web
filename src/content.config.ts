import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const events = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/events' }),
  schema: z.object({
    title: z.string().min(3),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    summary: z.string().min(10),
    start: z.coerce.date(),
    end: z.coerce.date(),
    location: z.string().min(2),
    mapUrl: z.url().optional(),
    image: z.string().optional(),
    registrationUrl: z.url().optional(),
    registrationDeadline: z.coerce.date().optional(),
    status: z.enum(['open', 'full', 'closed', 'cancelled']).default('open'),
    galleries: z.array(z.object({
      label: z.string().min(2),
      url: z.url(),
      photographer: z.string().optional(),
    })).default([]),
  }).refine((event) => event.end >= event.start, {
    message: 'Das Event-Ende muss nach dem Beginn liegen.',
    path: ['end'],
  }),
});

export const collections = { events };
