<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>
        <NuxtLink to="/" class="text-decoration-none text-inherit">
          Blog
        </NuxtLink>
      </v-app-bar-title>
      <v-spacer />
      <v-btn variant="text" to="/posts">Posts</v-btn>
      <v-btn variant="text" to="/tags">Tags</v-btn>
      <v-switch
        v-model="isDark"
        color="primary"
        hide-details
        density="compact"
        :true-icon="'mdi-weather-night'"
        :false-icon="'mdi-white-balance-sunny'"
      />
    </v-app-bar>

    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>

    <footer class="pa-4 text-center text-medium-emphasis">
      <NuxtLink to="/" class="text-decoration-none">Blog</NuxtLink>
      — static blog built with Nuxt 3, Vuetify, and Nuxt Content
    </footer>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const isDark = computed({
  get: () => theme.global.name.value === 'dark',
  set: (v) => { theme.global.name.value = v ? 'dark' : 'light' },
})
</script>
