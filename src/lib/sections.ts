import { readdirSync } from 'node:fs'
import { getCollection, getEntry, type CollectionEntry } from 'astro:content'
import { getPublishedPosts } from './content'

type Post = CollectionEntry<'posts'>
type Section = CollectionEntry<'sections'>

export function getSectionPath(section: { id: string }) {
  return `/${section.id}`
}

// Landing pages share the top-level URL namespace with pages and public files (ROADMAP D11).
function assertNoRouteClashes(sections: Section[]) {
  const taken = new Set(
    [...readdirSync('src/pages'), ...readdirSync('public'), '_astro'].map((name) => name.replace(/\.(astro|ts|js|md)$/, '')),
  )
  const clash = sections.find((section) => taken.has(section.id))
  if (clash) {
    throw new Error(`Section "${clash.id}" clashes with an existing top-level route. Rename src/content/sections/${clash.id}.md.`)
  }
}

export async function getSections() {
  const sections = await getCollection('sections')
  assertNoRouteClashes(sections)
  return sections.sort((a, b) => a.data.title.localeCompare(b.data.title))
}

export async function getSectionPosts(section: Section) {
  return (await getPublishedPosts()).filter((post) => post.data.section?.id === section.id)
}

/** Sections with published posts; the rest stay out of the nav until they have content (ROADMAP D9). */
export async function getNavSections() {
  const sections = await getSections()
  const withPosts = await Promise.all(sections.map(async (section) => (await getSectionPosts(section)).length > 0))
  return sections.filter((_, i) => withPosts[i])
}

/**
 * Posts with `order` come first, by `order`; the rest follow by date, oldest first, unless
 * the section excludes them, in which case they're returned separately as `updates`.
 */
export async function getSectionSequence(section: Section) {
  const posts = await getSectionPosts(section)
  const ordered = posts.filter((post) => post.data.order !== undefined).sort((a, b) => a.data.order! - b.data.order!)

  for (let i = 1; i < ordered.length; i++) {
    if (ordered[i].data.order === ordered[i - 1].data.order) {
      throw new Error(
        `Posts "${ordered[i - 1].id}" and "${ordered[i].id}" both have order ${ordered[i].data.order} in section "${section.id}".`,
      )
    }
  }

  const unordered = posts.filter((post) => post.data.order === undefined)
  if (section.data.unordered === 'exclude') {
    return { sequence: ordered, updates: unordered }
  }
  const oldestFirst = [...unordered].sort((a, b) => a.data.date.getTime() - b.data.date.getTime())
  return { sequence: [...ordered, ...oldestFirst], updates: [] }
}

export function getItemLabel(section: Section, post: Post) {
  return post.data.order === undefined ? undefined : `${section.data.itemLabel} ${post.data.order}`
}

export async function getPostSectionContext(post: Post) {
  if (!post.data.section) return undefined

  const section = (await getEntry(post.data.section))!
  const { sequence } = await getSectionSequence(section)
  const index = sequence.findIndex((entry) => entry.id === post.id)

  return {
    section,
    label: getItemLabel(section, post),
    previous: index > 0 ? sequence[index - 1] : undefined,
    next: index >= 0 ? sequence[index + 1] : undefined,
  }
}
