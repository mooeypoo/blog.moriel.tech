<template>
  <div class="py-8">
    <h1 class="text-h5 mb-6">Latest posts</h1>
    <v-divider class="mb-4" />
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
    <v-divider v-if="posts && posts.length" class="my-4" />
    <v-btn v-if="posts && posts.length" to="/posts" variant="text" class="mt-2">
      All posts →
    </v-btn>
  </div>
</template>

<script setup>
const { data: posts, pending } = await useAsyncData('home-posts', () =>
  queryContent('posts')
    .where({ draft: { $ne: true } })
    .sort({ date: -1 })
    .limit(10)
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
