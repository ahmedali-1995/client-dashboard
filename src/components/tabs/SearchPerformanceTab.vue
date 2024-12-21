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
      <div v-else-if="error" class="text-red-500 text-center py-8">
        {{ error }}
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
const gscCountries = ref([])

// Fetch data
const fetchData = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await appsScriptService.getSearchPerformanceData(authStore.user.username)
    if (response.success) {
      gscOverview.value = response.data.overview || []
      gscQueries.value = response.data.queries || []
      gscPages.value = response.data.pages || []
      gscDevices.value = response.data.devices || []
      gscCountries.value = response.data.countries || []
    } else {
      throw new Error(response.error || 'Failed to fetch data')
    }
  } catch (err) {
    console.error('Error fetching search data:', err)
    error.value = err.message
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
      value: lastDay.Clicks || 0,
      trend: calculateTrend(lastDay.Clicks, prevDay.Clicks),
      icon: 'fas fa-mouse-pointer',
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Total Impressions',
      value: lastDay.Impressions || 0,
      trend: calculateTrend(lastDay.Impressions, prevDay.Impressions),
      icon: 'fas fa-eye',
      iconColor: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Average CTR',
      value: `${(lastDay.CTR || 0).toFixed(2)}%`,
      trend: calculateTrend(parseFloat(lastDay.CTR), parseFloat(prevDay.CTR)),
      icon: 'fas fa-percentage',
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Average Position',
      value: (lastDay.Position || 0).toFixed(1),
      trend: calculateTrend(lastDay.Position, prevDay.Position, true),
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
      data: gscOverview.value.map(day => day.Clicks).reverse(),
      borderColor: '#3b82f6',
      backgroundColor: '#3b82f680',
      tension: 0.4
    },
    {
      label: 'Impressions',
      data: gscOverview.value.map(day => day.Impressions).reverse(),
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
      data: gscOverview.value.map(day => parseFloat(day.CTR)).reverse(),
      borderColor: '#8b5cf6',
      backgroundColor: '#8b5cf680',
      tension: 0.4,
      yAxisID: 'y'
    },
    {
      label: 'Position',
      data: gscOverview.value.map(day => day.Position).reverse(),
      borderColor: '#f59e0b',
      backgroundColor: '#f59e0b80',
      tension: 0.4,
      yAxisID: 'y1'
    }
  ]
}))

// Top queries
const topQueries = computed(() => {
  return gscQueries.value
    .sort((a, b) => b.Clicks - a.Clicks)
    .slice(0, 10)
})

// Device distribution
const deviceData = computed(() => {
  const deviceStats = gscDevices.value.reduce((acc, curr) => {
    if (!acc[curr.Device]) {
      acc[curr.Device] = { clicks: 0, impressions: 0 }
    }
    acc[curr.Device].clicks += curr.Clicks
    acc[curr.Device].impressions += curr.Impressions
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
  const countryStats = gscCountries.value.reduce((acc, curr) => {
    if (!acc[curr.Country]) {
      acc[curr.Country] = { clicks: 0, impressions: 0 }
    }
    acc[curr.Country].clicks += curr.Clicks
    acc[curr.Country].impressions += curr.Impressions
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
  if (!current || !previous) return 0
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
