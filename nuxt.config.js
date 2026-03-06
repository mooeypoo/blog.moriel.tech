import vuetify from 'vite-plugin-vuetify'

const description = 'A blog about human-centered software development, experiences, thoughts, and learnings.'
const siteTitle = 'Moriel Writes Tech'
const siteUrl = 'https://blog.moriel.tech'
const author = 'Moriel Schottlender'

export default defineNuxtConfig({
  ssr: true,
  srcDir: '.',

  build: {
    transpile: ['vuetify'],
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      titleTemplate: '%s - blog.moriel.tech',
      title: siteTitle,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: description },
        { name: 'author', content: author },
        
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: siteTitle },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:url', content: siteUrl },
        { property: 'og:title', content: siteTitle },
        { property: 'og:description', content: description },
        { property: 'og:image', content: `${siteUrl}/moriel-320px.jpg` },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:site', content: '@mooeypoo' },
        { name: 'twitter:creator', content: '@mooeypoo' },
        { name: 'twitter:title', content: siteTitle },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: `${siteUrl}/moriel-320px.jpg` },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: siteUrl },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Arimo:wght@400;600&family=Inconsolata:wght@400;600;700&family=Merriweather:wght@700&family=Roboto:wght@400;500;700&display=swap',
        },
      ],
    },
  },

  modules: [
    '@nuxt/content',
    (options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins = config.plugins || []
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@nuxt/image',
    '@nuxtjs/sitemap',
  ],

  vite: {
    vue: {
      template: {
        transformAssetUrls: true,
      },
    },
  },

  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      failOnError: false,
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/posts': { prerender: true },
    '/posts/**': { prerender: true },
    '/tags': { prerender: true },
    '/tags/**': { prerender: true },
  },

  image: {
    dir: 'assets/images',
  },

  // Sitemap configuration
  site: {
    url: siteUrl,
  },

  sitemap: {
    strictNuxtContentPaths: true,
    exclude: [],
  },
})
