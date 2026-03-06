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
  type: 'content',
  schema: sharedContentSchema,
})

export const collections = {
  posts,
}
