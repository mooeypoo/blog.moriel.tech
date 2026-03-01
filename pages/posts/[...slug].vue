<template>
  <div v-if="post">
    <h1 class="text-h4 mb-2">{{ post.title }}</h1>
    <p v-if="post.date" class="text-medium-emphasis mb-4">{{ formatDate(post.date) }}</p>
    <div v-if="post.body" class="blog-prose">
      <ContentRenderer :value="post" />
    </div>
  </div>
  <div v-else-if="!pending">
    <h1 class="text-h4">Not found</h1>
    <p>This post does not exist or is a draft.</p>
    <NuxtLink to="/posts">Back to posts</NuxtLink>
  </div>
  <p v-else>Loading…</p>
</template>

<script setup>
const route = useRoute()
const slug = computed(() => Array.isArray(route.params.slug) ? route.params.slug.join('/') : (route.params.slug || ''))

const { data: post, pending } = await useAsyncData(
  () => `post-${slug.value}`,
  () => {
    const path = slug.value ? `posts/${slug.value}` : 'posts'
    return queryContent(path)
      .where({ draft: { $ne: true } })
      .findOne()
  }
)

function formatDate (d) {
  if (!d) return ''
  const date = new Date(d)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
