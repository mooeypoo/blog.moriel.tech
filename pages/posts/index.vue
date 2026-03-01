<template>
  <div>
    <h1 class="text-h4 mb-4">All posts</h1>
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
      No posts yet.
    </p>
    <p v-else>Loading…</p>
  </div>
</template>

<script setup>
const { data: posts, pending } = await useAsyncData('all-posts', () =>
  queryContent('posts')
    .where({ draft: { $ne: true } })
    .sort({ date: -1 })
    .find()
)

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
