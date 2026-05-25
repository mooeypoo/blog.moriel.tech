import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const sharedContentSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  description: z.string(),
  draft: z.boolean().default(false),
})

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: ({ image }) => sharedContentSchema.extend({
    // Base post image. Prefer local asset paths (via `image()`) for Astro optimization.
    // String values are still supported for absolute URLs or files served from /public.
    image: z.union([image(), z.string()]).optional(),
    // Optional override used for card/social preview use (OpenGraph/Twitter/list cards).
    // If omitted, the site falls back to `image`.
    display: z.union([image(), z.string()]).optional(),
  }),
})

export const collections = {
  posts,
}
