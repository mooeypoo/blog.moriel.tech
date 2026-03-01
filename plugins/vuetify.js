import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '~/assets/css/main.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const darkTheme = {
  dark: true,
  colors: {
    primary: '#1565C0',
    accent: '#424242',
    secondary: '#FF8F00',
    info: '#4DB6AC',
    warning: '#FFC107',
    error: '#FF5722',
    success: '#69F0AE',
  },
}

const lightTheme = {
  dark: false,
  colors: {
    primary: '#1565C0',
    accent: '#424242',
    secondary: '#FF8F00',
    info: '#4DB6AC',
    warning: '#FFC107',
    error: '#FF5722',
    success: '#69F0AE',
  },
}

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: darkTheme,
        light: lightTheme,
      },
    },
  })
  nuxtApp.vueApp.use(vuetify)
})
