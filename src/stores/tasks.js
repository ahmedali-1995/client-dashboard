import { defineStore } from 'pinia'
import { ref } from 'vue'
import { appsScriptService } from '../services/appsScriptService'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchTasks(username) {
      if (this.tasks.length > 0) return // Don't fetch if we already have data
      
      this.loading = true
      this.error = null
      
      try {
        const response = await appsScriptService.getTasks(username)
        if (response.success && response.data) {
          // Store the raw data directly since it matches our structure
          this.tasks = response.data
        } else {
          this.error = 'Failed to fetch tasks'
        }
      } catch (error) {
        console.error('Error fetching tasks:', error)
        this.error = 'Error loading tasks'
      } finally {
        this.loading = false
      }
    },
    
    clearTasks() {
      this.tasks = []
      this.error = null
      this.loading = false
    }
  }
})
