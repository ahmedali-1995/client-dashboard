import { appsScriptService } from './appsScriptService'

const AUTH_KEY = 'client_portal_auth'

class AuthService {
  constructor() {
    console.log('[AuthService] Initializing')
  }

  async setAuth(userData) {
    try {
      if (!userData || !userData.username) {
        console.error('[AuthService] Invalid user data:', userData)
        return false
      }

      const authData = {
        user: userData,
        timestamp: new Date().getTime()
      }

      localStorage.setItem(AUTH_KEY, JSON.stringify(authData))
      console.log('[AuthService] Auth data stored:', authData)
      return true
    } catch (error) {
      console.error('[AuthService] Error setting auth:', error)
      return false
    }
  }

  async login(username, password) {
    try {
      const result = await appsScriptService.validateUser(username, password)
      
      if (result.success) {
        // Store user data in localStorage
        const success = await this.setAuth(result.user)
        if (!success) {
          throw new Error('Failed to store authentication data')
        }
        return {
          success: true,
          user: result.user
        }
      } else {
        return {
          success: false,
          error: result.error || 'Invalid username or password'
        }
      }
    } catch (error) {
      console.error('[AuthService] Login error:', error)
      return {
        success: false,
        error: error.message || 'Error during login'
      }
    }
  }

  logout() {
    localStorage.removeItem(AUTH_KEY)
    console.log('[AuthService] Logged out')
  }

  getAuth() {
    try {
      const rawData = localStorage.getItem(AUTH_KEY)
      if (!rawData) {
        return null
      }

      const authData = JSON.parse(rawData)
      if (!authData?.user?.username) {
        console.warn('[AuthService] Invalid auth data found:', authData)
        this.clearAuth()
        return null
      }

      return authData
    } catch (error) {
      console.error('[AuthService] Error getting auth:', error)
      this.clearAuth()
      return null
    }
  }

  clearAuth() {
    localStorage.removeItem(AUTH_KEY)
  }

  isAuthenticated() {
    const authData = this.getAuth()
    return !!authData?.user?.username
  }

  getCurrentUser() {
    const authData = this.getAuth()
    return authData?.user || null
  }
}

export const authService = new AuthService()
