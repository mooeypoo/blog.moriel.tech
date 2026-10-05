import type { APIRoute } from 'astro'
import { getPostSocialImage, getPublishedPosts, getPostPath } from '../lib/content'

export const prerender = true

const MAX_POSTS = 5

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts()
  const latest = await Promise.all(posts.slice(0, MAX_POSTS).map(async (post) => ({
    title: post.data.title,
    description: post.data.description,
    date: post.data.date.toISOString(),
    url: `https://blog.moriel.tech${getPostPath(post)}`,
    displayImage: (await getPostSocialImage(post))?.src,
    tags: post.data.tags || [],
  })))

  return new Response(JSON.stringify({
    updatedAt: new Date().toISOString(),
    posts: latest,
  }), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=300, s-maxage=300',
    },
  })
}
