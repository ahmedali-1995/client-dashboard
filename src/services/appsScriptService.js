// appsScriptService.js
import axios from 'axios';

class AppsScriptService {
  constructor() {
    this.scriptUrl = 'https://client-dashboard-nine.vercel.app/api/proxy'; 
    this.debug = true;

    // Create an Axios instance with credentials
    this.axiosInstance = axios.create({
      baseURL: this.scriptUrl,
      withCredentials: true, // Allow sending cookies
      headers: { 'Accept': 'application/json' },
    });
  }

  async getUserData(username) {
    try {
      if (this.debug) console.log(`[AppsScriptService] Fetching data for username: ${username}`);
      const response = await this.axiosInstance.get('/', {
        params: { username, t: new Date().getTime() },
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch data');
      }
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('[AppsScriptService] Error:', error);
      return { success: false, error: error.message };
    }
  }

  async getTasks(username) {
    try {
      if (this.debug) console.log(`[AppsScriptService] Fetching tasks for username: ${username}`);
      const response = await this.axiosInstance.get('/', {
        params: { username, action: 'getTasks', t: new Date().getTime() },
      });
      return response.data;
    } catch (error) {
      console.error('[AppsScriptService] Error fetching tasks:', error);
      throw error;
    }
  }

  async testConnection() {
    try {
      if (this.debug) console.log('[AppsScriptService] Testing connection...');
      const response = await this.axiosInstance.get('/', {
        params: { t: new Date().getTime() },
      });
      return { success: true, message: response.data.message || 'Connection successful' };
    } catch (error) {
      console.error('[AppsScriptService] Test connection error:', error);
      return { success: false, error: error.message };
    }
  }

  async validateUser(username, password) {
    try {
      if (this.debug) console.log('[AppsScriptService] Validating user:', username);
      const response = await this.axiosInstance.get('/', {
        params: { username, password, action: 'validate' },
      });
      return response.data;
    } catch (error) {
      console.error('[AppsScriptService] Validate user error:', error);
      throw error;
    }
  }

  async submitDesignData(username, designType, formData) {
    try {
      if (this.debug) console.log(`[AppsScriptService] Submitting ${designType} design data for ${username}`);
      const response = await this.axiosInstance.post('/', {
        username,
        action: 'submitDesignData',
        designType,
        formData
      });
      return response.data;
    } catch (error) {
      console.error('[AppsScriptService] submitDesignData error:', error);
      return { success: false, error: error.message };
    }
  }

  async getSubmittedAnswers(username, designType) {
    try {
      if (this.debug) console.log(`[AppsScriptService] Getting submitted answers for ${username}, type: ${designType}`);
      const response = await this.axiosInstance.get('/', {
        params: { username, action: 'getSubmittedAnswers', designType, t: new Date().getTime() },
      });
      return response.data;
    } catch (error) {
      console.error('[AppsScriptService] getSubmittedAnswers error:', error);
      return { success: false, error: error.message };
    }
  }
}

export const appsScriptService = new AppsScriptService();
