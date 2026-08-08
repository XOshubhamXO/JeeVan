/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─── Image optimization ───
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'ucarecdn.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // ─── Security headers ───
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
        ],
      },
      {
        source: '/admin/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/icons/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
    ]
  },

  // ─── Redirects ───
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/alpha',
        permanent: true,
      },
    ]
  },

  // ─── Compiler options ───
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // ─── Experimental (Next.js 14) ───
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@react-three/fiber',
      '@react-three/drei',
    ],
  },

  // ─── Webpack config for Three.js GLSL shaders ───
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: 'asset/source',
    })
    return config
  },

  // ─── Powered by header ───
  poweredByHeader: false,
}

export default nextConfig
