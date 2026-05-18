/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [40, 60, 75],
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2592000,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'elbxclhtmlbdlegsfzqh.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      // ─── Old category → New parent routes (301 permanent) ───
      { source: '/category/visa-news', destination: '/visa/', permanent: true },
      { source: '/category/visa-news/h1b-visa', destination: '/visa/h-1b/', permanent: true },
      { source: '/category/visa-news/f1-opt', destination: '/students/opt/', permanent: true },
      { source: '/category/visa-news/green-card', destination: '/green-card/', permanent: true },
      { source: '/category/visa-news/uscis-updates', destination: '/uscis/policy-updates/', permanent: true },
      { source: '/category/visa-news/b1-b2', destination: '/visa/b1-b2/', permanent: true },
      { source: '/category/visa-news/consulate-alerts', destination: '/visa/visa-stamping/', permanent: true },
      { source: '/category/visa-guides', destination: '/guides/', permanent: true },
      { source: '/category/visa-guides/how-to', destination: '/guides/how-to/', permanent: true },
      { source: '/category/visa-guides/application-steps', destination: '/guides/application-process/', permanent: true },
      { source: '/category/visa-guides/faqs', destination: '/guides/faqs/', permanent: true },
      { source: '/category/processing-times', destination: '/uscis/processing-times/', permanent: true },
      { source: '/category/processing-times/:sub', destination: '/uscis/processing-times/', permanent: true },
      { source: '/category/visa-bulletin', destination: '/green-card/visa-bulletin/', permanent: true },
      { source: '/category/visa-bulletin/:sub', destination: '/green-card/visa-bulletin/', permanent: true },
      { source: '/category/fee-calculator', destination: '/guides/', permanent: true },
      { source: '/category/fee-calculator/:sub', destination: '/guides/', permanent: true },
      { source: '/category/tools', destination: '/guides/', permanent: true },
      { source: '/category/tools/:sub', destination: '/guides/', permanent: true },
      { source: '/category/about', destination: '/', permanent: true },
      { source: '/category/about/:sub', destination: '/', permanent: true },
      // Catch-all for any remaining /category/ routes
      { source: '/category/:slug', destination: '/:slug/', permanent: true },
      { source: '/category/:slug/:sub', destination: '/:slug/:sub/', permanent: true },

      // ─── Live Updates → Topic Cluster URLs (301 permanent) ───
      { source: '/live-updates/ice-immigration-enforcement-updates-live', destination: '/ice-news/', permanent: true },
      { source: '/live-updates/immigration-news-today-trump-announcements-uscis-updates-policy-developments', destination: '/immigration-news/', permanent: true },
      // Catch-all: any remaining /live-updates/:slug → homepage
      { source: '/live-updates/:slug', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
