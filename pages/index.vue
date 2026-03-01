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
          <h1 class="text-h4 text-md-h3 font-weight-medium mb-3">
            Welcome
          </h1>
          <p class="text-body1 text-medium-emphasis">
            This is my tech blog. I write about software, tools, and things I’m working on.
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
