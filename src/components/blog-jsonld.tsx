interface BlogPostSchema {
  title: string
  excerpt: string
  image: string
  date: string
  author: string
  slug: string
  tags: string[]
}

export default function BlogPostJsonLd({ post }: { post: BlogPostSchema }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: `https://jee-van-two.vercel.app${post.image}`,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'JeeVan',
      logo: { '@type': 'ImageObject', url: 'https://jee-van-two.vercel.app/icons/icon-512.png' },
    },
    url: `https://jee-van-two.vercel.app/blog/${post.slug}`,
    keywords: post.tags.join(', '),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://jee-van-two.vercel.app/blog/${post.slug}` },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
