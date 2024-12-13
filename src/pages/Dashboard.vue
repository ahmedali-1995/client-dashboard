<!-- Dashboard.vue -->
<template>
  <div class="flex h-screen" :class="themeStore.isDark ? 'bg-[#0F0F1E]' : 'bg-gray-50'">
    <div class="w-64 lg:w-52 text-white md:block hidden relative" 
      :class="themeStore.isDark 
        ? 'bg-gradient-to-b from-[#151525] to-[#0F0B1E]' 
        : 'bg-gray-50 shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)]'">
      <div class="p-4 lg:p-2" :class="themeStore.isDark ? 'border-gray-800' : 'border-gray-200'">
        <div class="flex flex-col items-center space-y-3 lg:space-y-2">
          <img 
            :src="themeStore.isDark 
              ? 'https://morbeh.org/wp-content/uploads/2024/12/image.png'
              : 'https://morbeh.org/wp-content/uploads/2024/09/morbh-1-1.png'" 
            alt="MORBH" 
            class="h-12 lg:h-16 w-auto"
          />
          <p class="text-sm lg:text-xs font-changa" :class="themeStore.isDark ? 'text-white' : 'text-emerald-400'">
            مع مربح أنت الرابح
          </p>
        </div>
      </div>

      <nav class="p-4 lg:p-2 space-y-2 lg:space-y-1 mb-16">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="currentTab = tab.id"
          :class="[
            'w-full px-4 py-3 lg:px-2 lg:py-2 flex items-center text-left rounded-lg transition-colors',
            currentTab === tab.id 
              ? 'bg-gradient-to-r from-emerald-600/20 to-emerald-500/10 text-emerald-400' 
              : themeStore.isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-emerald-400' : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-600'
          ]"
        >
          <div class="w-8 lg:w-6 h-8 lg:h-6 mr-3 rounded-lg flex items-center justify-center border" 
            :class="themeStore.isDark ? 'bg-transparent border-white/50' : 'bg-gray-50 border-gray-200'">
            <svg v-if="tab.id === 'overview'" class="w-5 h-5 lg:w-4.5 lg:h-4.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V15.75ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
            <svg v-if="tab.id === 'search'" class="w-5 h-5 lg:w-4.5 lg:h-4.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <svg v-if="tab.id === 'ads'" class="w-5 h-5 lg:w-4.5 lg:h-4.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            <svg v-if="tab.id === 'tasks'" class="w-5 h-5 lg:w-4.5 lg:h-4.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2m0-4h2m0 4h2m-10 0h2M7 9h10" />
            </svg>
            <svg v-if="tab.id === 'profile'" class="w-5 h-5 lg:w-4.5 lg:h-4.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <svg v-if="tab.id === 'design'" class="w-5 h-5 lg:w-4.5 lg:h-4.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25h6M9 12h2.25M9 15.75h6M7.5 21.75h9a1.5 1.5 0 0 0 1.5-1.5v-18A1.5 1.5 0 0 0 16.5.75h-9a1.5 1.5 0 0 0-1.5 1.5v18a1.5 1.5 0 0 0 1.5 1.5z" />
            </svg>
          </div>
          <span class="text-sm lg:text-xs">{{ tab.name }}</span>
        </button>
      </nav>

      <nav class="p-4 lg:p-2 space-y-2 lg:space-y-1">
        <button 
          @click="themeStore.toggleTheme"
          class="w-full px-4 py-3 lg:px-2 lg:py-2 flex items-center text-left rounded-lg transition-colors"
          :class="themeStore.isDark ? 'bg-gradient-to-r from-emerald-600/20 to-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'"
        >
          <div class="w-8 lg:w-6 h-8 lg:h-6 mr-3 rounded-lg flex items-center justify-center border"
            :class="themeStore.isDark ? 'bg-transparent border-white/50' : 'bg-white border-gray-200'">
            <i :class="[
              'text-lg lg:text-base',
              themeStore.isDark ? 'fas fa-sun text-emerald-400' : 'fas fa-moon text-emerald-500'
            ]"></i>
          </div>
          <span class="text-sm lg:text-xs">
            {{ themeStore.isDark ? 'Light Mode' : 'Dark Mode' }}
          </span>
        </button>
      </nav>

      <div class="absolute bottom-16 lg:bottom-12 w-64 lg:w-52 px-4 lg:px-2">
        <a 
          href="https://api.whatsapp.com/send?phone=201098659671"
          target="_blank"
          class="block p-4 lg:p-2 rounded-lg transition-all"
          :class="themeStore.isDark ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600' : 'bg-emerald-500 hover:bg-emerald-600'"
        >
          <div class="flex items-center">
            <div class="w-8 lg:w-6 h-8 lg:h-6 mr-3 rounded-lg flex items-center justify-center border"
              :class="themeStore.isDark ? 'bg-transparent border-white/50' : 'bg-white/10 border-white/20'">
              <svg class="w-5 h-5 lg:w-4.5 lg:h-4.5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <div class="text-white font-medium text-sm lg:text-xs">Need help?</div>
              <div class="text-emerald-200 text-sm lg:text-xs">Contact us</div>
            </div>
          </div>
        </a>
      </div>

      <div class="absolute bottom-0 w-64 lg:w-52 p-4 lg:p-2" 
        :class="themeStore.isDark ? 'bg-gradient-to-b from-[#151525] to-[#0F0B1E]' : 'bg-gray-50'">
        <button 
          @click="handleLogout"
          class="w-full px-4 py-3 lg:px-2 lg:py-2 flex items-center text-left rounded-lg transition-all duration-300"
          :class="themeStore.isDark 
            ? 'bg-gradient-to-r from-[#ce4343]/80 to-[#ce4343]/60 hover:from-[#b43131] hover:to-[#a62e2e]' 
            : 'bg-red-500/90 hover:bg-red-600/90'"
        >
          <div class="w-8 lg:w-6 h-8 lg:h-6 mr-3 rounded-lg flex items-center justify-center"
            :class="themeStore.isDark ? 'bg-[#b43131]' : 'bg-red-600/90'">
            <svg class="w-5 h-5 lg:w-4.5 lg:h-4.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </div>
          <span class="text-sm lg:text-xs text-white">Logout</span>
        </button>
      </div>
    </div>

    <div class="md:hidden fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 z-50"
      :class="themeStore.isDark ? 'bg-[#151525]' : 'bg-white border-b border-gray-200'">
      <button 
        @click="showMobileMenu = !showMobileMenu"
        class="p-2 rounded-lg transition-colors"
        :class="themeStore.isDark 
          ? 'hover:bg-gray-800' 
          : 'hover:bg-gray-100'"
      >
        <svg 
          class="w-6 h-6" 
          :class="themeStore.isDark ? 'text-white' : 'text-gray-700'"
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width="1.5" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      
      <img 
        :src="themeStore.isDark 
          ? 'https://morbeh.org/wp-content/uploads/2024/12/image.png'
          : 'https://morbeh.org/wp-content/uploads/2024/09/morbh-1-1.png'" 
        alt="Morbeh Logo" 
        class="h-14 w-auto"
      />
    </div>

    <div 
      class="md:hidden fixed inset-y-0 left-0 w-full transform transition-transform duration-300 ease-in-out z-40" 
      :class="[
        showMobileMenu ? 'translate-x-0' : '-translate-x-full',
        themeStore.isDark 
          ? 'bg-gradient-to-b from-[#151525] to-[#0F0B1E]' 
          : 'bg-gray-50 shadow-lg'
      ]"
    >
      <div class="sticky top-0 z-50 flex items-center justify-between p-4 lg:p-2" 
        :class="themeStore.isDark ? 'bg-[#151525] border-gray-800' : 'bg-white border-gray-200'">
        <button 
          @click="showMobileMenu = false"
          class="p-2 lg:p-1.5 rounded-lg text-emerald-400 hover:bg-gray-800 focus:outline-none"
        >
          <svg class="w-6 lg:w-5 h-6 lg:h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="h-full overflow-y-auto pt-16">
        <div class="p-4">
          <div class="flex flex-col items-center space-y-2">
            <img 
              :src="themeStore.isDark 
                ? 'https://morbeh.org/wp-content/uploads/2024/12/image.png'
                : 'https://morbeh.org/wp-content/uploads/2024/09/morbh-1-1.png'" 
              alt="MORBH" 
              class="h-20 w-auto"
            />
            <p class="text-emerald-400 text-sm font-changa" :class="themeStore.isDark ? 'text-white' : 'text-emerald-400'">
              مع مربح أنت الرابح
            </p>
          </div>
        </div>

        <nav class="p-4 space-y-2">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="currentTab = tab.id; showMobileMenu = false"
            :class="[
              'w-full px-4 py-3 flex items-center text-left rounded-lg transition-colors',
              currentTab === tab.id 
                ? 'bg-gradient-to-r from-emerald-600/20 to-emerald-500/10 text-emerald-400' 
                : themeStore.isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-emerald-400' : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-600'
            ]"
          >
            <div class="w-8 lg:w-6 h-8 lg:h-6 mr-3 rounded-lg flex items-center justify-center border" 
            :class="themeStore.isDark ? 'bg-transparent border-white/50' : 'bg-gray-50 border-gray-200'">
            <!-- SVG Icons Based on Tab ID -->
            <svg v-if="tab.id === 'overview'" class="w-5 h-5 lg:w-4.5 lg:h-4.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V15.75ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
            <svg v-if="tab.id === 'search'" class="w-5 h-5 lg:w-4.5 lg:h-4.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <svg v-if="tab.id === 'ads'" class="w-5 h-5 lg:w-4.5 lg:h-4.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            <svg v-if="tab.id === 'tasks'" class="w-5 h-5 lg:w-4.5 lg:h-4.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V9a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2h-2m0-4h2m0 4h2m-10 0h2M7 9h10" />
            </svg>
            <svg v-if="tab.id === 'profile'" class="w-5 h-5 lg:w-4.5 lg:h-4.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <!-- New design tab icon -->
            <svg v-if="tab.id === 'design'" class="w-5 h-5 lg:w-4.5 lg:h-4.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25h6M9 12h2.25M9 15.75h6M7.5 21.75h9a1.5 1.5 0 001.5-1.5v-18A1.5 1.5 0 0016.5.75h-9a1.5 1.5 0 00-1.5 1.5v18a1.5 1.5 0 001.5 1.5z" />
            </svg>
          </div>
          <span class="text-sm lg:text-xs">{{ tab.name }}</span>
        </button>
      </nav>

          <button 
            @click="themeStore.toggleTheme"
            :class="[
              'w-full px-4 py-3 flex items-center text-left rounded-lg transition-colors',
              themeStore.isDark ? 'bg-emerald-500/10 hover:bg-emerald-500/20' : 'bg-emerald-50 hover:bg-emerald-500/10'
            ]"
            class="mt-4"
          >
            <div class="w-8 h-8 mr-3 rounded-lg bg-transparent flex items-center justify-center border border-white/50">
              <i :class="[
                'text-lg',
                themeStore.isDark ? 'fas fa-sun text-emerald-400' : 'fas fa-moon text-emerald-500'
              ]"></i>
            </div>
            <span class="text-emerald-400">
              {{ themeStore.isDark ? 'Light Mode' : 'Dark Mode' }}
            </span>
          </button>

        <div class="mt-8 p-4">
          <a 
            href="https://api.whatsapp.com/send?phone=201098659671"
            target="_blank"
            class="flex items-center space-x-3 p-4 rounded-lg bg-emerald-400 text-[#151525]"
          >
            <svg class="w-5 h-5 lg:w-4.5 lg:h-4.5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            <div>
              <div class="font-medium">Need help?</div>
              <div class="text-sm opacity-75">Contact us</div>
            </div>
          </a>
        </div>

        <div class="p-4">
          <button 
            @click="handleLogout"
            class="w-full flex items-center space-x-3 p-4 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
          >
            <svg class="w-5 h-5 lg:w-4.5 lg:h-4.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            <div>
              <div class="font-medium">Logout</div>
              <div class="text-sm opacity-75">Sign out of your account</div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-auto pt-16 md:pt-0">
      <div class="p-4">
        <div v-if="loading" class="flex items-center justify-center h-full">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
        
        <div v-else-if="error" class="p-4 text-red-500">
          {{ error }}
        </div>
        
        <div v-else>
          <keep-alive><component 
            :is="currentComponent" 
            :userData="userData"
          /></keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useTasksStore } from '../stores/tasks'
import { appsScriptService } from '../services/appsScriptService'
import { useThemeStore } from '@/stores/themeStore'
import { useDesignStore } from '@/stores/designStore'

import OverviewTab from '../components/tabs/OverviewTab.vue'
import SearchPerformanceTab from '../components/tabs/SearchPerformanceTab.vue'
import AdsTab from '../components/tabs/AdsTab.vue'
import ProfileTab from '../components/tabs/ProfileTab.vue'
import TasksTab from '../components/tabs/TasksTab.vue'
import DesignTab from '../components/tabs/DesignTab.vue'

const router = useRouter()
const authStore = useAuthStore()
const tasksStore = useTasksStore()
const loading = ref(false)
const error = ref(null)
const userData = ref(null)
const currentTab = ref('overview')
const showMobileMenu = ref(false)
const themeStore = useThemeStore()
const designStore = useDesignStore()

const tabs = [
  { id: 'overview', name: 'Overview', component: OverviewTab },
  { id: 'search', name: 'Organic Search', component: SearchPerformanceTab },
  { id: 'ads', name: 'Ads Performance', component: AdsTab },
  { id: 'tasks', name: 'Tasks', component: TasksTab },
  { id: 'profile', name: 'Profile', component: ProfileTab },
  { id: 'design', name: 'Design', component: DesignTab }
]

const currentComponent = computed(() => {
  const tab = tabs.find(t => t.id === currentTab.value)
  return tab ? tab.component : null
})

const fetchData = async () => {
  if (!authStore.user?.username) return
  loading.value = true
  error.value = null
  
  try {
    const response = await appsScriptService.getUserData(authStore.user.username)
    if (response.success) {
      userData.value = response.data
    }
    await tasksStore.fetchTasks(authStore.user.username)
  } catch (err) {
    console.error('Error fetching data:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/client-login')
}
  onMounted(async () => {
  const username = authStore.user?.username
  if (username && !designStore.isInitialized) {
    await designStore.fetchDesignData(username)
  }
})

onMounted(async () => {
  authStore.initAuth()
  if (!authStore.isAuthenticated) {
    await router.push('/client-login')
    return
  }
  await fetchData()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
