const proxySettings = {
  // 代理
  '/api': {
    target: 'http://localhost:9102/',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/',
    },
  },
}

module.exports = proxySettings
