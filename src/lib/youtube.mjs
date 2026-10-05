// Plain JS so astro.config.mjs (the Markdown plugin) and pages share one definition.

export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@MorielTech'

const VIDEO_ID = /^[\w-]{11}$/
const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'www.youtube-nocookie.com'])

/**
 * Accepts a bare video ID or any common YouTube URL (watch, youtu.be, embed, shorts, live).
 * @param {string} input
 * @returns {string | undefined}
 */
export function parseYouTubeId(input) {
  const value = input.trim()
  if (VIDEO_ID.test(value)) return value

  let url
  try {
    url = new URL(value)
  } catch {
    return undefined
  }
  if (!YOUTUBE_HOSTS.has(url.hostname)) return undefined

  const candidate = url.hostname === 'youtu.be'
    ? url.pathname.slice(1)
    : url.searchParams.get('v') ?? url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1]
  return candidate && VIDEO_ID.test(candidate) ? candidate : undefined
}

/**
 * IDs of videos pasted as a bare URL on their own line, which the Markdown plugin embeds in place.
 * Must match what the plugin converts, so fenced code is skipped.
 * @param {string} markdown
 * @returns {string[]}
 */
export function findStandaloneVideoIds(markdown) {
  const withoutCode = markdown.replace(/^(```|~~~)[\s\S]*?^\1/gm, '')
  return withoutCode
    .split('\n')
    .map((line) => line.trim().replace(/^<(.*)>$/, '$1'))
    .filter((line) => /^https?:\/\/\S+$/.test(line))
    .map(parseYouTubeId)
    .filter((id) => id !== undefined)
}

/** @param {string} id */
export const getVideoThumbnailPath = (id) => `/video-thumbnails/${id}.webp`

/** @param {string} id */
export const getVideoWatchUrl = (id) => `https://www.youtube.com/watch?v=${id}`

/** @param {string} id */
export const getVideoEmbedUrl = (id) => `https://www.youtube-nocookie.com/embed/${id}`

/** @param {string} value */
const escapeHtml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * Click-to-load player. Until clicked it's a thumbnail linking to YouTube, so it also works
 * without JavaScript; the post page script swaps in the youtube-nocookie iframe on click.
 * @param {string} id A validated video ID.
 * @param {{ title?: string }} [options]
 */
export function renderVideoEmbed(id, { title } = {}) {
  const label = escapeHtml(title ? `Play video: ${title}` : 'Play video')
  return `<div class="video-embed"><a class="video-facade" href="${getVideoWatchUrl(id)}" target="_blank" rel="noopener noreferrer" data-video-id="${id}" data-video-title="${escapeHtml(title ?? 'YouTube video')}"><img src="${getVideoThumbnailPath(id)}" alt="" width="1280" height="720" loading="lazy" decoding="async"><span class="video-play" aria-hidden="true"></span><span class="sr-only">${label}</span></a></div>`
}
