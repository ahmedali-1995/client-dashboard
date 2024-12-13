// src/stores/designStore.js
import { defineStore } from 'pinia'
import { appsScriptService } from '@/services/appsScriptService' // Ensure correct path

export const useDesignStore = defineStore('design', {
  state: () => ({
    dataLoaded: false,
    isInitialized: false,
    submissionTime: {
      ui: null,
      logo: null,
      banners: null
    },
    formData: {
      ui: { ui_slide1: '', ui_slide2: '', ui_slide3: '', ui_slide4: '' },
      logo: { logo_slide1: '', logo_slide2: '', logo_slide3: '', logo_slide4: '' },
      banners: { banners_slide1: '', banners_slide2: '', banners_slide3: '', banners_slide4: '' }
    },
    submitted: {
      ui: false,
      logo: false,
      banners: false
    }
  }),
  actions: {
    setSubmitted(type, value) {
      this.submitted[type] = value
    },
    setFormData(type, key, value) {
      this.formData[type][key] = value
    },
    setSubmissionTime(type, time) {
      this.submissionTime[type] = time
    },
    markInitialized() {
      this.isInitialized = true
    },
    markDataLoaded() {
      this.dataLoaded = true
    },
    async fetchDesignData(username) {
      try {
        const types = ['ui', 'logo', 'banners']
        for (const type of types) {
          const response = await appsScriptService.getSubmittedAnswers(username, type)
          if (response.success && response.data) {
            Object.keys(response.data).forEach(key => {
              if (this.formData[type].hasOwnProperty(key)) {
                this.formData[type][key] = response.data[key]
              }
            })
            this.setSubmitted(type, true)
            // Assuming the response includes submission time; if not, set it manually
            this.setSubmissionTime(type, new Date().toLocaleString())
          }
        }
        this.markDataLoaded()
        this.markInitialized()
      } catch (error) {
        console.error('Error fetching design data:', error)
      }
    }
  }
})
