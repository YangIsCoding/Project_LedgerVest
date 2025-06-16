// web/next.config.js
const path = require('node:path');

const polyfillAbs = path.resolve(__dirname, 'src/polyfills/indexeddb.js');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// ★ Edge-route 的名字規則：
//   - app/api/…/route        (Edge)
//   - src/middleware         (Edge)
//   - (若要改成 Node runtime 可在該檔 export { runtime:'nodejs' })
const EDGE_ENTRY_RE = /\/route$|^src\/middleware$/;

const nextConfig = {
  trailingSlash: true,

  experimental: {
    // ⬅️ 關閉有 bug 的官方 CSS 最佳化
    optimizeCss: false,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  }
};

module.exports = withBundleAnalyzer({
  ...nextConfig
});
