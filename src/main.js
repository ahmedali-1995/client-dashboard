import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import './style.css'
import './assets/css/theme.css'
import { googleService } from './services/googleService'

// Create the app instance
const app = createApp(App)

// Create Pinia store
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Use plugins
app.use(pinia)
app.use(router)


// Make service available globally
app.config.globalProperties.$googleService = googleService

// Also expose it on window for debugging
// window.$googleService = googleService

// Mount the app
app.mount('#app')
