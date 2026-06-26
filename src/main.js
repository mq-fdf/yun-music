import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 移动端检测函数
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 在路由准备好之后进行移动端检测和跳转
router.isReady().then(() => {
  if (isMobile()) {
    // 检查当前路由是否已经是 /mobile-warning，防止循环跳转
    if (router.currentRoute.value.path !== '/mobile-warning') {
      router.replace('/mobile-warning'); // 使用 replace 避免在历史记录中留下当前页面
    }
  }
  app.mount('#app')
})
