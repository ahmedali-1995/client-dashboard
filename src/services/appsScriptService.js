import axios from 'axios';

// Google Apps Script service
class AppsScriptService {
  constructor() {
    // Replace this with your deployed Apps Script web app URL
    this.scriptUrl = 'https://script.google.com/macros/s/AKfycbxc1J_oVKZD07d34Qr9tiV-fppbTIeKqkcR46SZWZmSIR5oDLJpeOEtzpoektZr8ASpiw/exec';
    this.debug = true;
  }

  async getUserData(username) {
    try {
      if (this.debug) console.log(`[AppsScriptService] Fetching data for username: ${username}`);
      
      const response = await axios.get(this.scriptUrl, {
        params: {
          username,
          t: new Date().getTime() // Add timestamp to prevent caching
        },
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (this.debug) console.log('[AppsScriptService] Response:', response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch data');
      }
      
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('[AppsScriptService] Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getTasks(username) {
    try {
      if (this.debug) console.log(`[AppsScriptService] Fetching tasks for username: ${username}`);
      
      const response = await axios.get(this.scriptUrl, {
        params: {
          username,
          action: 'getTasks',
          t: new Date().getTime()
        },
        headers: {
          'Accept': 'application/json'
        }
      });

      if (this.debug) console.log('[AppsScriptService] Tasks response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[AppsScriptService] Error fetching tasks:', error);
      throw error;
    }
  }

  async testConnection() {
    try {
      if (this.debug) console.log('[AppsScriptService] Testing connection...');
      
      const response = await axios.get(this.scriptUrl, {
        params: {
          t: new Date().getTime() // Add timestamp to prevent caching
        },
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (this.debug) console.log('[AppsScriptService] Test response:', response.data);
      
      return {
        success: true,
        message: response.data.message || 'Connection successful'
      };
    } catch (error) {
      console.error('[AppsScriptService] Test connection error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async validateUser(username, password) {
    try {
      if (this.debug) console.log('[AppsScriptService] Validating user:', username);

      const response = await axios.get(this.scriptUrl, {
        params: {
          username,
          password,
          action: 'validate'
        },
        headers: {
          'Accept': 'application/json'
        }
      });

      if (this.debug) console.log('[AppsScriptService] Validation response:', response.data);

      return response.data;
    } catch (error) {
      console.error('[AppsScriptService] Validate user error:', error);
      throw error;
    }
  }
}

export const appsScriptService = new AppsScriptService();
