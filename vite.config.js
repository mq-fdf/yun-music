import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
      vue(),
      viteMockServe({
        enable: true, // 始终开启 mock
        mockPath: 'mock',
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // GitHub Pages 部署配置
    base: '/yun-music/',
  }
})
