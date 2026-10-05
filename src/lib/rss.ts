import { getEntry, type CollectionEntry } from 'astro:content'
import { getPostSocialImage, getPostPath } from './content'
import { SITE_URL, toAbsoluteUrl } from './seo'

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

interface Feed {
  title: string
  description: string
  /** Site path of the page the feed describes, e.g. "/" or "/physics-of-software". */
  path: string
  /** Site path of the feed itself. */
  feedPath: string
  posts: CollectionEntry<'posts'>[]
}

export async function buildFeed({ title, description, path, feedPath, posts }: Feed) {
  const sorted = [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime())

  const items = (await Promise.all(sorted.map(async (post) => {
    const url = `${SITE_URL}${getPostPath(post)}`
    const itemTitle = escapeXml(post.data.title)
    const itemDescription = escapeXml(post.data.description || '')
    const imageUrl = toAbsoluteUrl((await getPostSocialImage(post))?.src)
    const pubDate = post.data.date.toUTCString()
    const section = post.data.section ? await getEntry(post.data.section) : undefined
    const categories = [section?.data.title, ...(post.data.tags || [])]
      .filter(Boolean)
      .map((category) => `<category>${escapeXml(category!)}</category>`)

    return [
      '<item>',
      `<title>${itemTitle}</title>`,
      `<description>${itemDescription}</description>`,
      ...(imageUrl
        ? [`<media:content url="${escapeXml(imageUrl)}" medium="image" type="${getImageMimeType(imageUrl)}"/>`]
        : []),
      `<link>${url}</link>`,
      `<guid>${url}</guid>`,
      `<pubDate>${pubDate}</pubDate>`,
      ...categories,
      '</item>',
    ].join('\n')
  }))).join('\n')

  const now = new Date().toUTCString()

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(title)}</title>
    <description>${escapeXml(description)}</description>
    <link>${SITE_URL}${path === '/' ? '' : path}</link>
    <atom:link href="${SITE_URL}${feedPath}" rel="self" type="application/rss+xml"/>
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
