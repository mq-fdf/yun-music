import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'


export default defineConfig(({ command }) => {
  return {
    plugins: [
      vue(),
      nodePolyfills({
        include: ['crypto', 'buffer'],
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
        protocolImports: true,
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // 开发环境使用 '/'，生产环境使用 '/yun-music/' (用于 GitHub Pages)
    base: command === 'build' ? '/yun-music/' : '/',
    server: {
    }
  }
})
