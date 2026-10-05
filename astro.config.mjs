// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import vue from '@astrojs/vue'
import { satteri } from '@astrojs/markdown-satteri'

/** @type {import('satteri').HastPluginEntry} */
const openMarkdownLinksInNewTab = {
  name: 'open-links-in-new-tab',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      const rel = node.properties?.rel
      const relValues = Array.isArray(rel)
        ? rel
        : typeof rel === 'string'
          ? rel.split(/\s+/).filter(Boolean)
          : []

      ctx.setProperty(node, 'target', '_blank')
      ctx.setProperty(node, 'rel', [...new Set([...relValues, 'noopener', 'noreferrer'])].join(' '))
    },
  },
}

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.moriel.tech',
  output: 'static',
  // Astro 7 defaults to JSX-style whitespace stripping, which can glue inline words together.
  compressHTML: true,
  markdown: {
    processor: satteri({
      hastPlugins: [openMarkdownLinksInNewTab],
    }),
  },
  integrations: [sitemap(), vue()],
})
