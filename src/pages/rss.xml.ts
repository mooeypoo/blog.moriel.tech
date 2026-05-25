import type { APIRoute } from 'astro'
import { getPostDisplayImageUrl, getPublishedPosts, getPostPath } from '../lib/content'
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from '../lib/seo'

export const prerender = true

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function getImageMimeType(url: string) {
  const cleanUrl = url.split('?')[0].toLowerCase()
  if (cleanUrl.endsWith('.png')) return 'image/png'
  if (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg')) return 'image/jpeg'
  if (cleanUrl.endsWith('.gif')) return 'image/gif'
  if (cleanUrl.endsWith('.webp')) return 'image/webp'
  if (cleanUrl.endsWith('.avif')) return 'image/avif'
  if (cleanUrl.endsWith('.svg')) return 'image/svg+xml'
  return 'image/*'
}

export const GET: APIRoute = async () => {
  const posts = (await getPublishedPosts())
    .filter((post) => post?.data?.date instanceof Date)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())

  const items = posts.map((post) => {
    const url = `${SITE_URL}${getPostPath(post)}`
    const title = escapeXml(post.data.title)
    const description = escapeXml(post.data.description || '')
    const imageUrl = getPostDisplayImageUrl(post)
    const pubDate = post.data.date.toUTCString()
    const categories = (post.data.tags || []).map(
      (tag: string) => `<category>${escapeXml(tag)}</category>`
    )

    return [
      '<item>',
      `<title>${title}</title>`,
      `<description>${description}</description>`,
      ...(imageUrl
        ? [`<media:content url="${escapeXml(imageUrl)}" medium="image" type="${getImageMimeType(imageUrl)}"/>`]
        : []),
      `<link>${url}</link>`,
      `<guid>${url}</guid>`,
      `<pubDate>${pubDate}</pubDate>`,
      ...categories,
      '</item>',
    ].join('\n')
  }).join('\n')

  const now = new Date().toUTCString()

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${now}</lastBuildDate>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, max-age=300, s-maxage=300',
    },
  })
}
