import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import './style.css'
import './assets/css/theme.css'
import { googleService } from './services/googleService'
import { useAuthStore } from './stores/auth'
import Chart from './plugins/chart'  // Add this import

// Create the app instance
const app = createApp(App)

// Create Pinia store
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Use plugins
app.use(pinia)
app.use(router)

// Initialize auth store
const authStore = useAuthStore(pinia)
authStore.initAuth()

// Make services and Chart globally available
app.config.globalProperties.$googleService = googleService
app.config.globalProperties.$chart = Chart

// Mount the app
app.mount('#app')
