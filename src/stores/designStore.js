// src/stores/designStore.js
import { defineStore } from 'pinia'

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
    }
  }
})
