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
          // Save user data with expiration
          const expirationDate = new Date()
          expirationDate.setDate(expirationDate.getDate() + 7) // 7 days from now
          
          const userData = {
            user: result.user,
            expiration: expirationDate.getTime()
          }
          
          localStorage.setItem('userData', JSON.stringify(userData))
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
      localStorage.removeItem('userData')
    },
    
    initAuth() {
      const userDataStr = localStorage.getItem('userData')
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr)
          const now = new Date().getTime()
          
          // Check if the stored data has expired
          if (userData.expiration && now < userData.expiration) {
            this.user = userData.user
          } else {
            // Clear expired data
            this.logout()
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
