<template>
  <nav class="nav-bar">
    <div class="logo" @click="$router.push('/')">
      <img src="@/assets/vue.svg" alt="logo" />
      <span>云音乐</span>
    </div>
    <div class="nav-links">
      <router-link to="/">首页</router-link>
      <router-link to="/search">搜索</router-link>
      <router-link to="/profile">我的</router-link>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  background-color: #c20c0c;
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

  .nav-links {
    a {
      color: #fff;
      text-decoration: none;
      margin-left: 20px;
      &.router-link-active {
        font-weight: bold;
        text-decoration: underline;
      }
    }
  }
}
</style>
