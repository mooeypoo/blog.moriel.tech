<template>
  <div v-if="post" class="post-page">
    <v-container class="h-100 d-flex align-center justify-center mb-10">
      <div class="w-md-75 w-100 text-center">
        <h1 class="text-h4 text-md-h3nuxt font-weight-bold my-2">
          {{ post.title }}
        </h1>

        <div v-if="post.date" class="text-subtitle-2 mb-2">
          {{ formatDate(post.date) }}
        </div>
        <div v-if="post.description" class="text-body-1 text-medium-emphasis mb-4">
          {{ post.description }}
        </div>

        <div class="d-flex ga-4 justify-center">
          <v-chip
            v-for="tag in post.tags"
            :key="tag"
            size="small"
            variant="outlined"
            color="primary"
            prepend-icon="mdi-pound"
            :to="`/tags/${encodeURIComponent(tag)}`"
          >
            {{ tag }}
          </v-chip>
        </div>
      </div>
    </v-container>
    <div v-if="post.body" class="blog-prose">
      <ContentRenderer :value="post">
        <template #empty>
          <p class="text-body-1 text-medium-emphasis">No post content yet.</p>
        </template>
      </ContentRenderer>
      <Giscus
        id="comments"
        repo="mooeypoo/blog.moriel.tech-discussion"
        repo-id="R_kgDORdwSNA"
        category="Announcements"
        category-id="DIC_kwDORdwSNM4C3oOm"
        mapping="pathname"
        strict="0"
        reactions-enabled="1"
        emit-metadata="1"
        input-position="top"
        theme="preferred_color_scheme"
        lang="en"
        loading="lazy"
        crossorigin="anonymous"
      />
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
import Giscus from '@giscus/vue'

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

<style scoped>
.post-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>