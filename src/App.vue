<template>
  <AppLayout />
</template>

<script setup>
import { onMounted } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

onMounted(() => {
  // 初始化主题
  themeStore.initTheme()
})
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --theme-primary: #c20c0c;
  --theme-primary-rgb: 194, 12, 12;
  --theme-bg: #f5f5f5;
  --theme-bg-secondary: rgb(242, 242, 242);
  --theme-text: #333;
  --theme-text-rgb: 51, 51, 51;
  --theme-text-secondary: #666;
  --theme-border: #ddd;

  // 让 Element Plus 组件跟随项目主题色
  --el-color-primary: var(--theme-primary);
  --el-color-primary-light-3: color-mix(in srgb, var(--theme-primary), white 30%);
  --el-color-primary-light-5: color-mix(in srgb, var(--theme-primary), white 50%);
  --el-color-primary-light-7: color-mix(in srgb, var(--theme-primary), white 70%);
  --el-color-primary-light-8: color-mix(in srgb, var(--theme-primary), white 80%);
  --el-color-primary-light-9: color-mix(in srgb, var(--theme-primary), white 90%);
  --el-color-primary-dark-2: color-mix(in srgb, var(--theme-primary), black 20%);
  
  // Element Plus 文本颜色
  --el-text-color-primary: var(--theme-text);
  --el-text-color-regular: var(--theme-text);
  --el-text-color-secondary: var(--theme-text-secondary);
  --el-text-color-placeholder: var(--theme-text-secondary);
  --el-border-color: var(--theme-border);
  --el-border-color-light: var(--theme-border);
  --el-bg-color: var(--theme-bg);
  --el-bg-color-page: var(--theme-bg);
  --el-fill-color-blank: var(--theme-bg);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: var(--theme-text);
  background-color: var(--theme-bg);
  transition: background-color 0.3s, color 0.3s;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

#app {
  min-height: 100vh;
}

// 深色主题下播放器的样式
body.dark-theme {
  .player {
    background-color: #1a1a1a !important;
    border-top-color: #333 !important;
    .song-info .text .name {
      color: #fff !important;
    }
    .song-info .text .artist {
      color: #aaa !important;
    }
    .progress-bar {
      color: #fff !important;
    }
  }
}
</style>
