import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/Search.vue'),
    meta: { title: '搜索' }
  },
  {
    path: '/playlist/:id',
    name: 'Playlist',
    component: () => import('@/views/Playlist.vue'),
    meta: { title: '歌单详情' }
  },
  {
    path: '/song/:id',
    name: 'SongDetail',
    component: () => import('@/views/SongDetail.vue'),
    meta: { title: '歌曲详情' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { title: '我的', requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 云音乐` : '云音乐'
  
  // Basic auth guard example
  const isLogin = !!localStorage.getItem('token')
  if (to.meta.requiresAuth && !isLogin) {
    next('/')
  } else {
    next()
  }
})

export default router
