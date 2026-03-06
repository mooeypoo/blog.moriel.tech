<template>
  <div>
    <h1 class="text-h4 mb-4">All posts</h1>
    <PostCards
      :posts="posts ?? []"
      :pending="pending"
      :show-all-posts-link="false"
    />
    <div v-if="totalPages > 1" class="d-flex justify-center mt-6">
      <v-pagination
        :length="totalPages"
        :model-value="page"
        :total-visible="7"
        show-first-last-page
        @update:model-value="goToPage"
      />
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const pageSize = 10
const page = computed(() => Math.max(1, parseInt(route.query.page, 10) || 1))

const { data: posts, pending } = await useAsyncData(
  () => `posts-page-${page.value}`,
  () =>
    queryContent('posts')
      .where({ draft: { $ne: true } })
      .sort({ date: -1 })
      .skip((page.value - 1) * pageSize)
      .limit(pageSize)
      .find()
)

const { data: totalPostsList } = await useAsyncData('posts-total', () =>
  queryContent('posts')
    .where({ draft: { $ne: true } })
    .only(['_path'])
    .find()
)

const totalPosts = computed(() => totalPostsList.value?.length ?? 0)
const totalPages = computed(() => Math.ceil(totalPosts.value / pageSize))

function goToPage (newPage) {
  const query = { ...route.query }
  if (newPage === 1) {
    delete query.page
  } else {
    query.page = String(newPage)
  }
  router.push({ path: '/posts', query })
}

// SEO Meta Tags
const siteUrl = 'https://blog.moriel.tech'
watchEffect(() => {
  const currentPage = page.value
  const url = currentPage === 1 ? `${siteUrl}/posts` : `${siteUrl}/posts?page=${currentPage}`
  const title = currentPage === 1 ? 'All Posts' : `All Posts - Page ${currentPage}`
  const description = 'Browse all blog posts on Moriel\'s Blog about human-centered software development, experiences, thoughts, and learnings.'
  
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
})
</script>
