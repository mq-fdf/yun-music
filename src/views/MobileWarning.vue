<template>
  <div class="mobile-warning">
    <div class="warning-content">
      <h1>请使用电脑打开</h1>
      <p>检测到您正在使用移动设备，请使用电脑访问以获得更好的体验。</p>
      <p>带来不便，敬请谅解。</p>
    </div>
  </div>
</template>

<script setup>
// 可以根据需要添加一些简单的逻辑，例如禁用滚动等
</script>

<style lang="scss" scoped>
.mobile-warning {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--theme-bg);
  color: var(--theme-text);
  text-align: center;
  padding: 20px;

  .warning-content {
    max-width: 400px;
    padding: 30px;
    border-radius: 8px;
    background-color: var(--theme-bg-secondary);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

    h1 {
      font-size: 28px;
      color: var(--theme-primary);
      margin-bottom: 20px;
    }

    p {
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 10px;
    }
  }
}
</style>
