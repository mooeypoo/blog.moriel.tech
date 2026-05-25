import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

export const sharedContentSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  description: z.string(),
  image: z.string().optional(),
  draft: z.boolean().default(false),
})

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: sharedContentSchema,
})

export const collections = {
  posts,
}
