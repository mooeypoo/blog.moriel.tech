import { getCollection } from 'astro:content'

export const PAGE_SIZE = 10

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
