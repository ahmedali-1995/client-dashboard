<template>
  <div :class="themeStore.isDark ? 'bg-[#0F0F1E]' : 'bg-gray-50'" class="min-h-screen w-full p-4 lg:p-2">
    <div class="space-y-3 lg:space-y-2">
      <!-- Tasks Header -->
      <div :class="[
        'rounded-xl p-4 lg:p-2',
        themeStore.isDark ? 'bg-gradient-to-r from-emerald-600/20 to-emerald-500/10' : 'bg-gradient-to-r from-emerald-600/10 to-emerald-500/5'
      ]">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3 lg:gap-2">
            <div class="w-10 h-10 lg:w-8 lg:h-8 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
              <i class="fas fa-tasks"></i>
            </div>
            <h1 class="text-xl lg:text-base font-bold font-changa" :class="themeStore.isDark ? 'text-white' : 'text-gray-800'">
              Tasks Overview
            </h1>
          </div>
        </div>
      </div>

      <!-- Tasks List -->
      <div class="grid gap-4 lg:gap-2">
        <div class="rounded-xl p-4 lg:p-2" :class="themeStore.isDark ? 'bg-[#151525]' : 'bg-gray-100'">
          <div class="space-y-4">
            <div v-if="tasksStore.loading" class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500 mx-auto"></div>
            </div>
            
            <div v-else-if="tasksStore.error" class="text-red-500 text-center py-8">
              {{ tasksStore.error }}
            </div>
            
            <div v-else>
              <!-- Mobile View -->
              <div class="lg:hidden space-y-4">
                <div v-for="task in tasksStore.tasks" 
                     :key="task.Tasks" 
                     class="p-4 rounded-lg space-y-3"
                     :class="themeStore.isDark ? 'bg-gray-800/50' : 'bg-white shadow-md'">
                  <div class="flex justify-between items-start">
                    <h3 class="font-medium" :class="themeStore.isDark ? 'text-gray-200' : 'text-gray-900'">{{ task.Tasks }}</h3>
                    <span :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      task.Status === 'Completed' ? 'bg-green-500/20 text-green-700' :
                      task.Status === 'In-Progress' ? 'bg-yellow-500/20 text-yellow-700' :
                      'bg-red-500/20 text-red-700'
                    ]">{{ task.Status }}</span>
                  </div>
                  
                  <p class="text-sm" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">{{ task.Comments }}</p>
                  
                  <div class="flex justify-between items-center text-sm">
                    <span :class="['px-2 py-1 rounded-full text-xs font-medium', getDepartmentColor(task.Department)]">
                      {{ task.Department }}
                    </span>
                    
                    <div class="space-y-1">
                      <div :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'" class="text-right">
                        {{ formatDate(task.Deadline) }}
                      </div>
                      <div class="w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-300"
                             :class="getDeadlineProgress(task.Deadline).color"
                             :style="{ width: getDeadlineProgress(task.Deadline).progress + '%' }">
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <a v-if="task.Files" 
                     :href="task.Files" 
                     target="_blank" 
                     class="text-sm text-blue-600 hover:underline inline-flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    View File
                  </a>
                </div>
              </div>
              
              <!-- Desktop View -->
              <div class="hidden lg:block overflow-x-auto">
                <table class="min-w-full divide-y" :class="themeStore.isDark ? 'divide-gray-700' : 'divide-gray-200'">
                  <thead>
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-700'">Tasks</th>
                      <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-700'">Status</th>
                      <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-700'">Comments</th>
                      <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-700'">Files</th>
                      <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-700'">Department</th>
                      <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-700'">Deadline</th>
                    </tr>
                  </thead>
                  <tbody :class="themeStore.isDark ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'">
                    <tr v-for="task in tasksStore.tasks" :key="task.Tasks" 
                        :class="[themeStore.isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50']">
                      <td class="px-6 py-4 text-sm" :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-900'">
                        {{ task.Tasks }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span :class="[
                          'px-2 py-1 text-xs font-medium rounded-full',
                          task.Status === 'Completed' ? 'bg-green-500/20 text-green-700' :
                          task.Status === 'In-Progress' ? 'bg-yellow-500/20 text-yellow-700' :
                          'bg-red-500/20 text-red-700'
                        ]">
                          {{ task.Status }}
                        </span>
                      </td>
                      <td class="px-6 py-4 text-sm" :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-900'">
                        <div class="max-w-xs truncate">{{ task.Comments }}</div>
                      </td>
                      <td class="px-6 py-4 text-sm">
                        <a v-if="task.Files" 
                           :href="task.Files" 
                           target="_blank" 
                           class="text-blue-600 hover:underline inline-flex items-center">
                          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          View File
                        </a>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span :class="['px-2 py-1 text-xs font-medium rounded-full', getDepartmentColor(task.Department)]">
                          {{ task.Department }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="space-y-1">
                          <div class="text-sm" :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-900'">
                            {{ formatDate(task.Deadline) }}
                          </div>
                          <div class="w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div class="h-full rounded-full transition-all duration-300"
                                 :class="getDeadlineProgress(task.Deadline).color"
                                 :style="{ width: getDeadlineProgress(task.Deadline).progress + '%' }">
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useThemeStore } from '@/stores/themeStore'

const tasksStore = useTasksStore()
const themeStore = useThemeStore()

// Department color mapping
const getDepartmentColor = (department) => {
  const colors = themeStore.isDark ? {
    'SEO': 'bg-blue-500/20 text-blue-400',
    'Media': 'bg-purple-500/20 text-purple-400',
    'Design': 'bg-pink-500/20 text-pink-400',
    'Programming': 'bg-emerald-500/20 text-emerald-400'
  } : {
    'SEO': 'bg-blue-100 text-blue-800',
    'Media': 'bg-purple-100 text-purple-800',
    'Design': 'bg-pink-100 text-pink-800',
    'Programming': 'bg-emerald-100 text-emerald-800'
  }
  return colors[department] || (themeStore.isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-800')
}

// Format date to DD/MM/YYYY
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Calculate deadline progress
const getDeadlineProgress = (deadline) => {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const creationDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
  
  const total = deadlineDate - creationDate
  const remaining = deadlineDate - now
  
  const progress = Math.max(0, Math.min(100, ((total - remaining) / total) * 100))
  
  return {
    progress,
    color: themeStore.isDark
      ? progress >= 80 ? 'bg-red-500'
        : progress >= 50 ? 'bg-yellow-500'
        : 'bg-emerald-500'
      : progress >= 80 ? 'bg-red-600'
        : progress >= 50 ? 'bg-yellow-600'
        : 'bg-emerald-600'
  }
}
</script>
