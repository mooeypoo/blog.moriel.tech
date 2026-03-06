import vuetify from 'vite-plugin-vuetify'

const description = 'Static blog built with Nuxt 3, Vuetify, and Nuxt Content.'
const siteTitle = 'Blog'

export default defineNuxtConfig({
  ssr: true,
  srcDir: '.',

  build: {
    transpile: ['vuetify'],
  },

  app: {
    head: {
      titleTemplate: '%s - blog.moriel.tech',
      title: siteTitle,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: description },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Arimo:wght@400;600&family=Inconsolata:wght@400;600;700&display=swap',
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
})
