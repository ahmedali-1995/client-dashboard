import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: true // default is dark mode
  }),
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      // Update body class for global theme changes
      if (this.isDark) {
        document.documentElement.classList.remove('light-mode')
      } else {
        document.documentElement.classList.add('light-mode')
      }
    },
    initTheme() {
      // Initialize theme on app start
      if (this.isDark) {
        document.documentElement.classList.remove('light-mode')
      } else {
        document.documentElement.classList.add('light-mode')
      }
    }
  }
})
