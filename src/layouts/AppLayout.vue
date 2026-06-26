<template>
  <div class="app-layout">
    <header class="app-header">
      <NavBar />
    </header>
    
    <main class="app-main">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </main>

    <footer class="app-footer">
      <Player />
    </footer>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import NavBar from '@/components/NavBar.vue'
import Player from '@/components/Player.vue'
import { usePlayerStore } from '@/stores/player'
import { useRouter } from 'vue-router'

const playerStore = usePlayerStore()
const router = useRouter() // 使用 router

const mainPaddingBottom = computed(() => {
  return playerStore.isCollapsed ? '40px' : '80px'
})
</script>

<style lang="scss" scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--theme-bg);

  .app-header {
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .app-main {
    flex: 1;
    padding-bottom: v-bind(mainPaddingBottom); // Dynamically set padding
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  .app-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }
}
</style>
