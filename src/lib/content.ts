import { getImage } from 'astro:assets'
import { getCollection } from 'astro:content'
import type { ImageMetadata } from 'astro'

export const PAGE_SIZE = 10

export type PostImage = ImageMetadata | string

export function normalizeImageUrl(image?: string) {
  if (!image) return undefined
  if (/^https?:\/\//i.test(image)) return image
  return image.startsWith('/') ? image : `/${image}`
}

export function getPostDisplayImage(entry: { data: { display?: PostImage; image?: PostImage } }) {
  return entry.data.display || entry.data.image
}

const SOCIAL_IMAGE_MAX_WIDTH = 1200

export interface SocialImage {
  src: string
  width?: number
  height?: number
}

// Social platforms and feed readers download the whole file, so the multi-MB sources
// are resized to a JPEG they all accept. Not cropped: some previews are panoramic.
export async function getPostSocialImage(entry: { data: { display?: PostImage; image?: PostImage } }): Promise<SocialImage | undefined> {
  const image = getPostDisplayImage(entry)
  if (!image) return undefined
  if (typeof image === 'string') return { src: normalizeImageUrl(image)! }

  const width = Math.min(image.width, SOCIAL_IMAGE_MAX_WIDTH)
  const result = await getImage({ src: image, width, format: 'jpg', quality: 80 })
  return {
    src: result.src,
    width,
    height: Math.round((image.height * width) / image.width),
  }
}

export function formatPostDate(date: Date) {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Brysbaert (2019) meta-analysis: adults read non-fiction silently at ~238 wpm.
// Rounded down because these posts are technical and denser than the studied texts.
const WORDS_PER_MINUTE = 230

// Medium's convention: 12s for the first image, one second less for each next one, down to 3s.
function imageSeconds(count: number) {
  let seconds = 0
  for (let i = 0; i < count; i++) seconds += Math.max(12 - i, 3)
  return seconds
}

/** Counts prose plus time spent on images; link targets and HTML tags aren't read. */
export function getReadingMinutes(post: { body?: string }) {
  const body = post.body ?? ''
  const images = (body.match(/!\[[^\]]*\]\([^)]*\)/g) ?? []).length + (body.match(/<img\b/gi) ?? []).length
  const prose = body
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/<[^>]+>/g, ' ')
  const words = prose.split(/\s+/).filter((word) => /\w/.test(word)).length
  const seconds = (words / WORDS_PER_MINUTE) * 60 + imageSeconds(images)
  return Math.max(1, Math.round(seconds / 60))
}

export function getPostSlug(entry: { id: string; slug?: string }) {
  return entry.slug ?? entry.id.replace(/\.(md|mdx)$/i, '')
}

export function getPostPath(entry: { id: string; slug?: string }) {
  return `/posts/${getPostSlug(entry)}`
}

export async function getPublishedPosts() {
  const entries = await getCollection('posts', ({ data }) => data.draft !== true)

  return entries.sort((first, second) => {
    return second.data.date.getTime() - first.data.date.getTime()
  })
}

export function getUniqueTags<T extends { data: { tags?: string[] } }>(entries: T[]) {
  const uniqueTags = new Set<string>()

  for (const entry of entries) {
    for (const tag of entry.data.tags || []) {
      uniqueTags.add(tag)
    }
  }

  return [...uniqueTags].sort((a, b) => a.localeCompare(b))
}

export function filterEntriesByTag<T extends { data: { tags?: string[] } }>(entries: T[], tag: string) {
  return entries.filter((entry) => (entry.data.tags || []).includes(tag))
}

export function paginateEntries<T>(entries: T[], page: number, pageSize = PAGE_SIZE) {
  const safePage = Math.max(1, page)
  const totalItems = entries.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const normalizedPage = Math.min(safePage, totalPages)
  const start = (normalizedPage - 1) * pageSize

  return {
    page: normalizedPage,
    pageSize,
    totalItems,
    totalPages,
    items: entries.slice(start, start + pageSize),
  }
}
