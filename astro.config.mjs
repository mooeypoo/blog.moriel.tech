// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import vue from '@astrojs/vue'

function openMarkdownLinksInNewTab() {
  return (tree) => {
    const visit = (node) => {
      if (!node || typeof node !== 'object') {
        return
      }

      if (node.type === 'element' && node.tagName === 'a') {
        node.properties ??= {}
        node.properties.target = '_blank'

        const rel = node.properties.rel
        const relValues = Array.isArray(rel)
          ? rel
          : typeof rel === 'string'
            ? rel.split(/\s+/).filter(Boolean)
            : []

        node.properties.rel = [...new Set([...relValues, 'noopener', 'noreferrer'])]
      }

      if (Array.isArray(node.children)) {
        node.children.forEach(visit)
      }
    }

    visit(tree)
  }
}

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.moriel.tech',
  output: 'static',
  markdown: {
    rehypePlugins: [openMarkdownLinksInNewTab],
  },
  integrations: [sitemap(), vue()],
})
