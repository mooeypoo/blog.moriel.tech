import type { APIRoute, GetStaticPaths } from 'astro'
import type { CollectionEntry } from 'astro:content'
import { buildFeed } from '../../lib/rss'
import { getSectionPath, getSectionPosts, getSections } from '../../lib/sections'

export const prerender = true

export const getStaticPaths = (async () => {
  const sections = await getSections()
  return sections.map((section) => ({ params: { section: section.id }, props: { section } }))
}) satisfies GetStaticPaths

export const GET: APIRoute = async ({ props }) => {
  const section = props.section as CollectionEntry<'sections'>
  const path = getSectionPath(section)
  return buildFeed({
    title: section.data.title,
    description: section.data.description,
    path,
    feedPath: `${path}/rss.xml`,
    posts: await getSectionPosts(section),
  })
}
