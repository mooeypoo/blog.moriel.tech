// Social preview cards (og:image), rendered at build time (ROADMAP D19). Satori lays out the
// text as SVG; sharp places it over the page's darkened hero image or a branded background.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { inflateSync } from 'node:zlib'
import type { ImageMetadata } from 'astro'
import satori from 'satori'
import sharp from 'sharp'

export const CARD_WIDTH = 1200
export const CARD_HEIGHT = 630

export interface SocialCard {
  /** Output path under /og/, without extension. */
  path: string
  title: string
  eyebrow?: string
  description?: string
  image?: ImageMetadata | string
}

export const getCardUrl = (path: string) => `/og/${path}.jpg`

/** Tag names can contain spaces and symbols; card filenames shouldn't. */
export const tagCardPath = (tag: string) => `tags/${tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`

/**
 * WOFF is a TrueType font with zlib-compressed tables. Satori's own WOFF support goes through
 * fflate, pinned to a vulnerable version (patched releases break it), so fonts are unwrapped here.
 */
function woffToTtf(woff: Buffer) {
  const tableCount = woff.readUInt16BE(12)
  const tables = Array.from({ length: tableCount }, (_, i) => {
    const entry = 44 + i * 20
    const offset = woff.readUInt32BE(entry + 4)
    const compressedLength = woff.readUInt32BE(entry + 8)
    const length = woff.readUInt32BE(entry + 12)
    const raw = woff.subarray(offset, offset + compressedLength)
    return { tag: woff.readUInt32BE(entry), checksum: woff.readUInt32BE(entry + 16), data: compressedLength < length ? inflateSync(raw) : raw }
  })

  const power = 2 ** Math.floor(Math.log2(tableCount))
  const header = Buffer.alloc(12 + tableCount * 16)
  header.writeUInt32BE(woff.readUInt32BE(4), 0)
  header.writeUInt16BE(tableCount, 4)
  header.writeUInt16BE(power * 16, 6)
  header.writeUInt16BE(Math.log2(power), 8)
  header.writeUInt16BE(tableCount * 16 - power * 16, 10)

  const body: Buffer[] = []
  let offset = header.length
  tables.forEach((table, i) => {
    header.writeUInt32BE(table.tag, 12 + i * 16)
    header.writeUInt32BE(table.checksum, 16 + i * 16)
    header.writeUInt32BE(offset, 20 + i * 16)
    header.writeUInt32BE(table.data.length, 24 + i * 16)
    const padded = Buffer.alloc(Math.ceil(table.data.length / 4) * 4)
    table.data.copy(padded)
    body.push(padded)
    offset += padded.length
  })
  return Buffer.concat([header, ...body])
}

// Build runs from the project root. Satori can't read WOFF2, so these come from @fontsource.
const fontFile = (name: string) => woffToTtf(readFileSync(join(process.cwd(), 'node_modules/@fontsource', name)))
let fonts: Parameters<typeof satori>[1]['fonts'] | undefined
let avatar: string | undefined

function loadAssets() {
  fonts ??= [
    { name: 'Merriweather', data: fontFile('merriweather/files/merriweather-latin-700-normal.woff'), weight: 700, style: 'normal' },
    { name: 'Roboto', data: fontFile('roboto/files/roboto-latin-400-normal.woff'), weight: 400, style: 'normal' },
    { name: 'Roboto', data: fontFile('roboto/files/roboto-latin-500-normal.woff'), weight: 500, style: 'normal' },
  ]
  avatar ??= `data:image/jpeg;base64,${readFileSync(join(process.cwd(), 'public/moriel-320px.jpg')).toString('base64')}`
  return { fonts, avatar }
}

type Node = { type: string; props: { style?: Record<string, unknown>; children?: unknown; src?: string; width?: number; height?: number } }
const el = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({ type, props: { style, children } })

const truncate = (text: string, length: number) => (text.length <= length ? text : `${text.slice(0, length - 1).trimEnd()}…`)

function titleSize(title: string) {
  if (title.length <= 40) return 68
  if (title.length <= 70) return 58
  return 48
}

function layout(card: SocialCard, hasImage: boolean, avatarSrc: string): Node {
  return el(
    'div',
    {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      display: 'flex',
      flexDirection: 'column',
      padding: '56px 64px',
      borderTop: '10px solid #90caf9',
      // Over a photo, a gradient keeps the text readable; otherwise this is the brand background.
      background: hasImage
        ? 'linear-gradient(90deg, rgba(8, 12, 20, 0.92) 0%, rgba(8, 12, 20, 0.75) 60%, rgba(8, 12, 20, 0.45) 100%)'
        : 'linear-gradient(135deg, #0f1b2d 0%, #121212 70%)',
      color: '#ffffff',
      fontFamily: 'Roboto',
    },
    [
      card.eyebrow
        ? el('div', { fontSize: 26, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', color: '#90caf9' }, truncate(card.eyebrow, 60))
        : el('div', { height: 30 }),
      el('div', { display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1 }, [
        el('div', { fontFamily: 'Merriweather', fontWeight: 700, fontSize: titleSize(card.title), lineHeight: 1.2, maxWidth: 1000 }, truncate(card.title, 110)),
        card.description
          ? el('div', { marginTop: 20, fontSize: 28, lineHeight: 1.4, color: 'rgba(255, 255, 255, 0.82)', maxWidth: 900 }, truncate(card.description, 140))
          : null,
      ].filter(Boolean)),
      el('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, [
        el('div', { display: 'flex', alignItems: 'center' }, [
          { type: 'img', props: { src: avatarSrc, width: 64, height: 64, style: { borderRadius: 32, marginRight: 18 } } },
          el('div', { fontSize: 30, fontWeight: 500 }, 'Moriel Writes Tech'),
        ]),
        el('div', { fontSize: 26, color: 'rgba(255, 255, 255, 0.72)' }, 'blog.moriel.tech'),
      ]),
    ],
  )
}

/** A local image's file, if Astro exposes it; remote or /public images fall back to the brand background. */
function imageFile(image: SocialCard['image']) {
  if (!image || typeof image === 'string') return undefined
  return (image as ImageMetadata & { fsPath?: string }).fsPath
}

export async function renderCard(card: SocialCard) {
  const { fonts, avatar } = loadAssets()
  const file = imageFile(card.image)
  const svg = await satori(layout(card, Boolean(file), avatar) as never, { width: CARD_WIDTH, height: CARD_HEIGHT, fonts })
  const base = file
    ? sharp(file).resize(CARD_WIDTH, CARD_HEIGHT, { fit: 'cover' })
    : sharp({ create: { width: CARD_WIDTH, height: CARD_HEIGHT, channels: 3, background: '#121212' } })
  return base
    .composite([{ input: Buffer.from(svg) }])
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer()
}
