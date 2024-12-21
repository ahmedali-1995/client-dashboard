// appsScriptService.js
import axios from 'axios';

class AppsScriptService {
  constructor() {
    this.scriptUrl = 'https://client-dashboard-nine.vercel.app/api/proxy'; 
    this.debug = true;
  }

  async getUserData(username) {
    try {
      if (this.debug) console.log(`[AppsScriptService] Fetching data for username: ${username}`);
      const response = await axios.get(this.scriptUrl, {
        params: { username, t: new Date().getTime() },
        headers: { 'Accept': 'application/json' }
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
      const response = await axios.get(this.scriptUrl, {
        params: { username, action: 'getTasks', t: new Date().getTime() },
        headers: { 'Accept': 'application/json' }
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
      const response = await axios.get(this.scriptUrl, {
        params: { t: new Date().getTime() },
        headers: { 'Accept': 'application/json' }
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
      const response = await axios.get(this.scriptUrl, {
        params: { username, password, action: 'validate' },
        headers: { 'Accept': 'application/json' }
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
      const response = await axios.post(this.scriptUrl, {
        username,
        action: 'submitDesignData',
        designType,
        formData
      }, {
        headers: { 'Accept': 'application/json' }
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
      const response = await axios.get(this.scriptUrl, {
        params: { username, action: 'getSubmittedAnswers', designType, t: new Date().getTime() },
        headers: { 'Accept': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('[AppsScriptService] getSubmittedAnswers error:', error);
      return { success: false, error: error.message };
    }
  }

  async getSearchPerformanceData(username) {
    try {
      if (this.debug) console.log(`[AppsScriptService] Fetching search performance data for ${username}`);
      const response = await axios.get(this.scriptUrl, {
        params: { 
          username, 
          action: 'getSearchData',
          t: new Date().getTime() 
        },
        headers: { 'Accept': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('[AppsScriptService] Error fetching search data:', error);
      return { success: false, error: error.message };
    }
  }
}

export const appsScriptService = new AppsScriptService();
