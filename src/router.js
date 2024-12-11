import { createRouter, createWebHistory } from 'vue-router'
import Login from './pages/Login.vue'
import Dashboard from './pages/Dashboard.vue'
import { useAuthStore } from './stores/auth'

const routes = [
  {
    path: '/client-login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/client-dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.user) {
    next('/client-login')
  } else {
    next()
  }
})

export default router
