<template>
  <div>
    <h1 class="text-h4 mb-4">Tags</h1>
    <v-list v-if="tagCounts && tagCounts.length">
      <v-list-item
        v-for="item in tagCounts"
        :key="item.tag"
        :to="`/tags/${encodeURIComponent(item.tag)}`"
      >
        <template #title>{{ item.tag }}</template>
        <template #subtitle>{{ item.count }} post{{ item.count !== 1 ? 's' : '' }}</template>
      </v-list-item>
    </v-list>
    <p v-else-if="!pending" class="text-medium-emphasis">
      No tags yet.
    </p>
    <p v-else>Loading…</p>
  </div>
</template>

<script setup>
const { data: posts, pending } = await useAsyncData('all-posts-tags', () =>
  queryContent('posts')
    .where({ draft: { $ne: true } })
    .find()
)

const tagCounts = computed(() => {
  const list = posts.value || []
  const counts = {}
  for (const post of list) {
    const tags = post.tags || []
    for (const tag of tags) {
      if (tag) counts[tag] = (counts[tag] || 0) + 1
    }
  }
  return Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
})

// SEO Meta Tags
const siteUrl = 'https://blog.moriel.tech'
const url = `${siteUrl}/tags`
const title = 'Tags'
const description = 'Browse all tags on Moriel\'s Blog.'

useSeoMeta({
  title: title,
  description: description,
  ogType: 'website',
  ogUrl: url,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary',
  twitterTitle: title,
  twitterDescription: description,
})

useHead({
  link: [
    { rel: 'canonical', href: url }
  ]
})
</script>
