<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0F111A] via-[#151525] to-[#0F0F1E] py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-gradient-to-b from-[#1A1C25] to-[#151525] p-8 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
      <!-- Background gradient effects -->
      <div class="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none"></div>
      <div class="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-emerald-500/10 blur opacity-30 pointer-events-none"></div>

      <!-- Logo with glow effect -->
      <div class="flex flex-col items-center space-y-2 relative">
        <div class="relative">
          <div class="absolute -inset-4 bg-emerald-500/20 blur-xl rounded-full"></div>
          <img 
            src="https://morbeh.org/wp-content/uploads/2024/09/morbh-1-1.png" 
            alt="MORBH" 
            class="h-20 w-auto relative"
          />
        </div>
        <p class="text-emerald-400 text-sm font-changa relative">مع مربح أنت الرابح</p>
      </div>

      <!-- Title -->
      <div class="text-center relative">
        <h2 class="text-2xl font-semibold text-white">Nice to see you!</h2>
        <p class="mt-2 text-gray-400">Enter your username and password to sign in</p>
      </div>
      
      <!-- Error Alert -->
      <div v-if="error" class="bg-red-900/20 border border-red-500/50 p-4 rounded-lg relative">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-400">{{ error }}</p>
          </div>
        </div>
      </div>

      <form class="space-y-6 relative" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                v-model="username"
                class="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter your username"
              />
            </div>
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                v-model="password"
                class="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            class="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-700 rounded bg-gray-800"
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray-300">
            Remember me
          </label>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="relative w-full flex justify-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
          >
            <div class="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-200"></div>
            <div class="relative flex items-center justify-center">
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Sign In</span>
            </div>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  try {
    loading.value = true
    error.value = ''

    const result = await authStore.login(username.value, password.value)
    
    if (result.success) {
      console.log('[Login] Login successful, navigating to dashboard')
      await router.push('/client-dashboard')
    } else {
      error.value = result.error || 'Invalid username or password'
    }
  } catch (err) {
    console.error('[Login] Login error:', err)
    error.value = 'An error occurred during login'
  } finally {
    loading.value = false
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Changa:wght@400;500;600&display=swap');

.font-changa {
  font-family: 'Changa', sans-serif;
}

@keyframes glow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}

.glow-effect {
  animation: glow 2s ease-in-out infinite;
}
</style>