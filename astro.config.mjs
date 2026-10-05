// @ts-check
import { defineConfig, fontProviders } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import vue from '@astrojs/vue'
import { satteri } from '@astrojs/markdown-satteri'

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

// https://astro.build/config
export default defineConfig({
  site: SITE,
  output: 'static',
  // Astro 7 defaults to JSX-style whitespace stripping, which can glue inline words together.
  compressHTML: true,
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
      hastPlugins: [openExternalLinksInNewTab],
    }),
  },
  integrations: [sitemap(), vue()],
})
