export const SITE_URL = 'https://blog.moriel.tech'
export const AUTHOR = 'Moriel Schottlender'
export const SITE_TITLE = 'Moriel Writes Tech'
export const SITE_DESCRIPTION = 'A blog about human-centered software development, experiences, thoughts, and learnings.'
export const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/moriel-320px.jpg`

export function toAbsoluteUrl(pathOrUrl?: string) {
  if (!pathOrUrl) return undefined
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  return pathOrUrl.startsWith('/') ? `${SITE_URL}${pathOrUrl}` : `${SITE_URL}/${pathOrUrl}`
}

export function resolveSocialImage(pathOrUrl?: string) {
  return toAbsoluteUrl(pathOrUrl) || DEFAULT_SOCIAL_IMAGE
}

export interface SEOMeta {
  title: string
  description: string
  canonical: string
  ogType?: string
  ogImage?: string
  twitterCard?: string
}

export function generateSEOMeta(meta: SEOMeta): SEOMeta & { titleTemplate: string } {
  return {
    ...meta,
    titleTemplate: `${meta.title} - blog.moriel.tech`,
    ogType: meta.ogType || 'website',
    ogImage: resolveSocialImage(meta.ogImage),
    twitterCard: meta.twitterCard || 'summary',
  }
}

export interface BlogPostingSchema {
  '@context': string
  '@type': string
  headline: string
  description: string
  image?: string
  datePublished: string
  dateModified: string
  author: {
    '@type': string
    name: string
    url: string
  }
  publisher: {
    '@type': string
    name: string
    logo: {
      '@type': string
      url: string
    }
  }
  mainEntityOfPage: {
    '@type': string
    '@id': string
  }
  keywords?: string
}

export function generateBlogPostingSchema(params: {
  title: string
  description: string
  url: string
  datePublished: Date
  dateModified?: Date
  image?: string
  tags?: string[]
}): BlogPostingSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: params.title,
    description: params.description,
    image: resolveSocialImage(params.image),
    datePublished: params.datePublished.toISOString(),
    dateModified: (params.dateModified || params.datePublished).toISOString(),
    author: {
      '@type': 'Person',
      name: AUTHOR,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: AUTHOR,
      logo: {
        '@type': 'ImageObject',
        url: DEFAULT_SOCIAL_IMAGE,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': params.url,
    },
    keywords: params.tags?.join(', '),
  }
}
