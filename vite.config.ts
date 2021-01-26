import reactRefresh from '@vitejs/plugin-react-refresh'
import { defineConfig } from 'vite'
import * as path from 'path';

export default defineConfig({
  plugins: [reactRefresh()],
  server: {
    host: "0.0.0.0",
    port: 8081,
    base: "./",
    open: false,
    proxy: {
      "/api": {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
      }
    }
  },
  // 配置别名
  alias: {
    //所以在eslint配置alias和文件中导入路径也要相应的修改
    '@': path.resolve(__dirname, 'src'),
  },
})
