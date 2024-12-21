<template>
  <div :class="themeStore.isDark ? 'bg-[#0F0F1E]' : 'bg-gray-50'" class="min-h-screen w-full p-4 lg:p-2">
    <div class="space-y-3 lg:space-y-2">
      <!-- Header -->
      <div :class="[
        'rounded-xl p-4 lg:p-2',
        themeStore.isDark ? 'bg-gradient-to-r from-emerald-600/20 to-emerald-500/10' : 'bg-gradient-to-r from-emerald-600/10 to-emerald-500/5'
      ]">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3 lg:gap-2">
            <div class="w-10 h-10 lg:w-8 lg:h-8 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
              <i class="fas fa-search"></i>
            </div>
            <h1 class="text-xl lg:text-base font-bold font-changa" :class="themeStore.isDark ? 'text-white' : 'text-gray-800'">
              Search Performance
            </h1>
          </div>
          
          <!-- Date Range Selector -->
          <div class="flex items-center gap-2">
            <select 
              v-model="selectedDateRange"
              class="px-3 py-1 rounded-lg text-sm"
              :class="themeStore.isDark ? 'bg-[#1A1A35] text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200'"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="rounded-xl p-8 text-center" :class="themeStore.isDark ? 'bg-[#1A1A35]' : 'bg-white'">
        <div class="text-red-500 mb-4">
          <i class="fas fa-exclamation-circle text-4xl"></i>
        </div>
        <h3 class="text-xl font-semibold mb-2" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">
          Unable to Load Data
        </h3>
        <p class="text-gray-500 mb-4">{{ error }}</p>
        <button 
          @click="fetchData"
          class="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          Try Again
        </button>
      </div>

      <!-- Empty State for Tables -->
      <div v-if="topQueries.length === 0 && !loading && !error" 
           class="text-center py-8 text-gray-500">
        No query data available for the selected period
      </div>

      <!-- Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-2">
        <!-- Overview Metrics -->
        <div class="lg:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-2">
          <div v-for="metric in overviewMetrics" :key="metric.label" 
            class="rounded-xl p-4 lg:p-3"
            :class="themeStore.isDark ? 'bg-[#1A1A35]' : 'bg-white shadow-lg'"
          >
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                :class="metric.bgColor">
                <i :class="[metric.icon, metric.iconColor]"></i>
              </div>
              <div>
                <h3 class="text-sm font-medium" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">
                  {{ metric.label }}
                </h3>
                <p class="text-xl font-bold" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">
                  {{ metric.value }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span :class="[
                'text-sm',
                metric.trend > 0 ? 'text-green-500' : 'text-red-500'
              ]">
                {{ Math.abs(metric.trend) }}%
              </span>
              <span class="text-xs" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">
                vs previous period
              </span>
            </div>
          </div>
        </div>

        <!-- Main Charts -->
        <div class="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-2">
          <!-- Clicks & Impressions Chart -->
          <div class="rounded-xl p-4 lg:p-3" :class="themeStore.isDark ? 'bg-[#1A1A35]' : 'bg-white shadow-lg'">
            <h3 class="text-lg font-semibold mb-4" :class="themeStore.isDark ? 'text-white' : 'text-gray-800'">
              Clicks & Impressions
            </h3>
            <div class="h-[300px]">
              <Line :data="clicksImpressionsData" :options="chartOptions" />
            </div>
          </div>

          <!-- CTR & Position Chart -->
          <div class="rounded-xl p-4 lg:p-3" :class="themeStore.isDark ? 'bg-[#1A1A35]' : 'bg-white shadow-lg'">
            <h3 class="text-lg font-semibold mb-4" :class="themeStore.isDark ? 'text-white' : 'text-gray-800'">
              CTR & Average Position
            </h3>
            <div class="h-[300px]">
              <Line :data="ctrPositionData" :options="chartOptions" />
            </div>
          </div>
        </div>

        <!-- Top Queries Table -->
        <div class="lg:col-span-2 rounded-xl p-4 lg:p-3" :class="themeStore.isDark ? 'bg-[#1A1A35]' : 'bg-white shadow-lg'">
          <h3 class="text-lg font-semibold mb-4" :class="themeStore.isDark ? 'text-white' : 'text-gray-800'">
            Top Performing Queries
          </h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y" :class="themeStore.isDark ? 'divide-gray-700' : 'divide-gray-200'">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-700'">Query</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-700'">Clicks</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-700'">Impressions</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-700'">CTR</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-700'">Position</th>
                </tr>
              </thead>
              <tbody :class="themeStore.isDark ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'">
                <tr v-for="query in topQueries" :key="query.query" 
                    :class="themeStore.isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'">
                  <td class="px-6 py-4 text-sm" :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-900'">
                    {{ query.query }}
                  </td>
                  <td class="px-6 py-4 text-sm" :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-900'">
                    {{ query.clicks }}
                  </td>
                  <td class="px-6 py-4 text-sm" :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-900'">
                    {{ query.impressions }}
                  </td>
                  <td class="px-6 py-4 text-sm" :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-900'">
                    {{ query.ctr }}%
                  </td>
                  <td class="px-6 py-4 text-sm" :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-900'">
                    {{ query.position.toFixed(1) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Device Distribution -->
        <div class="rounded-xl p-4 lg:p-3" :class="themeStore.isDark ? 'bg-[#1A1A35]' : 'bg-white shadow-lg'">
          <h3 class="text-lg font-semibold mb-4" :class="themeStore.isDark ? 'text-white' : 'text-gray-800'">
            Device Distribution
          </h3>
          <div class="h-[300px]">
            <Pie :data="deviceData" :options="pieChartOptions" />
          </div>
        </div>

        <!-- Geographic Distribution -->
        <div class="rounded-xl p-4 lg:p-3" :class="themeStore.isDark ? 'bg-[#1A1A35]' : 'bg-white shadow-lg'">
          <h3 class="text-lg font-semibold mb-4" :class="themeStore.isDark ? 'text-white' : 'text-gray-800'">
            Geographic Distribution
          </h3>
          <div class="h-[300px]">
            <Bar :data="countryData" :options="barChartOptions" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Line, Pie, Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js'
import { useThemeStore } from '@/stores/themeStore'
import { useAuthStore } from '@/stores/auth'
import { appsScriptService } from '@/services/appsScriptService'
import { format, subDays, parseISO } from 'date-fns'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement)

const themeStore = useThemeStore()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref(null)
const selectedDateRange = ref('30')

// Data states
const gscOverview = ref([])
const gscQueries = ref([])
const gscPages = ref([])
const gscDevices = ref([])
const gscCountries = ref([]

// Utility functions to safely parse numbers
const safeParseFloat = (value) => {
  if (value === undefined || value === null || value === '') return 0
  const parsed = parseFloat(value)
  return isNaN(parsed) ? 0 : parsed
}

const safeGetPercentage = (value) => {
  if (typeof value === 'string' && value.includes('%')) {
    return safeParseFloat(value.replace('%', ''))
  }
  return safeParseFloat(value)
}

// Fetch data
const fetchData = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await appsScriptService.getSearchPerformanceData(authStore.user.username)
    if (response.success) {
      // Ensure we have arrays even if the data is empty
      gscOverview.value = response.data.overview || []
      gscQueries.value = response.data.queries || []
      gscPages.value = response.data.pages || []
      gscDevices.value = response.data.devices || []
      gscCountries.value = response.data.countries || []
      
      // Log the data for debugging
      console.log('Fetched search data:', {
        overview: gscOverview.value,
        queries: gscQueries.value,
        pages: gscPages.value,
        devices: gscDevices.value,
        countries: gscCountries.value
      })
    } else {
      throw new Error(response.error || 'Failed to fetch data')
    }
  } catch (err) {
    console.error('Error fetching search data:', err)
    error.value = 'Failed to load search performance data. Please try again later.'
  } finally {
    loading.value = false
  }
}

// Overview metrics
const overviewMetrics = computed(() => {
  const lastDay = gscOverview.value[0] || {}
  const prevDay = gscOverview.value[1] || {}
  
  return [
    {
      label: 'Total Clicks',
      value: safeParseFloat(lastDay.Clicks) || 0,
      trend: calculateTrend(safeParseFloat(lastDay.Clicks), safeParseFloat(prevDay.Clicks)),
      icon: 'fas fa-mouse-pointer',
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Total Impressions',
      value: safeParseFloat(lastDay.Impressions) || 0,
      trend: calculateTrend(safeParseFloat(lastDay.Impressions), safeParseFloat(prevDay.Impressions)),
      icon: 'fas fa-eye',
      iconColor: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Average CTR',
      value: `${(safeGetPercentage(lastDay.CTR) || 0).toFixed(2)}%`,
      trend: calculateTrend(safeGetPercentage(lastDay.CTR), safeGetPercentage(prevDay.CTR)),
      icon: 'fas fa-percentage',
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Average Position',
      value: (safeParseFloat(lastDay.Position) || 0).toFixed(1),
      trend: calculateTrend(safeParseFloat(lastDay.Position), safeParseFloat(prevDay.Position), true),
      icon: 'fas fa-chart-line',
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ]
})

// Chart data
const clicksImpressionsData = computed(() => ({
  labels: gscOverview.value.map(day => format(parseISO(day.Date), 'MMM dd')).reverse(),
  datasets: [
    {
      label: 'Clicks',
      data: gscOverview.value.map(day => safeParseFloat(day.Clicks)).reverse(),
      borderColor: '#3b82f6',
      backgroundColor: '#3b82f680',
      tension: 0.4
    },
    {
      label: 'Impressions',
      data: gscOverview.value.map(day => safeParseFloat(day.Impressions)).reverse(),
      borderColor: '#10b981',
      backgroundColor: '#10b98180',
      tension: 0.4
    }
  ]
}))

const ctrPositionData = computed(() => ({
  labels: gscOverview.value.map(day => format(parseISO(day.Date), 'MMM dd')).reverse(),
  datasets: [
    {
      label: 'CTR (%)',
      data: gscOverview.value.map(day => safeGetPercentage(day.CTR)).reverse(),
      borderColor: '#8b5cf6',
      backgroundColor: '#8b5cf680',
      tension: 0.4,
      yAxisID: 'y'
    },
    {
      label: 'Position',
      data: gscOverview.value.map(day => safeParseFloat(day.Position)).reverse(),
      borderColor: '#f59e0b',
      backgroundColor: '#f59e0b80',
      tension: 0.4,
      yAxisID: 'y1'
    }
  ]
}))

// Top queries
const topQueries = computed(() => {
  return (gscQueries.value || [])
    .filter(query => query && query.Query) // Filter out invalid entries
    .map(query => ({
      query: query.Query,
      clicks: safeParseFloat(query.Clicks),
      impressions: safeParseFloat(query.Impressions),
      ctr: safeGetPercentage(query.CTR),
      position: safeParseFloat(query.Position)
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10)
})

// Device distribution
const deviceData = computed(() => {
  const deviceStats = (gscDevices.value || []).reduce((acc, curr) => {
    if (!curr || !curr.Device) return acc
    if (!acc[curr.Device]) {
      acc[curr.Device] = { clicks: 0, impressions: 0 }
    }
    acc[curr.Device].clicks += safeParseFloat(curr.Clicks)
    acc[curr.Device].impressions += safeParseFloat(curr.Impressions)
    return acc
  }, {})

  return {
    labels: Object.keys(deviceStats),
    datasets: [{
      data: Object.values(deviceStats).map(v => v.clicks),
      backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6']
    }]
  }
})

// Country distribution
const countryData = computed(() => {
  const countryStats = (gscCountries.value || []).reduce((acc, curr) => {
    if (!curr || !curr.Country) return acc
    if (!acc[curr.Country]) {
      acc[curr.Country] = { clicks: 0, impressions: 0 }
    }
    acc[curr.Country].clicks += safeParseFloat(curr.Clicks)
    acc[curr.Country].impressions += safeParseFloat(curr.Impressions)
    return acc
  }, {})

  return {
    labels: Object.keys(countryStats),
    datasets: [{
      label: 'Clicks',
      data: Object.values(countryStats).map(v => v.clicks),
      backgroundColor: '#3b82f680'
    }]
  }
})

// Chart options
const chartOptions = computed(() => ({
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
        color: themeStore.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      },
      ticks: {
        color: themeStore.isDark ? '#94a3b8' : '#475569'
      }
    },
    y1: {
      beginAtZero: true,
      grid: {
        color: themeStore.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      },
      ticks: {
        color: themeStore.isDark ? '#94a3b8' : '#475569'
      }
    },
    x: {
      grid: {
        color: themeStore.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      },
      ticks: {
        color: themeStore.isDark ? '#94a3b8' : '#475569'
      }
    }
  },
  plugins: {
    legend: {
      labels: {
        color: themeStore.isDark ? '#94a3b8' : '#475569'
      }
    }
  }
}))

const pieChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: themeStore.isDark ? '#94a3b8' : '#475569'
      }
    }
  }
}))

const barChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: themeStore.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      },
      ticks: {
        color: themeStore.isDark ? '#94a3b8' : '#475569'
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: themeStore.isDark ? '#94a3b8' : '#475569'
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
}))

// Utility functions
const calculateTrend = (current, previous, inverse = false) => {
  current = safeParseFloat(current)
  previous = safeParseFloat(previous)
  
  if (current === 0 && previous === 0) return 0
  if (previous === 0) return current > 0 ? 100 : -100
  
  const trend = ((current - previous) / previous) * 100
  return inverse ? -trend : trend
}

// Watch for date range changes
watch(selectedDateRange, () => {
  fetchData()
})

// Initial data fetch
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
