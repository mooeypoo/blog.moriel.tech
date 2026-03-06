<template>
  <div class="home-page">
    <!-- Hero: photo + welcome -->
    <section class="home-hero">
      <div class="home-hero-inner">
        <v-avatar size="200" class="home-photo">
          <v-img
            alt="Moriel Schottlender"
            src="/moriel-320px.jpg"
            cover
          />
        </v-avatar>
        <div class="home-intro">
          <h2 class="text-h4 text-md-h3 font-weight-medium mb-3">
            Hi, I'm Moriel
          </h2>
          <p class="text-body1 text-medium-emphasis">
            I create human-centered software. This is where I write about my experiences, thoughts, and learnings.
          </p>
        </div>
      </div>
    </section>

    <!-- Latest posts -->
    <section class="home-posts">
      <h2 class="text-h5 mb-4">Latest posts</h2>
      <v-divider class="mb-4" />
      <PostCards :posts="posts" :pending="pending" />
    </section>
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

// SEO Meta Tags
const siteUrl = 'https://blog.moriel.tech'
const title = 'Moriel\'s Blog'
const description = 'A blog about human-centered software development, experiences, thoughts, and learnings by Moriel Schottlender.'

useSeoMeta({
  title: title,
  description: description,
  author: 'Moriel Schottlender',
  
  // Open Graph
  ogType: 'website',
  ogUrl: siteUrl,
  ogTitle: title,
  ogDescription: description,
  ogImage: `${siteUrl}/moriel-320px.jpg`,
  ogImageAlt: 'Moriel Schottlender',
  ogSiteName: title,
  ogLocale: 'en_US',
  
  // Twitter Card
  twitterCard: 'summary',
  twitterSite: '@mooeypoo',
  twitterCreator: '@mooeypoo',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: `${siteUrl}/moriel-320px.jpg`,
  twitterImageAlt: 'Moriel Schottlender',
})

useHead({
  link: [
    { rel: 'canonical', href: siteUrl }
  ]
})
</script>

<style scoped>
.home-page {
  padding-bottom: 2rem;
}

.home-hero {
  margin-bottom: 2.5rem;
}

.home-hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
}

@media (min-width: 600px) {
  .home-hero-inner {
    flex-direction: row;
    text-align: left;
    justify-content: center;
    gap: 2rem;
  }
}

.home-photo {
  flex-shrink: 0;
}

.home-intro {
  max-width: 42ch;
}

.home-intro h1 {
  line-height: 1.25;
}

.home-posts h2 {
  font-weight: 500;
}
</style>
