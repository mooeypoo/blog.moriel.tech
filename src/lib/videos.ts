import { getPublishedPosts } from './content'
import { findStandaloneVideoIds, getVideoWatchUrl } from './youtube.mjs'

/** Every video a published post shows: frontmatter `video` plus bare URLs embedded in the body. */
export async function getAllVideoIds() {
  const posts = await getPublishedPosts()
  const ids = posts.flatMap((post) => [
    ...(post.data.video ? [post.data.video] : []),
    ...findStandaloneVideoIds(post.body ?? ''),
  ])
  return [...new Set(ids)]
}

const titles = new Map<string, Promise<string>>()

/** Fetched from YouTube's oEmbed at build time; fails the build so a private or deleted video is noticed. */
export function getVideoTitle(id: string) {
  if (!titles.has(id)) {
    titles.set(id, (async () => {
      const response = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(getVideoWatchUrl(id))}`)
      if (!response.ok) throw new Error(`YouTube oEmbed returned ${response.status} for video ${id}. Is it public?`)
      return ((await response.json()) as { title: string }).title
    })())
  }
  return titles.get(id)!
}
