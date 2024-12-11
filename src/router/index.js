import { createRouter, createWebHistory } from 'vue-router'
import ClientLogin from '../pages/ClientLogin.vue'
import Dashboard from '../pages/Dashboard.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/client-login'
  },
  {
    path: '/client-login',
    name: 'ClientLogin',
    component: ClientLogin,
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore()
      console.log('[Router] Login route guard')
      
      if (authStore.isAuthenticated) {
        console.log('[Router] Already authenticated, redirecting to dashboard')
        next('/client-dashboard')  
      } else {
        console.log('[Router] Not authenticated, allowing login access')
        next()
      }
    }
  },
  {
    path: '/client-dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  console.log('[Router] Navigation to:', to.path, 'from:', from.path)
  console.log('[Router] Authentication status:', authStore.isAuthenticated)
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      console.log('[Router] Auth required but not authenticated, redirecting to login')
      next('/client-login')
    } else {
      console.log('[Router] Auth verified, proceeding to route')
      next()
    }
  } else {
    // For non-auth routes, if user is authenticated and trying to access login,
    // redirect to dashboard
    if (authStore.isAuthenticated && to.path === '/client-login') {
      console.log('[Router] Authenticated user trying to access login, redirecting to dashboard')
      next('/client-dashboard')
    } else {
      next()
    }
  }
})

export default router
