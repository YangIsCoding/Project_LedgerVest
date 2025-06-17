

const nextConfig = {
  trailingSlash: true,

  experimental: {
    // ⬅️ 關閉有 bug 的官方 CSS 最佳化
    optimizeCss: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  }
};

module.exports = ({
  ...nextConfig
});
