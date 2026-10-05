// What the Listen player reads, shared by the player (browser DOM) and the audio generator
// (linkedom over the built pages), so both derive the same text and the same hash.
import { normalizeForSpeech } from './speech.ts'

/** Where the Listen audio workflow publishes (docs/AUDIO.md). */
export const AUDIO_BASE_URL = 'https://mooeypoo.github.io/blog.moriel.tech/'

const READABLE = 'p, h2, h3, h4, h5, h6, li, blockquote'
const SKIPPED = '.sr-only, pre, .video-embed'

export interface SpokenBlock {
  element: Element
  text: string
}

function readableText(element: Element) {
  const clone = element.cloneNode(true) as Element
  clone.querySelectorAll(SKIPPED).forEach((node) => node.remove())
  return (clone.textContent ?? '').replace(/\s+/g, ' ').trim()
}

/** The post title, then the article one block at a time, normalized for speech. */
export function getSpokenBlocks(root: ParentNode): SpokenBlock[] {
  const title = root.querySelector('.post-header h1')
  const article = root.querySelector('.post-content')
  if (!title || !article) return []

  const elements = [title]
  for (const element of article.querySelectorAll(READABLE)) {
    // Read nested blocks (a paragraph inside a list item) once, through the outer one.
    if (element.parentElement?.closest(READABLE) || element.closest(SKIPPED)) continue
    elements.push(element)
  }
  return elements
    .map((element) => ({ element, text: normalizeForSpeech(readableText(element)) }))
    .filter((block) => block.text)
}

/** Audio is tied to this; any change to the spoken text makes published audio stale. */
export async function hashSpokenText(texts: string[]) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(texts)))
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export interface AudioManifestEntry {
  hash: string
  voice: string
  /** Relative to AUDIO_BASE_URL. */
  file: string
  /** Seconds. */
  duration: number
  /** Start time in seconds of each spoken block, in order. */
  starts: number[]
}

export interface AudioManifest {
  model: string
  posts: Record<string, AudioManifestEntry>
}
