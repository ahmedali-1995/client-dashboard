<template>
  <div :class="themeStore.isDark ? 'bg-[#0F0F1E]' : 'bg-gray-50'" class="min-h-screen w-full p-4 lg:p-2">
    <div class="space-y-3 lg:space-y-2">
      <!-- Top Header Section -->
      <div :class="[
        'rounded-xl p-4 lg:p-2',
        themeStore.isDark ? 'bg-gradient-to-r from-emerald-600/20 to-emerald-500/10' : 'bg-gradient-to-r from-emerald-600/10 to-emerald-500/5'
      ]">
        <div class="flex items-center">
          <div class="flex items-center gap-3 lg:gap-2">
            <div class="w-10 h-10 lg:w-8 lg:h-8 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-lg lg:text-base font-bold font-changa">
              {{ (userData?.['store name']?.charAt(0) || 'T').toUpperCase() }}
            </div>
            <div>
              <h1 class="text-xl lg:text-base font-bold font-changa" :class="themeStore.isDark ? 'text-white' : 'text-gray-800'">
                {{ userData?.['store name'] || 'Store Name' }}
              </h1>
              <p class="text-emerald-400 text-sm lg:text-xs font-changa">{{ userData?.Email || 'email@example.com' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-2">
        <!-- Left Column - Welcome Back -->
        <div :class="[
          'rounded-xl p-4 lg:p-2 relative overflow-hidden',
          themeStore.isDark ? 'bg-gradient-to-br from-emerald-600/20 to-emerald-500/10' : 'bg-gradient-to-br from-emerald-600/10 to-emerald-500/5'
        ]">
          <div class="relative z-10">
            <h2 class="text-2xl lg:text-lg font-bold mb-2 lg:mb-1 font-changa" :class="themeStore.isDark ? 'text-white' : 'text-gray-800'">
              Welcome Back!
            </h2>
            <p class="text-emerald-400 lg:text-sm font-changa">Nice to see you, {{ userData?.['store name'] }}</p>
          </div>
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute inset-0 bg-[url('/pattern.svg')] bg-cover"></div>
          </div>
        </div>

        <!-- Middle Column - Package Information -->
        <div class="lg:col-span-2 rounded-xl p-4 lg:p-2" :class="themeStore.isDark ? 'bg-[#151525]' : 'bg-gray-100'">
          <div class="flex items-center justify-between mb-4 lg:mb-2">
            <div class="flex items-center gap-2 lg:gap-1">
              <i class="fas fa-box text-emerald-400 text-lg lg:text-base"></i>
              <h2 class="text-lg lg:text-base font-changa" :class="themeStore.isDark ? 'text-white' : 'text-gray-800'">Package Information</h2>
            </div>
            <div class="px-3 py-1 lg:px-2 lg:py-0.5 rounded-lg text-sm lg:text-xs font-changa flex items-center gap-2 lg:gap-1"
              :class="[
                remainingDays > 0 
                  ? (themeStore.isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600')
                  : (themeStore.isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600')
              ]">
              <span class="w-2 h-2 lg:w-1.5 lg:h-1.5 rounded-full animate-pulse" 
                :class="remainingDays > 0 
                  ? (themeStore.isDark ? 'bg-emerald-400' : 'bg-emerald-500')
                  : (themeStore.isDark ? 'bg-red-400' : 'bg-red-500')"
              ></span>
              {{ remainingDays > 0 ? 'Active' : 'Inactive' }}
            </div>
          </div>

          <div class="flex flex-col lg:flex-row gap-4 lg:gap-2">
            <!-- Left Side - Progress Circle -->
            <div class="w-full lg:w-[200px]">
              <div class="rounded-xl p-4 lg:p-2 h-full flex items-center justify-center" :class="themeStore.isDark ? 'bg-[#1A1A35]' : 'bg-white shadow-lg'">
                <div class="relative w-40 lg:w-32 h-40 lg:h-32 flex items-center justify-center">
                  <svg class="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                    <!-- Background circle -->
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke-width="10"
                      fill="none"
                      :class="themeStore.isDark ? 'stroke-[#151525]' : 'stroke-gray-100'"
                    />
                    <!-- Progress circle -->
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke-width="10"
                      fill="none"
                      class="stroke-emerald-500 transition-all duration-700"
                      :stroke-dasharray="2 * Math.PI * 45"
                      :stroke-dashoffset="2 * Math.PI * 45 * (1 - remainingPercentage / 100)"
                      stroke-linecap="round"
                    />
                  </svg>
                  <div class="flex flex-col items-center justify-center z-10">
                    <div 
                      :class="{
                        'text-5xl': true,
                        'lg:text-3xl': true,
                        'font-bold': true,
                        'leading-none': true,
                        'mb-1': true,
                        'text-emerald-400': remainingDays > 0,
                        'text-red-400': remainingDays <= 0
                      }"
                    >
                      {{ remainingDays }}
                    </div>
                    <div 
                      :class="{
                        'text-xs': true,
                        'lg:text-[10px]': true,
                        'text-center': true,
                        'text-gray-400': themeStore.isDark,
                        'text-gray-500': !themeStore.isDark
                      }"
                    >
                      Days<br>Remaining
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Side - Info Grid -->
            <div class="flex-1">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-2 h-full">
                <!-- Period -->
                <div class="rounded-xl p-3 lg:p-2" :class="themeStore.isDark ? 'bg-[#1A1A35]' : 'bg-white shadow-lg'">
                  <div class="flex items-center gap-2 lg:gap-1 mb-3 lg:mb-2">
                    <div class="w-8 h-8 lg:w-6 lg:h-6 rounded-xl flex items-center justify-center" 
                      :class="themeStore.isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'">
                      <i class="fas fa-hourglass text-emerald-400 text-base lg:text-sm"></i>
                    </div>
                    <div class="text-sm lg:text-xs font-changa" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-500'">Period</div>
                  </div>
                  <div class="font-changa text-lg lg:text-base" :class="themeStore.isDark ? 'text-white' : 'text-gray-800'">
                    {{ userData?.period || '3' }}
                  </div>
                </div>

                <!-- Start Date -->
                <div class="rounded-xl p-3 lg:p-2" :class="themeStore.isDark ? 'bg-[#1A1A35]' : 'bg-white shadow-lg'">
                  <div class="flex items-center gap-2 lg:gap-1 mb-3 lg:mb-2">
                    <div class="w-8 h-8 lg:w-6 lg:h-6 rounded-xl flex items-center justify-center" 
                      :class="themeStore.isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'">
                      <i class="fas fa-calendar text-emerald-400 text-base lg:text-sm"></i>
                    </div>
                    <div class="text-sm lg:text-xs font-changa" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-500'">Start Date</div>
                  </div>
                  <div class="font-changa text-lg lg:text-base" :class="themeStore.isDark ? 'text-white' : 'text-gray-800'">
                    {{ formatDate(userData?.['start date']) || 'December 7, 2024' }}
                  </div>
                </div>

                <!-- Package Status -->
                <div class="rounded-xl p-3 lg:p-2" :class="themeStore.isDark ? 'bg-[#1A1A35]' : 'bg-white shadow-lg'">
                  <div class="flex items-center gap-2 lg:gap-1 mb-3 lg:mb-2">
                    <div class="w-8 h-8 lg:w-6 lg:h-6 rounded-xl flex items-center justify-center" 
                      :class="themeStore.isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'">
                      <i class="fas fa-chart-line text-emerald-400 text-base lg:text-sm"></i>
                    </div>
                    <div class="text-sm lg:text-xs font-changa" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-500'">Package Status</div>
                  </div>
                  <div class="font-changa text-lg lg:text-base" :class="themeStore.isDark ? 'text-white' : 'text-gray-800'">
                    {{ userData?.package || 'Golden' }} Package
                  </div>
                </div>

                <!-- Category -->
                <div class="rounded-xl p-3 lg:p-2" :class="themeStore.isDark ? 'bg-[#1A1A35]' : 'bg-white shadow-lg'">
                  <div class="flex items-center gap-2 lg:gap-1 mb-3 lg:mb-2">
                    <div class="w-8 h-8 lg:w-6 lg:h-6 rounded-xl flex items-center justify-center" 
                      :class="themeStore.isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'">
                      <i class="fas fa-th-large text-emerald-400 text-base lg:text-sm"></i>
                    </div>
                    <div class="text-sm lg:text-xs font-changa" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-500'">Category</div>
                  </div>
                  <div class="font-changa text-lg lg:text-base" :class="themeStore.isDark ? 'text-white' : 'text-gray-800'">
                    {{ userData?.category || 'Fashion' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Profile Information -->
        <div class="lg:col-span-3 rounded-xl p-4 lg:p-2" :class="themeStore.isDark ? 'bg-[#151525]' : 'bg-gray-100'">
          <div class="flex items-center justify-between mb-4 lg:mb-2">
            <div class="flex items-center gap-3 lg:gap-2">
              <i class="fas fa-user text-lg text-emerald-400"></i>
              <h2 class="text-lg font-changa" :class="themeStore.isDark ? 'text-white' : 'text-black'">Profile Information</h2>
            </div>
          </div>

          <div class="space-y-2">
            <!-- Profile Info Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-2">
              <!-- Name -->
              <div class="bg-[#1A1A35] rounded-xl p-3 lg:p-2 h-[85px]" :class="themeStore.isDark ? 'bg-[#1A1A35]' : 'bg-white shadow-md'">
                <div class="text-gray-400 text-sm mb-2 lg:mb-1 font-changa">Name</div>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 lg:w-6 lg:h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <i class="fas fa-user text-emerald-400"></i>
                  </div>
                  <div class="text-lg lg:text-base font-changa truncate" :class="themeStore.isDark ? 'text-white' : 'text-black'">{{ userData?.['store name'] || 'Store Name' }}</div>
                </div>
              </div>

              <!-- Email -->
              <div class="bg-[#1A1A35] rounded-xl p-3 lg:p-2 h-[85px]" :class="themeStore.isDark ? 'bg-[#1A1A35]' : 'bg-white shadow-md'">
                <div class="text-gray-400 text-sm mb-2 lg:mb-1 font-changa">Email</div>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 lg:w-6 lg:h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <i class="fas fa-envelope text-emerald-400"></i>
                  </div>
                  <div class="text-lg lg:text-base font-changa truncate" :class="themeStore.isDark ? 'text-white' : 'text-black'">{{ userData?.Email || 'email@example.com' }}</div>
                </div>
              </div>

              <!-- Phone -->
              <div class="bg-[#1A1A35] rounded-xl p-3 lg:p-2 h-[85px]" :class="themeStore.isDark ? 'bg-[#1A1A35]' : 'bg-white shadow-md'">
                <div class="text-gray-400 text-sm mb-2 lg:mb-1 font-changa">Phone</div>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 lg:w-6 lg:h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <i class="fas fa-phone text-emerald-400"></i>
                  </div>
                  <div class="text-lg lg:text-base font-changa truncate" :class="themeStore.isDark ? 'text-white' : 'text-black'">{{ userData?.Phone || '+1234567890' }}</div>
                </div>
              </div>

              <!-- Website -->
              <div class="bg-[#1A1A35] rounded-xl p-3 lg:p-2 h-[85px]" :class="themeStore.isDark ? 'bg-[#1A1A35]' : 'bg-white shadow-md'">
                <div class="text-gray-400 text-sm mb-2 lg:mb-1 font-changa">Website</div>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 lg:w-6 lg:h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <i class="fas fa-globe text-emerald-400"></i>
                  </div>
                  <a v-if="userData?.Website" :href="userData.Website" target="_blank" class="text-lg lg:text-base font-changa hover:text-emerald-400 transition-colors truncate" :class="themeStore.isDark ? 'text-white' : 'text-black'">{{ userData?.Website }}</a>
                  <span v-else class="text-lg lg:text-base font-changa truncate" :class="themeStore.isDark ? 'text-white' : 'text-black'">Not Available</span>
                </div>
              </div>

              <!-- Social Media Links -->
              <div class="md:col-span-2 lg:col-span-4 bg-[#1A1A35] rounded-xl p-3 lg:p-2 mb-2" :class="themeStore.isDark ? 'bg-[#1A1A35]' : 'bg-white shadow-md'">
                <div class="text-gray-400 text-sm mb-3 lg:mb-2 font-changa">Social Media</div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-2">
                  <!-- Facebook -->
                  <a v-if="userData?.facebook" :href="userData.facebook" target="_blank" class="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-500/10 transition-colors">
                    <div class="w-8 h-8 lg:w-6 lg:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <i class="fab fa-facebook-f text-blue-500"></i>
                    </div>
                    <span class="text-sm lg:text-xs font-changa" :class="themeStore.isDark ? 'text-white' : 'text-black'">Facebook</span>
                  </a>
                  <div v-else class="flex items-center gap-2 p-2 rounded-lg opacity-50">
                    <div class="w-8 h-8 lg:w-6 lg:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <i class="fab fa-facebook-f text-blue-500"></i>
                    </div>
                    <span class="text-sm lg:text-xs font-changa" :class="themeStore.isDark ? 'text-white' : 'text-black'">Not Available</span>
                  </div>

                  <!-- Instagram -->
                  <a v-if="userData?.Instagram" :href="userData.Instagram" target="_blank" class="flex items-center gap-2 p-2 rounded-lg hover:bg-pink-500/10 transition-colors">
                    <div class="w-8 h-8 lg:w-6 lg:h-6 rounded-lg bg-pink-500/10 flex items-center justify-center">
                      <i class="fab fa-instagram text-pink-500"></i>
                    </div>
                    <span class="text-sm lg:text-xs font-changa" :class="themeStore.isDark ? 'text-white' : 'text-black'">Instagram</span>
                  </a>
                  <div v-else class="flex items-center gap-2 p-2 rounded-lg opacity-50">
                    <div class="w-8 h-8 lg:w-6 lg:h-6 rounded-lg bg-pink-500/10 flex items-center justify-center">
                      <i class="fab fa-instagram text-pink-500"></i>
                    </div>
                    <span class="text-sm lg:text-xs font-changa" :class="themeStore.isDark ? 'text-white' : 'text-black'">Not Available</span>
                  </div>

                  <!-- TikTok -->
                  <a v-if="userData?.TikTok" :href="userData.TikTok" target="_blank" class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-500/10 transition-colors">
                    <div class="w-8 h-8 lg:w-6 lg:h-6 rounded-lg bg-gray-500/10 flex items-center justify-center">
                      <i class="fab fa-tiktok text-gray-500"></i>
                    </div>
                    <span class="text-sm lg:text-xs font-changa" :class="themeStore.isDark ? 'text-white' : 'text-black'">TikTok</span>
                  </a>
                  <div v-else class="flex items-center gap-2 p-2 rounded-lg opacity-50">
                    <div class="w-8 h-8 lg:w-6 lg:h-6 rounded-lg bg-gray-500/10 flex items-center justify-center">
                      <i class="fab fa-tiktok text-gray-500"></i>
                    </div>
                    <span class="text-sm lg:text-xs font-changa" :class="themeStore.isDark ? 'text-white' : 'text-black'">Not Available</span>
                  </div>

                  <!-- WhatsApp -->
                  <a v-if="userData?.WhatsApp" :href="'https://wa.me/' + userData.WhatsApp" target="_blank" class="flex items-center gap-2 p-2 rounded-lg hover:bg-green-500/10 transition-colors">
                    <div class="w-8 h-8 lg:w-6 lg:h-6 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <i class="fab fa-whatsapp text-green-500"></i>
                    </div>
                    <span class="text-sm lg:text-xs font-changa" :class="themeStore.isDark ? 'text-white' : 'text-black'">WhatsApp</span>
                  </a>
                  <div v-else class="flex items-center gap-2 p-2 rounded-lg opacity-50">
                    <div class="w-8 h-8 lg:w-6 lg:h-6 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <i class="fab fa-whatsapp text-green-500"></i>
                    </div>
                    <span class="text-sm lg:text-xs font-changa" :class="themeStore.isDark ? 'text-white' : 'text-black'">Not Available</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Review and Upgrade Boxes -->
            <div class="grid gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-2">
              <!-- Give Us a Review -->
              <div class="relative overflow-hidden rounded-xl p-4" :class="themeStore.isDark ? 'bg-[#1A1A35]' : 'bg-white shadow-lg'">
                <div class="relative z-10">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="themeStore.isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'">
                      <svg class="w-5 h-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-medium" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">Give Us a Review</h3>
                      <p class="text-sm text-yellow-500">Share your experience</p>
                    </div>
                  </div>
                  <p class="mt-4 text-sm" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">
                    Your feedback helps us improve! Share your experience and help others make informed decisions.
                  </p>
                  <button class="mt-4 inline-flex items-center text-yellow-500 hover:text-yellow-600 transition-colors">
                    Write a Review
                    <svg class="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
                <!-- Decorative Circles -->
                <div class="absolute -top-8 -left-8 w-24 h-24 rounded-full" :class="themeStore.isDark ? 'border border-gray-800' : 'border border-gray-200'"></div>
                <div class="absolute -bottom-8 -right-8 w-24 h-24 rounded-full" :class="themeStore.isDark ? 'border border-gray-800' : 'border border-gray-200'"></div>
              </div>

              <!-- Upgrade Package -->
              <div class="relative overflow-hidden rounded-xl p-4" :class="themeStore.isDark ? 'bg-[#1A1A35]' : 'bg-white shadow-lg'">
                <div class="relative z-10">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="themeStore.isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'">
                      <svg class="w-5 h-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-medium" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">Upgrade Package</h3>
                      <p class="text-sm text-yellow-500">Get more features</p>
                    </div>
                  </div>
                  <p class="mt-4 text-sm" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">
                    Take your business to the next level! Unlock premium features and grow your reach.
                  </p>
                  <button class="mt-4 inline-flex items-center text-yellow-500 hover:text-yellow-600 transition-colors">
                    Explore Packages
                    <svg class="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
                <!-- Decorative Circles -->
                <div class="absolute -top-8 -left-8 w-24 h-24 rounded-full" :class="themeStore.isDark ? 'border border-gray-800' : 'border border-gray-200'"></div>
                <div class="absolute -bottom-8 -right-8 w-24 h-24 rounded-full" :class="themeStore.isDark ? 'border border-gray-800' : 'border border-gray-200'"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-2 mt-4">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()

// Props
const props = defineProps({
  userData: {
    type: Object,
    default() {
      return {}
    }
  }
})

// Screen size detection
const lgScreen = computed(() => window.innerWidth >= 1024)

// Circle progress calculations and colors
const remainingPercentage = computed(() => {
  if (!props.userData?.period) return 0
  const totalDays = parseInt(props.userData.period) * 30
  return (getRemainingDays() / totalDays) * 100
})

const remainingDays = computed(() => getRemainingDays())

const getRemainingDays = () => {
  if (!getExpiryDate()) return 0
  const today = new Date()
  const expiry = new Date(getExpiryDate())
  const diff = expiry - today
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

const getPackageTier = () => {
  const packageName = props.userData?.package?.toLowerCase() || ''
  if (packageName.includes('premium')) return 'Premium'
  if (packageName.includes('pro')) return 'Pro'
  return 'Basic'
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

const getExpiryDate = () => {
  if (!props.userData?.['start date'] || !props.userData?.period) return null
  const start = new Date(props.userData['start date'])
  const periodInMonths = parseInt(props.userData.period) || 0
  const end = new Date(start)
  end.setMonth(end.getMonth() + periodInMonths)
  return end.toISOString()
}

const formatPhones = (userData) => {
  if (!userData) return []
  const phones = []
  
  // Regular phone
  if (userData.Phone && userData.Phone !== 'N/A') {
    phones.push({
      type: 'Phone',
      value: String(userData.Phone),
      icon: 'fas fa-phone'
    })
  }
  
  // WhatsApp
  if (userData.WhatsApp && userData.WhatsApp !== 'N/A') {
    phones.push({
      type: 'WhatsApp',
      value: String(userData.WhatsApp),
      icon: 'fab fa-whatsapp'
    })
  }
  
  return phones.length > 0 ? phones : [{
    type: 'No Phone',
    value: 'N/A',
    icon: 'fas fa-phone-slash'
  }]
}

const formatSocial = (userData) => {
  if (!userData) return []
  const social = []
  
  // Website
  if (userData.Website && userData.Website !== 'N/A') {
    social.push({
      type: 'Website',
      url: userData.Website,
      icon: 'fas fa-globe'
    })
  }
  
  // Instagram
  if (userData.Instagram && userData.Instagram !== 'N/A') {
    social.push({
      type: 'Instagram',
      url: userData.Instagram,
      icon: 'fab fa-instagram'
    })
  }
  
  // TikTok
  if (userData.TikTok && userData.TikTok !== 'N/A') {
    social.push({
      type: 'TikTok',
      url: userData.TikTok,
      icon: 'fab fa-tiktok'
    })
  }

  return social.length > 0 ? social : [{
    type: 'No Social',
    url: '#',
    icon: 'fas fa-globe-slash'
  }]
}

const isArabic = (text) => {
  if (!text) return false;
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(String(text));
};

const infoCards = computed(() => [
  {
    label: 'Start Date',
    value: formatDate(props.userData?.['start date']),
    faIcon: 'fas fa-calendar-alt',
    subtext: 'Package Activation'
  },
  {
    label: 'Period',
    value: `${props.userData?.period || 0} Months`,
    faIcon: 'fas fa-clock',
    subtext: 'Subscription Length'
  },
  {
    label: 'Category',
    value: props.userData?.Category || 'N/A',
    faIcon: 'fas fa-tag',
    subtext: 'Service Type'
  },
  {
    label: 'Expiry Date',
    value: formatDate(props.userData?.['end date']),
    faIcon: 'fas fa-calendar-check',
    subtext: 'Package End Date'
  }
])

const storeInfoCards = computed(() => {
  return [
    {
      label: 'Store Name',
      value: props.userData?.['store name'] || 'N/A',
      faIcon: 'fas fa-store'
    },
    {
      label: 'Contact',
      phones: formatPhones(props.userData),
      isPhones: true,
      faIcon: 'fas fa-phone-alt'
    },
    {
      label: 'Social Media',
      social: formatSocial(props.userData),
      isSocial: true,
      faIcon: 'fas fa-globe'
    }
  ]
})

const welcomeText = computed(() => {
  const description = props.userData?.Description ? ` - ${props.userData.Description}` : ''
  return `Manage your profile and package information here${description}`
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Changa:wght@200;300;400;500;600;700;800&display=swap');

.font-changa {
  font-family: 'Changa', sans-serif;
}

/* Add smooth transitions for the circle */
circle {
  transition: stroke-dashoffset 1s ease-in-out, stroke 0.5s ease-in-out;
}

/* Ensure consistent card heights */
.grid > div {
  height: 100%;
}

/* RTL Support */
.rtl {
  direction: rtl;
}

.rtl .group-hover\:rotate-12 {
  transform: rotate(-12deg);
}

[dir="rtl"] {
  text-align: right;
}
</style>
