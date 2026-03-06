<template>
  <div id="giscus-comments" class="giscus-container"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const GISCUS_ORIGIN = 'https://giscus.app'

let themeObserver: MutationObserver | null = null

function getGiscusTheme() {
  return document.documentElement.classList.contains('light-theme') ? 'light' : 'dark'
}

function syncGiscusTheme() {
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

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.async = true
  script.crossOrigin = 'anonymous'
  script.setAttribute('data-repo', 'mooeypoo/blog.moriel.tech-discussion')
  script.setAttribute('data-repo-id', 'R_kgDORdwSNA')
  script.setAttribute('data-category', 'Announcements')
  script.setAttribute('data-category-id', 'DIC_kwDORdwSNM4C3oOm')
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '1')
  script.setAttribute('data-input-position', 'top')
  script.setAttribute('data-theme', getGiscusTheme())
  script.setAttribute('data-lang', 'en')
  script.setAttribute('data-loading', 'lazy')
  script.addEventListener('load', () => {
    requestAnimationFrame(syncGiscusTheme)
  })

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
