import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    isLogin: false,
    token: localStorage.getItem('token') || ''
  }),
  actions: {
    setUserInfo(info) {
      this.userInfo = info
      this.isLogin = !!info
    },
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    logout() {
      this.userInfo = null
      this.isLogin = false
      this.token = ''
      localStorage.removeItem('token')
    }
  }
})
