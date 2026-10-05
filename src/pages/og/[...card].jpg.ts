import type { APIRoute, GetStaticPaths } from 'astro'
import { getEntry } from 'astro:content'
import { formatPostDate, getPostDisplayImage, getPostSlug, getPublishedPosts, getUniqueTags } from '../../lib/content'
import { getItemLabel, getSections } from '../../lib/sections'
import { SITE_DESCRIPTION, SITE_TITLE } from '../../lib/seo'
import { renderCard, tagCardPath, type SocialCard } from '../../lib/social-cards'

export const prerender = true

export const getStaticPaths = (async () => {
  const posts = await getPublishedPosts()
  const cards: SocialCard[] = [
    { path: 'home', title: SITE_TITLE, description: SITE_DESCRIPTION },
    { path: 'posts', title: 'All posts', description: SITE_DESCRIPTION },
    { path: 'tags', title: 'Tags', description: 'Browse posts by topic.' },
  ]

  for (const post of posts) {
    const section = post.data.section ? await getEntry(post.data.section) : undefined
    const itemLabel = section && getItemLabel(section, post)
    cards.push({
      path: `posts/${getPostSlug(post)}`,
      title: post.data.title,
      eyebrow: section ? [section.data.title, itemLabel].filter(Boolean).join(' · ') : formatPostDate(post.data.date),
      image: getPostDisplayImage(post),
    })
  }
  for (const tag of getUniqueTags(posts)) cards.push({ path: tagCardPath(tag), eyebrow: 'Posts tagged', title: `#${tag}` })
  for (const section of await getSections()) {
    cards.push({ path: `sections/${section.id}`, title: section.data.title, description: section.data.description })
  }

  return cards.map((card) => ({ params: { card: card.path }, props: { card } }))
}) satisfies GetStaticPaths

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await renderCard(props.card as SocialCard)), { headers: { 'content-type': 'image/jpeg' } })
