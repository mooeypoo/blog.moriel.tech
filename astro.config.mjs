// @ts-check
import { defineConfig, fontProviders } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import vue from '@astrojs/vue'
import { satteri } from '@astrojs/markdown-satteri'
import { parseYouTubeId, renderVideoEmbed } from './src/lib/youtube.mjs'

const SITE = 'https://blog.moriel.tech'

/** @param {unknown} value */
function toList(value) {
  if (Array.isArray(value)) return value
  return typeof value === 'string' ? value.split(/\s+/).filter(Boolean) : []
}

/** @param {string} href */
function isExternalLink(href) {
  if (!/^(https?:)?\/\//i.test(href)) return false
  return new URL(href, SITE).hostname !== new URL(SITE).hostname
}

// Links within the blog stay in the same tab; external ones open a new tab and say so.
/** @type {import('satteri').HastPluginEntry} */
const openExternalLinksInNewTab = {
  name: 'open-external-links-in-new-tab',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      const href = node.properties?.href
      if (typeof href !== 'string' || !isExternalLink(href)) return

      ctx.setProperty(node, 'target', '_blank')
      ctx.setProperty(node, 'rel', [...new Set([...toList(node.properties?.rel), 'noopener', 'noreferrer'])].join(' '))
      ctx.setProperty(node, 'className', [...toList(node.properties?.className), 'external-link'])
      // The icon is decorative CSS, so screen readers get the warning as text.
      ctx.appendChild(node, {
        type: 'element',
        tagName: 'span',
        properties: { className: ['sr-only'] },
        children: [{ type: 'text', value: ' (opens in a new tab)' }],
      })
    },
  },
}

// A YouTube URL alone in a paragraph (a bare URL on its own line) becomes a player in place.
// Must run before the link plugin, which appends screen-reader text to links.
/** @type {import('satteri').HastPluginEntry} */
const embedStandaloneVideos = {
  name: 'embed-standalone-videos',
  element: {
    filter: ['p'],
    visit(node, ctx) {
      const children = (node.children ?? []).filter((child) => !(child.type === 'text' && !child.value.trim()))
      const link = children.length === 1 && children[0].type === 'element' && children[0].tagName === 'a' ? children[0] : undefined
      const href = link?.properties?.href
      if (typeof href !== 'string' || ctx.textContent(link).trim() !== href) return

      const id = parseYouTubeId(href)
      if (id) ctx.replaceNode(node, { type: 'raw', value: renderVideoEmbed(id) })
    },
  },
}

// Post images never render wider than the article (`.post-detail` max-width). Without
// this, browsers assume full viewport width and download larger files than needed.
/** @type {import('satteri').HastPluginEntry} */
const sizePostImagesToColumn = {
  name: 'size-post-images-to-column',
  element: {
    filter: ['img'],
    visit(node, ctx) {
      ctx.setProperty(node, 'sizes', '(min-width: 800px) 800px, 100vw')
    },
  },
}

// https://astro.build/config
export default defineConfig({
  site: SITE,
  output: 'static',
  // Astro 7 defaults to JSX-style whitespace stripping, which can glue inline words together.
  compressHTML: true,
  security: {
    // Astro hashes its own inline scripts and styles into a per-page <meta> CSP.
    // Anything third-party must be listed here (docs/ROADMAP.md PR 4).
    csp: {
      directives: [
        "default-src 'self'",
        // data: is the external-link icon (an inline SVG mask).
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self' https://plausible.io",
        "frame-src https://giscus.app https://www.youtube-nocookie.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      scriptDirective: {
        resources: ["'self'", 'https://plausible.io', 'https://giscus.app'],
      },
      styleDirective: {
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: 'https://giscus.app', kind: 'element' },
          // Shiki colors code blocks with style attributes. Attributes can't run script,
          // and <style> elements stay hash-locked. (Astro still warns about Shiki.)
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },
  image: {
    // Gives Markdown images a srcset instead of one full-size file.
    layout: 'constrained',
  },
  // Downloaded at build time and served from this site: no third-party requests, and
  // generated fallback metrics keep text from shifting while fonts load.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Arimo',
      cssVariable: '--font-arimo',
      weights: [400, 600],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Roboto',
      cssVariable: '--font-roboto',
      weights: [400, 500, 700],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Merriweather',
      cssVariable: '--font-merriweather',
      weights: [700],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Inconsolata',
      cssVariable: '--font-inconsolata',
      weights: [400, 600, 700],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['monospace'],
    },
  ],
  markdown: {
    processor: satteri({
      // Parse raw HTML in posts into elements so plugins (like the link rule) see it too.
      features: { rawHtml: true },
      hastPlugins: [embedStandaloneVideos, openExternalLinksInNewTab, sizePostImagesToColumn],
    }),
  },
  integrations: [sitemap(), vue()],
})
