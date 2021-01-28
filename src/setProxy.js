const proxySettings = {
  // 代理
  '/api': {
    target: 'http://198.168.111.111:3002',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '',
    },
  },
}

module.exports = proxySettings
