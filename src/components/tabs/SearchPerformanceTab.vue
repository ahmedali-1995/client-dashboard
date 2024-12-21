<template>
  <div class="p-4 space-y-6">
    <!-- Overview Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="(metric, index) in overviewMetrics" 
        :key="index"
        class="bg-white dark:bg-[#1A1A35] rounded-xl p-4 shadow-md flex items-center space-x-4"
      >
        <div 
          class="w-12 h-12 rounded-full flex items-center justify-center"
          :class="metric.bgClass"
        >
          <i :class="metric.icon" class="text-white text-xl"></i>
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ metric.label }}</p>
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">{{ metric.value }}</h3>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Clicks & Impressions Chart -->
      <div class="bg-white dark:bg-[#1A1A35] rounded-xl p-4 shadow-md">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Clicks & Impressions Over Time
        </h3>
        <canvas ref="clicksImpressionsChart" height="300"></canvas>
      </div>

      <!-- CTR & Position Chart -->
      <div class="bg-white dark:bg-[#1A1A35] rounded-xl p-4 shadow-md">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          CTR & Average Position
        </h3>
        <canvas ref="ctrPositionChart" height="300"></canvas>
      </div>
    </div>

    <!-- Detailed Tables -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Queries -->
      <div class="bg-white dark:bg-[#1A1A35] rounded-xl p-4 shadow-md">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Top Search Queries
        </h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b dark:border-gray-700">
                <th class="py-2 text-left">Query</th>
                <th class="py-2 text-right">Clicks</th>
                <th class="py-2 text-right">Impressions</th>
                <th class="py-2 text-right">CTR</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="query in topQueries" 
                :key="query.Query" 
                class="border-b last:border-b-0 dark:border-gray-700"
              >
                <td class="py-2 truncate max-w-[150px]">{{ query.Query }}</td>
                <td class="py-2 text-right">{{ query.Clicks }}</td>
                <td class="py-2 text-right">{{ query.Impressions }}</td>
                <td class="py-2 text-right">{{ query.CTR }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Top Pages -->
      <div class="bg-white dark:bg-[#1A1A35] rounded-xl p-4 shadow-md">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Top Performing Pages
        </h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b dark:border-gray-700">
                <th class="py-2 text-left">Page</th>
                <th class="py-2 text-right">Clicks</th>
                <th class="py-2 text-right">Impressions</th>
                <th class="py-2 text-right">CTR</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="page in topPages" 
                :key="page.Page" 
                class="border-b last:border-b-0 dark:border-gray-700"
              >
                <td class="py-2 truncate max-w-[150px]">{{ page.Page }}</td>
                <td class="py-2 text-right">{{ page.Clicks }}</td>
                <td class="py-2 text-right">{{ page.Impressions }}</td>
                <td class="py-2 text-right">{{ page.CTR }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Device & Country Breakdown -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Device Performance -->
      <div class="bg-white dark:bg-[#1A1A35] rounded-xl p-4 shadow-md">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Performance by Device
        </h3>
        <canvas ref="deviceChart" height="300"></canvas>
      </div>

      <!-- Country Performance -->
      <div class="bg-white dark:bg-[#1A1A35] rounded-xl p-4 shadow-md">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Performance by Country
        </h3>
        <canvas ref="countryChart" height="300"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useAuthStore } from '@/stores/auth'
import { appsScriptService } from '@/services/appsScriptService'

// Register Chart.js components
Chart.register(...registerables)

const authStore = useAuthStore()

// Refs for charts
const clicksImpressionsChart = ref(null)
const ctrPositionChart = ref(null)
const deviceChart = ref(null)
const countryChart = ref(null)

// Data state
const gscData = ref({
  overview: [],
  queries: [],
  pages: [],
  devices: [],
  countries: []
})

// Computed properties for overview metrics
const overviewMetrics = computed(() => {
  const overview = gscData.value.overview[0] || {}
  return [
    {
      label: 'Total Clicks',
      value: overview.Clicks || 0,
      icon: 'fas fa-mouse-pointer',
      bgClass: 'bg-blue-500'
    },
    {
      label: 'Total Impressions',
      value: overview.Impressions || 0,
      icon: 'fas fa-eye',
      bgClass: 'bg-green-500'
    },
    {
      label: 'CTR',
      value: overview.CTR || '0%',
      icon: 'fas fa-chart-line',
      bgClass: 'bg-purple-500'
    },
    {
      label: 'Avg. Position',
      value: overview.Position ? overview.Position.toFixed(2) : 0,
      icon: 'fas fa-trophy',
      bgClass: 'bg-orange-500'
    }
  ]
})

// Computed properties for top data
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

// Fetch GSC data
async function fetchGSCData() {
  const username = authStore.user?.username
  if (!username) return

  try {
    const sheets = ['gsc overview', 'gsc queries', 'gsc pages', 'gsc devices', 'gsc countries']
    const promises = sheets.map(sheet => 
      appsScriptService.getUserData(username, { action: 'getSheetData', sheetName: sheet })
    )

    const results = await Promise.all(promises)
    
    gscData.value = {
      overview: results[0].data || [],
      queries: results[1].data || [],
      pages: results[2].data || [],
      devices: results[3].data || [],
      countries: results[4].data || []
    }

    // Create charts after data is fetched
    createCharts()
  } catch (error) {
    console.error('Error fetching GSC data:', error)
  }
}

// Chart creation function
function createCharts() {
  // Clicks & Impressions Chart
  new Chart(clicksImpressionsChart.value, {
    type: 'line',
    data: {
      labels: gscData.value.overview.map(row => row.Date),
      datasets: [
        {
          label: 'Clicks',
          data: gscData.value.overview.map(row => row.Clicks),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'Impressions',
          data: gscData.value.overview.map(row => row.Impressions),
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  })

  // CTR & Position Chart
  new Chart(ctrPositionChart.value, {
    type: 'line',
    data: {
      labels: gscData.value.overview.map(row => row.Date),
      datasets: [
        {
          label: 'CTR',
          data: gscData.value.overview.map(row => parseFloat(row.CTR)),
          borderColor: 'rgb(54, 162, 235)',
          tension: 0.1
        },
        {
          label: 'Position',
          data: gscData.value.overview.map(row => row.Position),
          borderColor: 'rgb(255, 206, 86)',
          tension: 0.1
        }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  })

  // Device Performance Chart
  new Chart(deviceChart.value, {
    type: 'pie',
    data: {
      labels: gscData.value.devices.map(row => row.Device),
      datasets: [{
        data: gscData.value.devices.map(row => row.Clicks),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)'
        ]
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  })

  // Country Performance Chart
  new Chart(countryChart.value, {
    type: 'bar',
    data: {
      labels: gscData.value.countries.map(row => row.Country),
      datasets: [{
        label: 'Clicks by Country',
        data: gscData.value.countries.map(row => row.Clicks),
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  })
}

onMounted(fetchGSCData)
</script>

<style scoped>
/* Responsive table styles */
table {
  width: 100%;
  border-collapse: collapse;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  table {
    color: white;
  }
}
</style>
