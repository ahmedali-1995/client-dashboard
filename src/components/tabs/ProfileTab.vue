<template>
  <div :class="themeStore.isDark ? 'bg-[#0F0F1E]' : 'bg-gray-50'" class="min-h-screen w-full p-4 lg:p-2">
    <div class="space-y-3 lg:space-y-2">
      <!-- Profile Header -->
      <div :class="[
        'rounded-xl p-4 lg:p-2 relative overflow-hidden',
        themeStore.isDark ? 'bg-gradient-to-r from-emerald-600/20 to-emerald-500/10' : 'bg-gradient-to-r from-emerald-600/10 to-emerald-500/5'
      ]">
        <div class="flex items-center justify-between relative z-10">
          <div class="flex items-center gap-3 lg:gap-2">
            <div class="relative group">
              <div class="absolute inset-0 bg-emerald-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div class="w-12 h-12 lg:w-10 lg:h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-xl lg:text-lg font-bold font-changa relative">
                {{ (userData?.['store name']?.charAt(0) || 'T').toUpperCase() }}
              </div>
            </div>
            <div>
              <h1 class="text-xl lg:text-lg font-bold font-changa" :class="themeStore.isDark ? 'text-white' : 'text-gray-800'">
                {{ userData?.['store name'] || 'Store Name' }}
              </h1>
              <p class="text-emerald-400 text-sm lg:text-xs font-changa">{{ userData?.Email || 'email@example.com' }}</p>
            </div>
          </div>
          
          <!-- Profile Status Badge -->
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-full text-sm font-medium" 
              :class="isProfileComplete ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'">
              {{ isProfileComplete ? 'Complete Profile' : 'Incomplete Profile' }}
            </span>
          </div>
        </div>
        
        <!-- Decorative Background Pattern -->
        <div class="absolute inset-0 opacity-5">
          <div class="absolute inset-0 bg-gradient-to-r from-emerald-500 to-transparent"></div>
          <div class="absolute inset-0 bg-[url('data:image/svg+xml,...')] bg-repeat opacity-20"></div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-2">
        <!-- Profile Stats -->
        <div class="lg:col-span-1">
          <div class="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-2">
            <!-- Profile Completion -->
            <div class="rounded-xl p-4 lg:p-3" 
              :class="themeStore.isDark ? 'bg-[#151525]' : 'bg-white shadow-lg'">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-medium" :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-700'">
                  Profile Completion
                </h3>
                <span class="text-xs font-medium px-2 py-1 rounded-full"
                  :class="completionPercentage === 100 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-yellow-500/20 text-yellow-400'">
                  {{ completionPercentage }}%
                </span>
              </div>
              
              <!-- Progress Bar -->
              <div class="h-2 bg-gray-200 rounded-full overflow-hidden" 
                :class="themeStore.isDark ? 'bg-gray-700' : 'bg-gray-200'">
                <div class="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  :style="{ width: `${completionPercentage}%` }">
                </div>
              </div>
              
              <!-- Missing Fields Alert -->
              <div v-if="missingFields.length > 0" class="mt-3">
                <p class="text-xs text-yellow-500">Missing information:</p>
                <ul class="mt-1 text-xs space-y-1">
                  <li v-for="field in missingFields" :key="field" 
                    class="flex items-center gap-1"
                    :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">
                    <i class="fas fa-exclamation-circle text-yellow-500"></i>
                    {{ field }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Account Status -->
            <div class="rounded-xl p-4 lg:p-3" 
              :class="themeStore.isDark ? 'bg-[#151525]' : 'bg-white shadow-lg'">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-medium" :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-700'">
                  Account Status
                </h3>
                <span class="text-xs font-medium px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                  Active
                </span>
              </div>
              
              <div class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">Member Since</span>
                  <span :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">
                    {{ formatDate(userData?.['start date']) }}
                  </span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">Last Login</span>
                  <span :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">
                    {{ formatDate(new Date()) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Profile Information -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Personal Information -->
          <div class="rounded-xl p-4 lg:p-3" 
            :class="themeStore.isDark ? 'bg-[#151525]' : 'bg-white shadow-lg'">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">
                Personal Information
              </h3>
              <button class="text-emerald-500 hover:text-emerald-400 transition-colors">
                <i class="fas fa-pencil-alt"></i>
              </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-xs" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">
                  Store Name
                </label>
                <p class="text-sm font-medium" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">
                  {{ userData?.['store name'] || 'N/A' }}
                </p>
              </div>
              
              <div class="space-y-1">
                <label class="text-xs" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">
                  Email Address
                </label>
                <p class="text-sm font-medium" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">
                  {{ userData?.Email || 'N/A' }}
                </p>
              </div>
              
              <div class="space-y-1">
                <label class="text-xs" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">
                  Phone Number
                </label>
                <p class="text-sm font-medium" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">
                  {{ userData?.Phone || 'N/A' }}
                </p>
              </div>
              
              <div class="space-y-1">
                <label class="text-xs" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">
                  WhatsApp
                </label>
                <p class="text-sm font-medium" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">
                  {{ userData?.WhatsApp || 'N/A' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Social Media Links -->
          <div class="rounded-xl p-4 lg:p-3" 
            :class="themeStore.isDark ? 'bg-[#151525]' : 'bg-white shadow-lg'">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">
                Social Media & Website
              </h3>
              <button class="text-emerald-500 hover:text-emerald-400 transition-colors">
                <i class="fas fa-pencil-alt"></i>
              </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Website -->
              <a v-if="userData?.Website" 
                :href="userData.Website" 
                target="_blank"
                class="flex items-center gap-3 p-3 rounded-lg transition-colors"
                :class="themeStore.isDark 
                  ? 'bg-gray-800/50 hover:bg-gray-800' 
                  : 'bg-gray-50 hover:bg-gray-100'">
                <div class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <i class="fas fa-globe text-emerald-500"></i>
                </div>
                <div>
                  <p class="text-sm font-medium" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">
                    Website
                  </p>
                  <p class="text-xs" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">
                    {{ userData.Website }}
                  </p>
                </div>
              </a>
              <div v-else 
                class="flex items-center gap-3 p-3 rounded-lg opacity-50"
                :class="themeStore.isDark ? 'bg-gray-800/50' : 'bg-gray-50'">
                <div class="w-10 h-10 rounded-lg bg-gray-500/10 flex items-center justify-center">
                  <i class="fas fa-globe text-gray-500"></i>
                </div>
                <div>
                  <p class="text-sm font-medium" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">
                    Website
                  </p>
                  <p class="text-xs" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">
                    Not Available
                  </p>
                </div>
              </div>

              <!-- Instagram -->
              <a v-if="userData?.Instagram" 
                :href="userData.Instagram" 
                target="_blank"
                class="flex items-center gap-3 p-3 rounded-lg transition-colors"
                :class="themeStore.isDark 
                  ? 'bg-gray-800/50 hover:bg-gray-800' 
                  : 'bg-gray-50 hover:bg-gray-100'">
                <div class="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <i class="fab fa-instagram text-pink-500"></i>
                </div>
                <div>
                  <p class="text-sm font-medium" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">
                    Instagram
                  </p>
                  <p class="text-xs" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">
                    {{ userData.Instagram }}
                  </p>
                </div>
              </a>
              <div v-else 
                class="flex items-center gap-3 p-3 rounded-lg opacity-50"
                :class="themeStore.isDark ? 'bg-gray-800/50' : 'bg-gray-50'">
                <div class="w-10 h-10 rounded-lg bg-gray-500/10 flex items-center justify-center">
                  <i class="fab fa-instagram text-gray-500"></i>
                </div>
                <div>
                  <p class="text-sm font-medium" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">
                    Instagram
                  </p>
                  <p class="text-xs" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">
                    Not Available
                  </p>
                </div>
              </div>

              <!-- TikTok -->
              <a v-if="userData?.TikTok" 
                :href="userData.TikTok" 
                target="_blank"
                class="flex items-center gap-3 p-3 rounded-lg transition-colors"
                :class="themeStore.isDark 
                  ? 'bg-gray-800/50 hover:bg-gray-800' 
                  : 'bg-gray-50 hover:bg-gray-100'">
                <div class="w-10 h-10 rounded-lg bg-gray-500/10 flex items-center justify-center">
                  <i class="fab fa-tiktok text-gray-500"></i>
                </div>
                <div>
                  <p class="text-sm font-medium" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">
                    TikTok
                  </p>
                  <p class="text-xs" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">
                    {{ userData.TikTok }}
                  </p>
                </div>
              </a>
              <div v-else 
                class="flex items-center gap-3 p-3 rounded-lg opacity-50"
                :class="themeStore.isDark ? 'bg-gray-800/50' : 'bg-gray-50'">
                <div class="w-10 h-10 rounded-lg bg-gray-500/10 flex items-center justify-center">
                  <i class="fab fa-tiktok text-gray-500"></i>
                </div>
                <div>
                  <p class="text-sm font-medium" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">
                    TikTok
                  </p>
                  <p class="text-xs" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">
                    Not Available
                  </p>
                </div>
              </div>

              <!-- WhatsApp Business -->
              <a v-if="userData?.WhatsApp" 
                :href="'https://wa.me/' + userData.WhatsApp" 
                target="_blank"
                class="flex items-center gap-3 p-3 rounded-lg transition-colors"
                :class="themeStore.isDark 
                  ? 'bg-gray-800/50 hover:bg-gray-800' 
                  : 'bg-gray-50 hover:bg-gray-100'">
                <div class="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <i class="fab fa-whatsapp text-green-500"></i>
                </div>
                <div>
                  <p class="text-sm font-medium" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">
                    WhatsApp Business
                  </p>
                  <p class="text-xs" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">
                    {{ userData.WhatsApp }}
                  </p>
                </div>
              </a>
              <div v-else 
                class="flex items-center gap-3 p-3 rounded-lg opacity-50"
                :class="themeStore.isDark ? 'bg-gray-800/50' : 'bg-gray-50'">
                <div class="w-10 h-10 rounded-lg bg-gray-500/10 flex items-center justify-center">
                  <i class="fab fa-whatsapp text-gray-500"></i>
                </div>
                <div>
                  <p class="text-sm font-medium" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">
                    WhatsApp Business
                  </p>
                  <p class="text-xs" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">
                    Not Available
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Support Card -->
            <div class="rounded-xl p-4 relative overflow-hidden group cursor-pointer"
              :class="themeStore.isDark ? 'bg-[#151525]' : 'bg-white shadow-lg'"
              @click="openSupportChat">
              <div class="relative z-10">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center 
                    group-hover:bg-emerald-500 transition-colors">
                    <i class="fas fa-headset text-emerald-500 group-hover:text-white transition-colors"></i>
                  </div>
                  <div>
                    <h3 class="text-sm font-medium" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">
                      Need Support?
                    </h3>
                    <p class="text-xs" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">
                      We're here to help
                    </p>
                  </div>
                </div>
                <p class="text-xs" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">
                  Get instant support from our team for any questions or concerns
                </p>
              </div>
              <div class="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <!-- Upgrade Card -->
            <div class="rounded-xl p-4 relative overflow-hidden group cursor-pointer"
              :class="themeStore.isDark ? 'bg-[#151525]' : 'bg-white shadow-lg'"
              @click="openUpgradeModal">
              <div class="relative z-10">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center 
                    group-hover:bg-yellow-500 transition-colors">
                    <i class="fas fa-crown text-yellow-500 group-hover:text-white transition-colors"></i>
                  </div>
                  <div>
                    <h3 class="text-sm font-medium" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">
                      Upgrade Plan
                    </h3>
                    <p class="text-xs" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">
                      Unlock more features
                    </p>
                  </div>
                </div>
                <p class="text-xs" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">
                  Upgrade your plan to access premium features and grow your business
                </p>
              </div>
              <div class="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()

const props = defineProps({
  userData: {
    type: Object,
    required: true
  }
})

// Profile completion calculation
const requiredFields = [
  'store name',
  'Email',
  'Phone',
  'WhatsApp',
  'Website',
  'Instagram',
  'TikTok'
]

const missingFields = computed(() => {
  return requiredFields.filter(field => !props.userData?.[field])
})

const completionPercentage = computed(() => {
  const completedFields = requiredFields.length - missingFields.value.length
  return Math.round((completedFields / requiredFields.length) * 100)
})

const isProfileComplete = computed(() => completionPercentage.value === 100)

// Date formatting
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Action handlers
const openSupportChat = () => {
  window.open('https://api.whatsapp.com/send?phone=201098659671', '_blank')
}

const openUpgradeModal = () => {
  // Implement upgrade modal logic
  console.log('Opening upgrade modal...')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Changa:wght@200;300;400;500;600;700;800&display=swap');

.font-changa {
  font-family: 'Changa', sans-serif;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Hover animations */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Card hover effects */
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Progress bar animation */
@keyframes progress {
  from { width: 0; }
  to { width: v-bind('completionPercentage + "%"'); }
}

.animate-progress {
  animation: progress 1s ease-out forwards;
}
</style>
