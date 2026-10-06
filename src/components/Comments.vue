<template>
  <div id="giscus-comments" class="giscus-container"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  // Keyed to a stable id rather than the URL so threads survive URL changes.
  term: string
}>()

const GISCUS_ORIGIN = 'https://giscus.app'

let themeObserver: MutationObserver | null = null
// The lazy iframe sits on about:blank (our origin) until it scrolls into view, so posting to it
// earlier throws an origin mismatch. Giscus messaging us is the sign it's there to listen.
let giscusReady = false

function getGiscusTheme() {
  return document.documentElement.classList.contains('light-theme') ? 'light' : 'dark'
}

function syncGiscusTheme() {
  if (!giscusReady) return
  const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
  iframe?.contentWindow?.postMessage(
    {
      giscus: {
        setConfig: {
          theme: getGiscusTheme(),
        },
      },
    },
    GISCUS_ORIGIN
  )
}

// Syncing on the first message also catches a theme toggled before the iframe loaded.
function onGiscusMessage(event: MessageEvent) {
  if (event.origin !== GISCUS_ORIGIN || giscusReady) return
  giscusReady = true
  syncGiscusTheme()
}

onMounted(() => {
  window.addEventListener('message', onGiscusMessage)

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.async = true
  script.crossOrigin = 'anonymous'
  script.setAttribute('data-repo', 'mooeypoo/blog.moriel.tech-discussion')
  script.setAttribute('data-repo-id', 'R_kgDORdwSNA')
  script.setAttribute('data-category', 'Announcements')
  script.setAttribute('data-category-id', 'DIC_kwDORdwSNM4C3oOm')
  script.setAttribute('data-mapping', 'specific')
  script.setAttribute('data-term', props.term)
  // Without strict matching, Giscus fuzzy-searches titles: "intro" could load the "dddnd-intro" thread.
  script.setAttribute('data-strict', '1')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '1')
  script.setAttribute('data-input-position', 'top')
  script.setAttribute('data-theme', getGiscusTheme())
  script.setAttribute('data-lang', 'en')
  script.setAttribute('data-loading', 'lazy')

  const container = document.getElementById('giscus-comments')
  if (container) {
    container.appendChild(script)
  }

  themeObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        syncGiscusTheme()
      }
    }
  })

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
})

onUnmounted(() => {
  window.removeEventListener('message', onGiscusMessage)
  themeObserver?.disconnect()
  themeObserver = null
})
</script>

<style scoped>
.giscus-container {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
