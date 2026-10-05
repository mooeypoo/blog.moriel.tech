import type { APIRoute } from 'astro'
import { getPublishedPosts } from '../lib/content'
import { buildFeed } from '../lib/rss'
import { SITE_TITLE, SITE_DESCRIPTION } from '../lib/seo'

export const prerender = true

export const GET: APIRoute = async () =>
  buildFeed({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    path: '/',
    feedPath: '/rss.xml',
    posts: await getPublishedPosts(),
  })
