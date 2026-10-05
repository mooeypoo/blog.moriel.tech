import type { APIRoute, GetStaticPaths } from 'astro'
import sharp from 'sharp'
import { getAllVideoIds } from '../../lib/videos'

export const prerender = true

// Downloaded at build time so readers make no request to YouTube until they press play.
export const getStaticPaths = (async () => {
  return (await getAllVideoIds()).map((id) => ({ params: { id } }))
}) satisfies GetStaticPaths

// maxresdefault is missing for some older or low-resolution uploads.
const SOURCES = ['maxresdefault', 'sddefault', 'hqdefault']

export const GET: APIRoute = async ({ params }) => {
  for (const source of SOURCES) {
    const response = await fetch(`https://i.ytimg.com/vi/${params.id}/${source}.jpg`)
    if (!response.ok) continue

    const image = sharp(Buffer.from(await response.arrayBuffer()))
    const { width = 0, height = 0 } = await image.metadata()
    // The smaller sizes are 4:3 with letterbox bars; keep the centered 16:9 frame.
    const frameHeight = Math.min(height, Math.round((width * 9) / 16))
    const webp = await image
      .extract({ left: 0, top: Math.floor((height - frameHeight) / 2), width, height: frameHeight })
      .resize({ width: Math.min(width, 1280) })
      .webp({ quality: 75 })
      .toBuffer()

    return new Response(new Uint8Array(webp), { headers: { 'content-type': 'image/webp' } })
  }
  throw new Error(`No thumbnail found on YouTube for video ${params.id}.`)
}
