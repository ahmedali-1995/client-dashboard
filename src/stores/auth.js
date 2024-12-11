import { defineStore } from 'pinia'
import { appsScriptService } from '@/services/appsScriptService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),
  
  actions: {
    async login(username, password) {
      try {
        const result = await appsScriptService.validateUser(username, password)
        
        if (result.success) {
          this.user = result.user
          localStorage.setItem('user', JSON.stringify(result.user))
          return { success: true, user: result.user }
        } else {
          return { success: false, error: result.error || 'Invalid credentials' }
        }
      } catch (error) {
        console.error('[AuthStore] Login error:', error)
        return { success: false, error: error.message || 'Error during login' }
      }
    },
    
    logout() {
      this.user = null
      localStorage.removeItem('user')
    },
    
    initAuth() {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          if (user && user.username) {
            this.user = user
          }
        } catch (error) {
          console.error('[AuthStore] Error parsing stored user:', error)
          this.logout()
        }
      }
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.user?.username,
    currentUser: (state) => state.user
  }
})
