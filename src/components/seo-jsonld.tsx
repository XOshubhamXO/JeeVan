export default function JsonLd() {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'JeeVan',
    url: 'https://jee-van-two.vercel.app',
    logo: 'https://jee-van-two.vercel.app/icons/icon-512.png',
    description: 'Unified platform for sustainable agriculture, natural produce, nursery plants, and tech innovation from Nalanda, Bihar.',
    founder: { '@type': 'Person', name: 'Shubham Saurabh', jobTitle: 'Founder & Lead Engineer' },
    address: { '@type': 'PostalAddress', addressLocality: 'Mahamadpur', addressRegion: 'Bihar', addressCountry: 'IN', postalCode: '803110' },
    contactPoint: { '@type': 'ContactPoint', telephone: '+919009790421', contactType: 'customer service' },
    sameAs: ['https://jee-van-two.vercel.app'],
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'JeeVan',
    url: 'https://jee-van-two.vercel.app',
    potentialAction: { '@type': 'SearchAction', target: 'https://jee-van-two.vercel.app/api/search?q={search_term_string}', 'query-input': 'required name=search_term_string' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  )
}
