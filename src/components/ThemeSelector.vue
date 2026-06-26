<template>
  <div class="theme-selector">
    <button class="theme-btn" @click="showPanel = !showPanel">
      <span class="theme-icon">🎨</span>
      主题
    </button>
    
    <div v-if="showPanel" class="theme-panel">
      <div class="panel-header">
        <h3>选择主题</h3>
        <button @click="showPanel = false" class="close-btn">×</button>
      </div>
      
      <!-- 预设主题 -->
      <div class="theme-section">
        <h4>预设主题</h4>
        <div class="theme-grid">
          <div 
            v-for="theme in themeStore.presetThemes" 
            :key="theme.id"
            class="theme-item"
            :class="{ active: themeStore.currentTheme === theme.id }"
            @click="selectTheme(theme.id)"
          >
            <div class="theme-preview" :style="{ backgroundColor: theme.colors.primary }"></div>
            <span>{{ theme.name }}</span>
          </div>
        </div>
      </div>
      
      <!-- 流行风格 -->
      <div class="theme-section">
        <h4>流行风格</h4>
        <div class="theme-grid">
          <div 
            v-for="theme in themeStore.popularStyles" 
            :key="theme.id"
            class="theme-item"
            :class="{ active: themeStore.currentTheme === theme.id }"
            @click="selectTheme(theme.id)"
          >
            <div class="theme-preview" :style="{ backgroundColor: theme.colors.primary }"></div>
            <span>{{ theme.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const showPanel = ref(false)

const selectTheme = (themeId) => {
  themeStore.setTheme(themeId)
  showPanel.value = false
}
</script>

<style lang="scss" scoped>
.theme-selector {
  position: relative;
  
  .theme-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.3);
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;
    
    &:hover {
      background: rgba(255,255,255,0.1);
      border-color: rgba(255,255,255,0.5);
    }
  }
  
  .theme-panel {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    width: 320px;
    background: var(--theme-bg);
    border: 1px solid var(--theme-border);
    color: var(--theme-text);
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    z-index: 1000;
    padding: 16px;
    
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #eee;
      
      h3 { margin: 0; font-size: 16px; color: #333; }
      .close-btn {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: var(--theme-text-secondary);
      }
    }
    
    .theme-section {
      margin-bottom: 16px;
      &:last-child { margin-bottom: 0; }
      
      h4 {
        margin: 0 0 10px;
        font-size: 14px;
        color: var(--theme-text-secondary);
      }
      
      .theme-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        
        .theme-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
          
          &:hover {
            background-color: rgba(0, 0, 0, 0.05);
          }
          
          &.active {
            background-color: rgba(var(--theme-primary-rgb, 194, 12, 12), 0.1);
            span {
              color: var(--theme-primary);
              font-weight: bold;
            }
          }
          
          .theme-preview {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid var(--theme-border);
          }
          
          span {
            font-size: 12px;
            color: var(--theme-text);
          }
        }
      }
    }
  }
}
</style>
