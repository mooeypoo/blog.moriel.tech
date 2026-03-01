<template>
  <div v-if="posts && posts.length">
    <div class="post-cards">
      <v-card
        v-for="post in posts"
        :key="post._path"
        class="post-card"
        variant="tonal"
        hover
        :to="postLink(post)"
      >
          <v-img
          v-if="post.image"
            :src="resolvePostImage(post)"
            :alt="post.title"
            cover
            class="post-card-image"
            aspect-ratio="2"
          />
          <v-card-title class="post-card-title text-wrap">
            {{ post.title }}
          </v-card-title>
          <v-card-subtitle v-if="post.date" class="post-card-date text-caption text-medium-emphasis">
            {{ formatDate(post.date) }}
          </v-card-subtitle>
          <v-card-text v-if="post.description" class="post-card-desc text-body2 text-medium-emphasis">
            {{ post.description }}
          </v-card-text>
        <v-card-actions class="pt-0">
          <v-btn variant="text" color="primary" size="small" :to="postLink(post)">
            Read more
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
    <v-btn to="/posts" variant="text" class="mt-4">
      All posts →
    </v-btn>
  </div>

  <p v-else-if="!pending" class="text-medium-emphasis">
    No posts yet.
  </p>
  <p v-else>Loading…</p>
</template>

<script setup>
const props = defineProps({
  posts: {
    type: Array,
    default: () => []
  },
  pending: {
    type: Boolean,
    default: false
  }
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

function resolvePostImage (post) {
  const img = post.image
  if (!img) return ''
  if (typeof img === 'string') return img.startsWith('/') ? img : `/${img}`
  if (img?.src) return img.src.startsWith('/') ? img.src : `/${img.src}`
  return ''
}
</script>

<style scoped>
.post-cards {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: 1fr;
}

@media (min-width: 960px) {
  .post-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

.post-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.post-card-image-wrap {
  overflow: hidden;
  border-radius: inherit;
}

.post-card-image {
  min-height: 140px;
}

.post-card-title {
  font-size: 1.1rem;
  line-height: 1.35;
  padding-top: 0.75rem;
}

.post-card-date {
  margin-top: -0.25rem;
  margin-bottom: 0.25rem;
}

.post-card-desc {
  flex: 1;
  margin-bottom: 0;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-card .v-card-actions {
  margin-top: auto;
  padding-bottom: 0.5rem;
}
</style>
