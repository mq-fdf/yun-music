<template>
  <nav class="nav-bar">
    <div class="logo" @click="$router.push('/')">
      <img src="@/assets/vue.svg" alt="logo" />
      <span>云听音乐</span>
    </div>
    <div class="nav-right">
      <div class="nav-links">
        <router-link to="/">首页</router-link>
        <router-link to="/search">搜索</router-link>
      </div>
      <ThemeSelector />
    </div>
  </nav>
</template>

<script setup>
import ThemeSelector from './ThemeSelector.vue'

</script>

<style lang="scss" scoped>
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 10px;
  }
  height: 60px;
  background-color: var(--theme-primary);
  color: #fff;

  .logo {
    display: flex;
    align-items: center;
    cursor: pointer;
    img {
      width: 30px;
      margin-right: 10px;
    }
    span {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 20px;

    @media (max-width: 768px) {
      gap: 10px;
    }
    
    .nav-links {
      a {
        color: #fff;
        text-decoration: none;
        margin-left: 20px;

        @media (max-width: 768px) {
          margin-left: 10px;
          font-size: 13px;
        }
        &.router-link-active {
          font-weight: bold;
          text-decoration: underline;
        }
      }
    }

    .user-section {
      display: flex;
      align-items: center;
      gap: 12px;

      .avatar-wrap {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        color: #fff;
        outline: none;
      }

      .user-name {
        max-width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
      }

      .anonymous-info {
        display: flex;
        align-items: center;
        gap: 10px;
        .anonymous-tag {
          background-color: rgba(255, 255, 255, 0.2);
          border: none;
        }
      }

      .white-btn {
        color: #fff;
        border-color: rgba(255, 255, 255, 0.5);
        background: transparent;
        &:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: #fff;
        }
      }
    }
  }
}
</style>
