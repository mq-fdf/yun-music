<template>
  <AppLayout />
</template>

<script setup>
import AppLayout from '@/layouts/AppLayout.vue'
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #333;
}

#app {
  min-height: 100vh;
}
</style>
