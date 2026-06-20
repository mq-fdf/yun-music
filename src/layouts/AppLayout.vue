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
import NavBar from '@/components/NavBar.vue'
import Player from '@/components/Player.vue'
</script>

<style lang="scss" scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;

  .app-header {
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .app-main {
    flex: 1;
    padding-bottom: 80px; // Space for player
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
