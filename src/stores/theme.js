import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: 'default',
    // 预设主题
    presetThemes: [
      { id: 'default', name: '经典红', colors: { primary: '#c20c0c', bg: '#f5f5f5', text: '#333', textSecondary: '#666', border: '#ddd' } },
      { id: 'blue', name: '深空蓝', colors: { primary: '#1890ff', bg: '#f0f5ff', text: '#333', textSecondary: '#666', border: '#d9e7ff' } },
      { id: 'green', name: '森林绿', colors: { primary: '#52c41a', bg: '#f6ffed', text: '#333', textSecondary: '#666', border: '#d9f7be' } },
      { id: 'purple', name: '优雅紫', colors: { primary: '#722ed1', bg: '#f9f0ff', text: '#333', textSecondary: '#666', border: '#efdbff' } },
      { id: 'orange', name: '活力橙', colors: { primary: '#fa8c16', bg: '#fff7e6', text: '#333', textSecondary: '#666', border: '#ffe7ba' } },
      { id: 'dark', name: '暗夜模式', colors: { primary: '#177ddc', bg: '#141414', text: '#e5e5e5', textSecondary: '#999', border: '#333' } }
    ],
    // 模拟的流行风格
    popularStyles: [
      { id: 'lofi', name: 'Lofi 低保真', colors: { primary: '#8a7b7b', bg: '#e8e4e0', text: '#333', textSecondary: '#5e5656', border: '#d1cdc9' } },
      { id: 'synthwave', name: 'Synthwave', colors: { primary: '#ff71ce', bg: '#2c004e', text: '#f0f0f0', textSecondary: '#b0b0b0', border: '#4d0086' } },
      { id: 'sunset', name: '日落时分', colors: { primary: '#ff6a6a', bg: '#fff3f0', text: '#333', textSecondary: '#7d6a6a', border: '#ffdcd4' } },
      { id: 'forest', name: '森林童话', colors: { primary: '#2d6a4f', bg: '#e9f5e9', text: '#333', textSecondary: '#4a6d4a', border: '#cce3cc' } }
    ]
  }),
  getters: {
    currentThemeData: (state) => {
      const allThemes = [...state.presetThemes, ...state.popularStyles]
      return allThemes.find(theme => theme.id === state.currentTheme) || state.presetThemes[0]
    }
  },
  actions: {
    setTheme(themeId) {
      this.currentTheme = themeId
      localStorage.setItem('yun-music-theme', themeId)
      this.applyTheme()
    },
    applyTheme() {
      const theme = this.currentThemeData
      const root = document.documentElement
      const body = document.body
      
      // 将 hex 颜色转换为 rgb
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '194, 12, 12'
      }
      
      // 设置主题变量
      root.style.setProperty('--theme-primary', theme.colors.primary)
      root.style.setProperty('--theme-primary-rgb', hexToRgb(theme.colors.primary))
      root.style.setProperty('--theme-bg', theme.colors.bg)
      root.style.setProperty('--theme-bg-secondary', colorMixInSrgb(theme.colors.primary, theme.colors.bg, 0.05))
      root.style.setProperty('--theme-text', theme.colors.text)
      root.style.setProperty('--theme-text-rgb', hexToRgb(theme.colors.text))
      root.style.setProperty('--theme-text-secondary', theme.colors.textSecondary)
      root.style.setProperty('--theme-border', theme.colors.border)
      
      // 判断是否是深色主题
      const darkThemeIds = ['dark', 'synthwave']
      if (darkThemeIds.includes(this.currentTheme)) {
        body.classList.add('dark-theme')
      } else {
        body.classList.remove('dark-theme')
      }
      
      // 简单的颜色混合函数
      function colorMixInSrgb(color1, color2, amount) {
        const rgb1 = hexToRgb(color1).split(',').map(n => parseInt(n.trim()))
        const rgb2 = hexToRgb(color2).split(',').map(n => parseInt(n.trim()))
        
        const r = Math.round(rgb2[0] + (rgb1[0] - rgb2[0]) * amount)
        const g = Math.round(rgb2[1] + (rgb1[1] - rgb2[1]) * amount)
        const b = Math.round(rgb2[2] + (rgb1[2] - rgb2[2]) * amount)
        
        return `rgb(${r}, ${g}, ${b})`
      }
    },
    initTheme() {
      const savedTheme = localStorage.getItem('yun-music-theme')
      if (savedTheme) {
        this.currentTheme = savedTheme
      }
      this.applyTheme()
    }
  }
})
