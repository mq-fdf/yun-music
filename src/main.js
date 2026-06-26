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

// 如果是移动端，则显示提示信息
if (isMobile()) {
  ElMessage({
    message: '检测到您正在使用移动设备，请使用电脑打开以获得更好的体验。',
    type: 'warning',
    duration: 0, // 永久显示，直到用户关闭
    showClose: true
  });
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
