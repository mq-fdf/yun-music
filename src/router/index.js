import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/index',
    redirect: '/'
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
  // 匹配所有未定义的路由，重定向到首页
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(), // 修改为 Hash 模式
  routes
})

export default router
