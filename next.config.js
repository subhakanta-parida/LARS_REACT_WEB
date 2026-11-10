const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      '@manulife/mux',
      '@manulife/mux-cds-icons',
      '@manulife/mux-logos',
    ],
  },
};

module.exports = nextConfig;