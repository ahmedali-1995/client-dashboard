import { defineStore } from 'pinia'
import { appsScriptService } from '@/services/appsScriptService'

// Cookie helper functions with SameSite and secure attributes
const setCookie = (name, value, days) => {
  try {
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + days)
    
    const cookie = [
      `${name}=${encodeURIComponent(JSON.stringify(value))}`,
      `expires=${expirationDate.toUTCString()}`,
      'path=/',
      'SameSite=None',
      'Secure'
    ].join('; ')
    
    document.cookie = cookie
    
    // Also store in localStorage as backup
    localStorage.setItem(name, JSON.stringify({
      value,
      expiration: expirationDate.getTime()
    }))
  } catch (error) {
    console.error('[AuthStore] Error setting cookie:', error)
  }
}

const getCookie = (name) => {
  try {
    // First try to get from cookie
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim())
      if (cookieName === name) {
        try {
          return JSON.parse(decodeURIComponent(cookieValue))
        } catch {
          // If cookie parsing fails, try localStorage
          const stored = localStorage.getItem(name)
          if (stored) {
            const data = JSON.parse(stored)
            if (data.expiration > new Date().getTime()) {
              return data.value
            }
          }
          return null
        }
      }
    }
    
    // If cookie not found, try localStorage
    const stored = localStorage.getItem(name)
    if (stored) {
      const data = JSON.parse(stored)
      if (data.expiration > new Date().getTime()) {
        return data.value
      }
    }
    return null
  } catch (error) {
    console.error('[AuthStore] Error getting cookie:', error)
    return null
  }
}

const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=None; Secure`
  localStorage.removeItem(name)
}

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
          // Save user data in cookie and localStorage
          const userData = {
            user: result.user,
            expiration: new Date().getTime() + (7 * 24 * 60 * 60 * 1000) // 7 days from now
          }
          
          setCookie('userData', userData, 7)
          
          // Post message to parent window
          if (window.parent !== window) {
            window.parent.postMessage({ type: 'LOGIN_SUCCESS', user: result.user }, '*')
          }
          
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
      deleteCookie('userData')
      
      // Post message to parent window
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'LOGOUT' }, '*')
      }
    },
    
    initAuth() {
      const userData = getCookie('userData')
      if (userData) {
        const now = new Date().getTime()
        
        // Check if the stored data has expired
        if (userData.expiration && now < userData.expiration) {
          this.user = userData.user
          
          // Post message to parent window
          if (window.parent !== window) {
            window.parent.postMessage({ type: 'AUTH_INIT', user: userData.user }, '*')
          }
        } else {
          // Clear expired data
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
