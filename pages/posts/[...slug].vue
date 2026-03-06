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
  `post-${slug.value}`,
  () => {
    if (!slug.value) return null
    const path = `posts/${slug.value}`
    return queryContent(path)
      .where({ draft: { $ne: true } })
      .findOne()
  },
  {
    watch: [slug],
    getCachedData: (key) => useNuxtApp().payload.data[key] || useNuxtApp().static.data[key]
  }
)

// SEO Meta Tags
const siteUrl = 'https://blog.moriel.tech'
const author = 'Moriel Schottlender'

watchEffect(() => {
  if (post.value) {
    const url = `${siteUrl}/posts/${slug.value}`
    const title = post.value.title || 'Blog Post'
    const description = post.value.description || 'A blog post by Moriel Schottlender'
    const imageUrl = post.value.image 
      ? `${siteUrl}${post.value.image}` 
      : `${siteUrl}/moriel-320px.jpg`
    const publishedTime = post.value.date ? new Date(post.value.date).toISOString() : null
    
    useSeoMeta({
      title: title,
      description: description,
      author: author,
      
      // Open Graph
      ogType: 'article',
      ogUrl: url,
      ogTitle: title,
      ogDescription: description,
      ogImage: imageUrl,
      ogImageAlt: title,
      ogSiteName: 'Moriel\'s Blog',
      ogLocale: 'en_US',
      articleAuthor: author,
      articlePublishedTime: publishedTime,
      articleTag: post.value.tags,
      
      // Twitter Card
      twitterCard: 'summary_large_image',
      twitterSite: '@mooeypoo',
      twitterCreator: '@mooeypoo',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: imageUrl,
      twitterImageAlt: title,
    })
    
    // Structured Data (JSON-LD)
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description: description,
      image: imageUrl,
      datePublished: publishedTime,
      dateModified: publishedTime,
      author: {
        '@type': 'Person',
        name: author,
        url: siteUrl,
      },
      publisher: {
        '@type': 'Person',
        name: author,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/moriel-320px.jpg`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      },
      keywords: post.value.tags?.join(', '),
    }
    
    useHead({
      link: [
        { rel: 'canonical', href: url }
      ],
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(structuredData),
        }
      ]
    })
  }
})

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