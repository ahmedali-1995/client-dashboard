<template>
  <div class="p-4 space-y-6" :class="themeStore.isDark ? 'text-white' : 'text-gray-800'">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-500 text-center py-8">
      {{ error }}
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          v-for="(stat, index) in stats" 
          :key="index"
          class="p-4 rounded-lg"
          :class="themeStore.isDark ? 'bg-[#1A1A35]' : 'bg-white shadow'"
        >
          <div class="flex items-center space-x-3">
            <div 
              class="w-12 h-12 rounded-lg flex items-center justify-center"
              :class="stat.bgColor"
            >
              <i :class="['fas', stat.icon, 'text-xl text-white']"></i>
            </div>
            <div>
              <p class="text-sm opacity-70">{{ stat.label }}</p>
              <p class="text-xl font-bold">{{ stat.value }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <!-- Performance Over Time -->
        <div 
          class="p-4 rounded-lg"
          :class="themeStore.isDark ? 'bg-[#1A1A35]' : 'bg-white shadow'"
        >
          <h3 class="text-lg font-semibold mb-4">Performance Over Time</h3>
          <div class="h-[300px] relative">
            <canvas ref="performanceChart"></canvas>
          </div>
        </div>

        <!-- Device Distribution -->
        <div 
          class="p-4 rounded-lg"
          :class="themeStore.isDark ? 'bg-[#1A1A35]' : 'bg-white shadow'"
        >
          <h3 class="text-lg font-semibold mb-4">Device Distribution</h3>
          <div class="h-[300px] relative">
            <canvas ref="deviceChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Data Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <!-- Top Queries -->
        <div 
          class="p-4 rounded-lg"
          :class="themeStore.isDark ? 'bg-[#1A1A35]' : 'bg-white shadow'"
        >
          <h3 class="text-lg font-semibold mb-4">Top Search Queries</h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-left">
                  <th class="pb-3">Query</th>
                  <th class="pb-3 text-right">Clicks</th>
                  <th class="pb-3 text-right">Impressions</th>
                  <th class="pb-3 text-right">CTR</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="query in topQueries" :key="query.Query">
                  <td class="py-2">{{ query.Query }}</td>
                  <td class="py-2 text-right">{{ query.Clicks }}</td>
                  <td class="py-2 text-right">{{ query.Impressions }}</td>
                  <td class="py-2 text-right">{{ query.CTR }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Top Pages -->
        <div 
          class="p-4 rounded-lg"
          :class="themeStore.isDark ? 'bg-[#1A1A35]' : 'bg-white shadow'"
        >
          <h3 class="text-lg font-semibold mb-4">Top Pages</h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-left">
                  <th class="pb-3">Page</th>
                  <th class="pb-3 text-right">Clicks</th>
                  <th class="pb-3 text-right">Impressions</th>
                  <th class="pb-3 text-right">CTR</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="page in topPages" :key="page.Page">
                  <td class="py-2">{{ page.Page }}</td>
                  <td class="py-2 text-right">{{ page.Clicks }}</td>
                  <td class="py-2 text-right">{{ page.Impressions }}</td>
                  <td class="py-2 text-right">{{ page.CTR }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/themeStore'
import { appsScriptService } from '@/services/appsScriptService'

// State
const loading = ref(true)
const error = ref(null)
const performanceChart = ref(null)
const deviceChart = ref(null)
const authStore = useAuthStore()
const themeStore = useThemeStore()

// Data
const gscData = ref({
  overview: [],
  queries: [],
  pages: [],
  devices: [],
  countries: []
})

// Stats cards data
const stats = computed(() => {
  const latest = gscData.value.overview[0] || {}
  return [
    {
      label: 'Total Clicks',
      value: latest.Clicks || 0,
      icon: 'fa-mouse-pointer',
      bgColor: 'bg-blue-500'
    },
    {
      label: 'Impressions',
      value: latest.Impressions || 0,
      icon: 'fa-eye',
      bgColor: 'bg-green-500'
    },
    {
      label: 'Average CTR',
      value: latest.CTR || '0%',
      icon: 'fa-percentage',
      bgColor: 'bg-purple-500'
    },
    {
      label: 'Average Position',
      value: latest.Position?.toFixed(1) || 0,
      icon: 'fa-chart-line',
      bgColor: 'bg-orange-500'
    }
  ]
})

// Computed properties for tables
const topQueries = computed(() => {
  return gscData.value.queries
    .sort((a, b) => b.Clicks - a.Clicks)
    .slice(0, 5)
})

const topPages = computed(() => {
  return gscData.value.pages
    .sort((a, b) => b.Clicks - a.Clicks)
    .slice(0, 5)
})

// Fetch data
async function fetchData() {
  try {
    loading.value = true
    error.value = null
    
    const username = authStore.user?.username
    if (!username) {
      throw new Error('No user found')
    }

    const sheets = ['gsc overview', 'gsc queries', 'gsc pages', 'gsc devices', 'gsc countries']
    const promises = sheets.map(sheet => 
      appsScriptService.getSheetData(username, sheet)
    )

    const results = await Promise.all(promises)
    
    gscData.value = {
      overview: results[0].data || [],
      queries: results[1].data || [],
      pages: results[2].data || [],
      devices: results[3].data || [],
      countries: results[4].data || []
    }

    await initCharts()
  } catch (err) {
    console.error('Error fetching data:', err)
    error.value = 'Failed to load search performance data'
  } finally {
    loading.value = false
  }
}

// Initialize charts
async function initCharts() {
  // We'll dynamically import Chart.js only when needed
  const { Chart } = await import('chart.js/auto')
  
  // Performance Chart
  if (performanceChart.value) {
    new Chart(performanceChart.value, {
      type: 'line',
      data: {
        labels: gscData.value.overview.map(d => d.Date).reverse(),
        datasets: [
          {
            label: 'Clicks',
            data: gscData.value.overview.map(d => d.Clicks).reverse(),
            borderColor: '#3b82f6',
            tension: 0.4
          },
          {
            label: 'Impressions',
            data: gscData.value.overview.map(d => d.Impressions).reverse(),
            borderColor: '#10b981',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: themeStore.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    })
  }

  // Device Chart
  if (deviceChart.value) {
    new Chart(deviceChart.value, {
      type: 'doughnut',
      data: {
        labels: gscData.value.devices.map(d => d.Device),
        datasets: [{
          data: gscData.value.devices.map(d => d.Clicks),
          backgroundColor: [
            '#3b82f6',
            '#10b981',
            '#8b5cf6'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    })
  }
}

// Initialize
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Table styles */
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.5rem;
}

tbody tr {
  border-bottom: 1px solid;
  @apply border-gray-200 dark:border-gray-700;
}

tbody tr:last-child {
  border-bottom: none;
}
</style>
