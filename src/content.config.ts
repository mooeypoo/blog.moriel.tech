import { existsSync } from 'node:fs'
import { glob } from 'astro/loaders'
import { defineCollection, reference } from 'astro:content'
import { z } from 'astro/zod'

const DATE_PREFIX = /^\d{4}-\d{2}(-\d{2})?-/
const postIdSources = new Map<string, string>()

// Filenames may carry a date for sorting in the editor; URLs don't (see docs/ROADMAP.md D12).
function generatePostId({ entry, base, data }: { entry: string; base: URL; data: Record<string, unknown> }) {
  const fileName = entry.replace(/\.md$/i, '')
  const id = typeof data.slug === 'string' ? data.slug : fileName.replace(DATE_PREFIX, '')

  // Astro only warns on duplicate ids and silently keeps one post. The existence
  // check avoids false positives in dev after a file is renamed.
  const previousEntry = postIdSources.get(id)
  if (previousEntry && previousEntry !== entry && existsSync(new URL(previousEntry, base))) {
    throw new Error(`Duplicate post slug "${id}" from "${previousEntry}" and "${entry}". Rename one or set \`slug\` in its frontmatter.`)
  }
  postIdSources.set(id, entry)

  return id
}

const sharedContentSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  description: z.string(),
  draft: z.boolean().default(false),
})

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts', generateId: generatePostId }),
  schema: ({ image }) => sharedContentSchema.extend({
    // Overrides the filename-derived URL slug.
    slug: z.string().optional(),
    // Pins the comment thread when a post's slug changes; defaults to the slug.
    commentsId: z.string().optional(),
    // Base post image. Prefer local asset paths (via `image()`) for Astro optimization.
    // String values are still supported for absolute URLs or files served from /public.
    image: z.union([image(), z.string()]).optional(),
    // Optional override used for card/social preview use (OpenGraph/Twitter/list cards).
    // If omitted, the site falls back to `image`.
    display: z.union([image(), z.string()]).optional(),
    section: reference('sections').optional(),
    // Position and displayed number within the section ("Episode 4"). Never part of the URL.
    order: z.number().int().positive().optional(),
  }),
})

// Curated categories with their own landing page at /<id> (docs/ROADMAP.md D3, D11).
const sections = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sections' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Labels a post's `order`: "Episode 4", "Chapter 3".
    itemLabel: z.string(),
    // `exclude` keeps posts without `order` out of the reading sequence (e.g. book announcements).
    unordered: z.enum(['include', 'exclude']).default('include'),
    links: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
  }),
})

export const collections = {
  posts,
  sections,
}
