import axios from 'axios'

class GoogleService {
  constructor() {
    this.baseURL = '/api' // Use relative URL for proxy to work
    this.debug = true
  }

  async getUserData(username) {
    try {
      if (this.debug) console.log(`[GoogleService] Fetching data for username: ${username}`)
      const response = await axios.get(`${this.baseURL}/google?username=${encodeURIComponent(username)}`)
      if (this.debug) console.log('[GoogleService] Response:', response.data)
      
      if (!response.data) {
        throw new Error('No data received from server')
      }

      return {
        success: true,
        data: response.data.data
      }
    } catch (error) {
      console.error('[GoogleService] Error:', error)
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch user data'
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  async testConnection() {
    try {
      if (this.debug) console.log('[GoogleService] Testing connection...')
      const response = await axios.get(`${this.baseURL}/google/test`)
      if (this.debug) console.log('[GoogleService] Test response:', response.data)
      
      return {
        success: true,
        message: response.data.message || 'Connection successful'
      }
    } catch (error) {
      console.error('[GoogleService] Test connection error:', error)
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Connection test failed'
      }
    }
  }
}

// Create and export a single instance
export const googleService = new GoogleService()
