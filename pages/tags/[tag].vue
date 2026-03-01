<template>
  <div>
    <h1 class="text-h4 mb-4">Posts tagged “{{ tag }}”</h1>
    <v-list v-if="posts && posts.length">
      <v-list-item
        v-for="post in posts"
        :key="post._path"
        :to="postLink(post)"
        class="mb-2"
      >
        <template #title>{{ post.title }}</template>
        <template #subtitle>
          <span v-if="post.date">{{ formatDate(post.date) }}</span>
          <span v-if="post.description"> — {{ post.description }}</span>
        </template>
      </v-list-item>
    </v-list>
    <p v-else-if="!pending" class="text-medium-emphasis">
      No posts with this tag.
    </p>
    <p v-else>Loading…</p>
    <NuxtLink to="/tags" class="d-inline-block mt-4">← All tags</NuxtLink>
  </div>
</template>

<script setup>
const route = useRoute()
const tag = computed(() => {
  const t = route.params.tag
  return typeof t === 'string' ? decodeURIComponent(t) : (t && t[0] ? decodeURIComponent(t[0]) : '')
})

const { data: allPosts, pending } = await useAsyncData(
  () => `tag-${tag.value}`,
  () =>
    queryContent('posts')
      .where({ draft: { $ne: true } })
      .find()
)

const posts = computed(() => {
  const list = allPosts.value || []
  const t = tag.value
  if (!t) return list
  return list.filter((post) => {
    const tags = post.tags || []
    return tags.includes(t)
  })
})

function postLink (post) {
  const path = post._path || ''
  return path.startsWith('/') ? path : `/posts/${path}`
}

function formatDate (d) {
  if (!d) return ''
  const date = new Date(d)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
