<template>
  <div class="profile">
    <div v-if="userStore.isLogin">
      <h1>我的个人中心</h1>
      <div class="user-card">
        <img :src="userStore.userInfo?.avatarUrl" alt="avatar" />
        <span>{{ userStore.userInfo?.nickname }}</span>
      </div>
      <button @click="userStore.logout">退出登录</button>
    </div>
    <div v-else class="login-prompt">
      <p>请先登录</p>
      <button @click="mockLogin">模拟登录</button>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const mockLogin = () => {
  userStore.setUserInfo({
    nickname: '测试用户',
    avatarUrl: 'https://via.placeholder.com/100'
  })
  userStore.setToken('mock-token-123')
}
</script>

<style lang="scss" scoped>
.profile {
  padding: 40px;
  text-align: center;
  .user-card {
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin-bottom: 10px;
    }
  }
}
</style>
