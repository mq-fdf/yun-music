import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { ElMessage } from 'element-plus' // 导入 ElMessage

// 移动端检测函数
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const app = createApp(App)
const pinia = createPinia()

// 如果是移动端，则直接跳转到移动端提示页面
if (isMobile()) {
  router.push('/mobile-warning'); // 跳转到移动端提示页面
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
