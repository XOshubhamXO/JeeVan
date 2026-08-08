import CookieConsent from '@/components/cookie-consent'
import ExitFeedback from '@/components/exit-feedback'
import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import ClientLayout from './client-layout'
import JsonLd from '@/components/seo-jsonld'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })

export const metadata: Metadata = {
  title: 'JeeVan — Bridging Nature & Technology | Sustainable Agriculture from Nalanda, Bihar',
  description: 'JeeVan: Sustainable agriculture, organic produce, plant nursery, AI crop advisory, tech consulting, and social innovation. Built by Shubham Saurabh in Nalanda, Bihar.',
  keywords: ['JeeVan','sustainable agriculture','organic farming','natural produce','nursery plants','Bihar farming','Nalanda','tech consulting','crop advisory','plant directory','Magahi heirloom','Makhana','AI farming'],
  authors: [{ name: 'Shubham Saurabh', url: 'https://jee-van-two.vercel.app' }],
  creator: 'Shubham Saurabh',
  publisher: 'JeeVan Farms',
  metadataBase: new URL('https://jee-van-two.vercel.app'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'JeeVan — Bridging Nature & Technology',
    description: 'Sustainable agriculture, natural produce, and tech innovation from Nalanda, Bihar.',
    type: 'website', locale: 'en_IN', siteName: 'JeeVan',
    images: [{ url: 'https://jee-van-two.vercel.app/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'JeeVan — Bridging Nature & Technology', description: 'Sustainable agriculture, natural produce, and tech innovation.', images: ['https://jee-van-two.vercel.app/og-image.jpg'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  category: 'Agriculture',
}

export const viewport: Viewport = { themeColor: '#0a1508', width: 'device-width', initialScale: 1, maximumScale: 5 }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <JsonLd />
        <link rel="preconnect" href="https://restcountries.com" />
        <link rel="preconnect" href="https://api.open-meteo.com" />
        <link rel="preconnect" href="https://ipinfo.io" />
        <link rel="preload" as="image" href="/hero-community.jpg" fetchPriority="high" />
        <script dangerouslySetInnerHTML={{ __html:
          `try{var d=JSON.parse(localStorage.getItem('jeevan-user-session')||'{}');var t=d.state&&d.state.session&&d.state.session.selectedTheme;if(t)document.documentElement.dataset.theme=t}catch(e){}`
        }} />
        <script dangerouslySetInnerHTML={{ __html:
          `try{var o=new IntersectionObserver(function(e){e.forEach(function(e){e.isIntersecting&&(e.target.classList.add('visible'),o.unobserve(e.target))})},{threshold:0.15});document.addEventListener('DOMContentLoaded',function(){document.querySelectorAll('.reveal').forEach(function(e){o.observe(e)})})}catch(e){}`
        }} />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" href="/icons/icon-512.png" />
        <link rel="apple-touch-icon" href="/icons/icon-512.png" />
        <meta property="og:image" content="https://jee-van-two.vercel.app/og-image.jpg" />
        <meta name="twitter:image" content="https://jee-van-two.vercel.app/og-image.jpg" />
      </head>
      <body className="min-h-screen bg-[var(--bg-deep)] text-[var(--text-primary)] font-sans antialiased overflow-x-hidden">
        <ClientLayout>{children}</ClientLayout>
        <CookieConsent />
        <ExitFeedback />
      </body>
    </html>
  )
}
