// Generates Listen audio for the built posts (docs/AUDIO.md).
//
//   node --experimental-strip-types generate.mjs [--dist ../../dist] [--out out] [--from <url>] [--regenerate <slugs|all>] [--plan] [slug...]
//
// --from downloads what's already published first, so only new or changed posts are generated.
// Naming slugs limits the run to those posts (a local preview) and skips pruning.
// --plan only reports what would be generated or removed.
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { Mp3Encoder } from '@breezystack/lamejs'
import { env } from '@huggingface/transformers'
import { KokoroTTS } from 'kokoro-js'
import { parseHTML } from 'linkedom'
import { getSpokenBlocks, hashSpokenText } from '../../src/lib/listen-text.ts'

const MODEL = 'onnx-community/Kokoro-82M-v1.0-ONNX'
// Pinned so a change upstream can't silently alter (or compromise) the generated audio.
const MODEL_REVISION = '1939ad2a8e416c0acfeecc08a694d14ef25f2231'
const VOICE = 'af_heart'
const SAMPLE_RATE = 24000
const BITRATE_KBPS = 48
const PAUSE_AFTER_TITLE = 0.9
const PAUSE_BETWEEN_BLOCKS = 0.55
// Kokoro silently truncates input past ~510 phoneme tokens, so long paragraphs are generated in parts.
const MAX_PART_LENGTH = 300

const { values: options, positionals: onlySlugs } = parseArgs({
  allowPositionals: true,
  options: {
    dist: { type: 'string', default: '../../dist' },
    out: { type: 'string', default: 'out' },
    from: { type: 'string' },
    regenerate: { type: 'string', default: '' },
    plan: { type: 'boolean', default: false },
  },
})
const distDir = resolve(options.dist)
const outDir = resolve(options.out)
const forced = new Set(options.regenerate.split(/[\s,]+/).filter(Boolean))
mkdirSync(outDir, { recursive: true })

env.cacheDir = resolve(import.meta.dirname, '.cache')
env.remotePathTemplate = `{model}/resolve/${MODEL_REVISION}/`

function splitIntoParts(text) {
  if (text.length <= MAX_PART_LENGTH) return [text]
  const pieces = (text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [text])
    .flatMap((piece) => (piece.length <= MAX_PART_LENGTH ? [piece] : piece.split(/(?<=[,;:])\s+/)))
    .flatMap((piece) => (piece.length <= MAX_PART_LENGTH ? [piece] : piece.split(/\s+/)))
    .map((piece) => piece.trim())
    .filter(Boolean)
  const parts = []
  for (const piece of pieces) {
    const last = parts.at(-1)
    if (last !== undefined && last.length + 1 + piece.length <= MAX_PART_LENGTH) parts[parts.length - 1] = `${last} ${piece}`
    else parts.push(piece)
  }
  return parts
}

function encodeMp3(samples) {
  const pcm = Int16Array.from(samples, (sample) => Math.max(-1, Math.min(1, sample)) * 32767)
  const encoder = new Mp3Encoder(1, SAMPLE_RATE, BITRATE_KBPS)
  const chunks = []
  for (let i = 0; i < pcm.length; i += 1152) chunks.push(encoder.encodeBuffer(pcm.subarray(i, i + 1152)))
  chunks.push(encoder.flush())
  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)))
}

let tts
async function synthesize(texts) {
  tts ??= await KokoroTTS.from_pretrained(MODEL, { dtype: 'fp32', device: 'cpu' })
  const parts = []
  const starts = []
  let length = 0
  for (const [index, text] of texts.entries()) {
    starts.push(length / SAMPLE_RATE)
    for (const part of splitIntoParts(text)) {
      const { audio } = await tts.generate(part, { voice: VOICE })
      parts.push(audio)
      length += audio.length
    }
    const pause = new Float32Array(Math.round(SAMPLE_RATE * (index === 0 ? PAUSE_AFTER_TITLE : PAUSE_BETWEEN_BLOCKS)))
    parts.push(pause)
    length += pause.length
  }
  const samples = new Float32Array(length)
  let offset = 0
  for (const part of parts) {
    samples.set(part, offset)
    offset += part.length
  }
  return { mp3: encodeMp3(samples), duration: length / SAMPLE_RATE, starts }
}

async function download(path) {
  const response = await fetch(new URL(path, options.from))
  if (response.status === 404) return undefined
  if (!response.ok) throw new Error(`Downloading ${path} from ${options.from} failed: ${response.status}`)
  return response
}

// What the site would read: the player is absent on posts with `listen: false`.
const posts = new Map()
for (const slug of readdirSync(join(distDir, 'posts'))) {
  const page = join(distDir, 'posts', slug, 'index.html')
  if (!existsSync(page)) continue
  const { document } = parseHTML(readFileSync(page, 'utf8'))
  if (!document.querySelector('[data-listen]')) continue
  const texts = getSpokenBlocks(document).map((block) => block.text)
  posts.set(slug, { texts, hash: await hashSpokenText(texts) })
}

const manifestPath = join(outDir, 'manifest.json')
let manifest = { model: `${MODEL}@${MODEL_REVISION}`, posts: {} }
if (options.from) manifest = (await (await download('manifest.json'))?.json()) ?? manifest
else if (existsSync(manifestPath)) manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
manifest.model = `${MODEL}@${MODEL_REVISION}`

const removed = []
if (onlySlugs.length === 0) {
  for (const slug of Object.keys(manifest.posts)) {
    if (posts.has(slug)) continue
    removed.push(slug)
    if (options.plan) continue
    rmSync(join(outDir, manifest.posts[slug].file), { force: true })
    delete manifest.posts[slug]
  }
}

const generated = []
for (const [slug, { texts, hash }] of posts) {
  if (onlySlugs.length > 0 && !onlySlugs.includes(slug)) continue
  const existing = manifest.posts[slug]
  const current = existing?.hash === hash && existing.voice === VOICE && !forced.has('all') && !forced.has(slug)

  if (current) {
    if (options.plan || !options.from || existsSync(join(outDir, existing.file))) continue
    // Republishing replaces the whole Pages site, so unchanged audio is carried over.
    const response = await download(existing.file)
    if (response) {
      writeFileSync(join(outDir, existing.file), Buffer.from(await response.arrayBuffer()))
      continue
    }
    // Listed but missing from the site: fall through and regenerate it.
  }

  if (options.plan) {
    generated.push(slug)
    continue
  }
  const started = Date.now()
  const { mp3, duration, starts } = await synthesize(texts)
  const file = `${slug}-${hash.slice(0, 12)}.mp3`
  if (existing && existing.file !== file) rmSync(join(outDir, existing.file), { force: true })
  writeFileSync(join(outDir, file), mp3)
  manifest.posts[slug] = { hash, voice: VOICE, file, duration: Math.round(duration * 100) / 100, starts: starts.map((s) => Math.round(s * 100) / 100) }
  generated.push(slug)
  console.log(`${slug}: ${Math.round(duration)}s of audio, ${(mp3.length / 1e6).toFixed(1)} MB, in ${Math.round((Date.now() - started) / 1000)}s`)
}

if (options.plan) {
  console.log(`Would generate: ${generated.join(', ') || 'none'}. Would remove: ${removed.join(', ') || 'none'}.`)
  process.exit(0)
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
writeFileSync(join(outDir, 'index.html'), '<!doctype html><meta charset="utf-8"><title>Listen audio</title><p>Audio for the Listen player on <a href="https://blog.moriel.tech">blog.moriel.tech</a>.</p>\n')

console.log(`Generated: ${generated.join(', ') || 'none'}. Removed: ${removed.join(', ') || 'none'}.`)
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `changed=${generated.length + removed.length > 0}\n`)
