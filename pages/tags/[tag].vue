<template>
  <div>
    <h1 class="text-h4 mb-4">Posts tagged “{{ tag }}”</h1>
    <PostCards
      :posts="posts"
      :pending="pending"
      empty-message="No posts with this tag."
    />
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

// SEO Meta Tags
const siteUrl = 'https://blog.moriel.tech'
watchEffect(() => {
  const tagName = tag.value
  const url = `${siteUrl}/tags/${encodeURIComponent(tagName)}`
  const title = `Posts tagged "${tagName}"`
  const description = `Browse all posts tagged with "${tagName}" on Moriel's Blog.`
  
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
