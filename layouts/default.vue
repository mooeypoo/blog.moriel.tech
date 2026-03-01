<template>
  <v-app class="layout-sticky-footer">
    <v-navigation-drawer
      v-if="display.xs"
      v-model="navdrawer"
    >
      <v-list>
        <v-list-item>
          <template #prepend>
            <v-avatar>
              <v-img
                alt="Moriel Schottlender"
                src="/gravatar.jpg"
              />
            </v-avatar>
          </template>
        </v-list-item>
        <v-list-item
          href="#"
          @click="$router.push({ path: '/', query: { era: $route.query.era } }); $event.preventDefault()"
        >
          <v-list-item-title class="text-h6">
            Moriel Schottlender
          </v-list-item-title>
          <v-list-item-subtitle>
            Human-centered software
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <v-divider />

      <v-list density="compact" active-color="pink-accent-3">
        <v-list-item to="/posts" @click="navdrawer = false">
          <v-list-item-title>Posts</v-list-item-title>
        </v-list-item>
        <v-list-item to="/tags" @click="navdrawer = false">
          <v-list-item-title>Tags</v-list-item-title>
        </v-list-item>
        <v-divider class="my-2" />
        <v-list-item
          :href="mainSiteUrl"
          target="_blank"
          rel="noopener noreferrer"
          @click="navdrawer = false"
        >
          <v-list-item-title>About me</v-list-item-title>
        </v-list-item>
        <v-list-item
          :href="contactUrl"
          target="_blank"
          rel="noopener noreferrer"
          @click="navdrawer = false"
        >
          <v-list-item-title>Contact</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar class="pr-4">
      <v-avatar
        size="36"
        class="mr-5"
        image="/moriel-320px.jpg"
        @click="goTo('/')"
      />
      <v-app-bar-title
        v-if="!display.xs"
        @click="goTo('/')"
      >
        {{ title }}
      </v-app-bar-title>
      <v-spacer v-if="!display.xs" />
      <v-btn-toggle
        v-if="!display.xs"
        v-model="navMenu"
        color="pink-accent-3"
        :mandatory="true"
        class="blog-nav-toggle"
      >
        <v-btn value="posts" @click="goTo('/posts')">
          <v-icon start>mdi-format-list-bulleted</v-icon>
          Posts
        </v-btn>
        <v-btn value="tags" @click="goTo('/tags')">
          <v-icon start>mdi-tag-multiple</v-icon>
          Tags
        </v-btn>
      </v-btn-toggle>
      <v-spacer />
      <v-btn
        v-if="!display.xs"
        variant="text"
        :href="mainSiteUrl"
        target="_blank"
        rel="noopener noreferrer"
        size="small"
        append-icon="mdi-open-in-new"
      >
        About me
      </v-btn>
      <v-btn
        v-if="!display.xs"
        variant="text"
        :href="contactUrl"
        target="_blank"
        rel="noopener noreferrer"
        size="small"
        append-icon="mdi-open-in-new"
      >
        Contact
      </v-btn>
      <v-spacer />
      <v-switch
        v-model="isDark"
        color="primary"
        hide-details
        density="compact"
        :true-icon="'mdi-weather-night'"
        :false-icon="'mdi-white-balance-sunny'"
      />
      <v-app-bar-nav-icon
        v-if="display.xs"
        @click.stop="navdrawer = !navdrawer"
      />
    </v-app-bar>

    <v-main class="layout-main">
      <v-container>
        <slot />
      </v-container>
    </v-main>

    <v-divider />
    <div class="layout-footer">
      <Footer />
    </div>
    <!-- <footer class="layout-footer pa-4 text-center text-medium-emphasis">
      <NuxtLink to="/" class="text-decoration-none">Blog</NuxtLink>
      — static blog built with Nuxt 3, Vuetify, and Nuxt Content
    </footer> -->
  </v-app>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from 'vuetify'
import { useDisplaySSRSafe } from '~/composables/useDisplaySSRSafe'
import Footer from '~/components/Footer.vue'

const title = 'Moriel Writes Tech'
const mainSiteUrl = 'https://moriel.tech'
const contactUrl = 'https://moriel.tech/contact'
const route = useRoute()
const { display } = useDisplaySSRSafe()
const navdrawer = ref(false)
const navMenu = ref('posts')

function pathToMenu (path) {
  if (path?.startsWith('/tags')) return 'tags'
  return 'posts'
}
watch(() => route.path, (path) => { navMenu.value = pathToMenu(path) }, { immediate: true })

function goTo (path) {
  return navigateTo(path)
}

const theme = useTheme()
const isDark = computed({
  get: () => theme.global.name.value === 'dark',
  set: (v) => { theme.global.name.value = v ? 'dark' : 'light' },
})
</script>

<style scoped>
.layout-sticky-footer {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
.layout-main {
  flex: 1 1 auto;
  /* Reserve space for fixed app bar on first paint (avoids SSR hydration jump) */
  padding-top: 64px;
}
.layout-footer {
  flex-shrink: 0;
}

/* Match moriel.tech menu: white (unselected) + pink background when selected */
.blog-nav-toggle .v-btn {
  color: rgb(var(--v-theme-on-surface));
}
.blog-nav-toggle .v-btn.v-btn--active {
  background: rgb(var(--v-theme-pink-accent-3));
  color: rgb(var(--v-theme-on-pink-accent-3));
}

/* Sticky footer: app fills viewport, main scrolls, footer at bottom */
.layout-sticky-footer.v-application {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding-bottom: 0;
}

.layout-sticky-footer .layout-main {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.layout-sticky-footer .layout-main .container {
  flex: 1;
}

.layout-sticky-footer .layout-footer {
  flex-shrink: 0;
}

</style>
