import webpack from 'next/dist/compiled/webpack/webpack-lib.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // pptxgenjs verwijst naar node:fs en node:https; in de browser zijn die niet nodig
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(new webpack.NormalModuleReplacementPlugin(/^node:/, r => { r.request = r.request.replace(/^node:/, ''); }));
      config.resolve.fallback = { ...config.resolve.fallback, fs: false, https: false, http: false, os: false, path: false };
    }
    return config;
  },
};
export default nextConfig;
