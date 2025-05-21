// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // 🔥 desativa o otimizador do Next
  },
};

module.exports = nextConfig;
