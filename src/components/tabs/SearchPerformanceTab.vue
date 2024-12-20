<!-- src/components/tabs/SearchPerformanceTab.vue -->
<template>
  <div class="min-h-screen p-4" :class="themeStore.isDark ? 'bg-[#0F0F1E]' : 'bg-gray-50'">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-500 text-center p-4">
      {{ error }}
    </div>

    <!-- Content -->
    <div v-else class="space-y-6">
      <!-- Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="metric in overviewMetrics" 
             :key="metric.label" 
             class="p-4 rounded-xl transition-all duration-300"
             :class="themeStore.isDark ? 'bg-[#151525] hover:bg-[#1A1A35]' : 'bg-white hover:bg-gray-50 shadow-lg'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">
                {{ metric.label }}
              </p>
              <h3 class="text-2xl font-bold mt-1" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">
                {{ metric.value }}
              </h3>
            </div>
            <div :class="`p-3 rounded-lg ${metric.bgColor}`">
              <i :class="`fas ${metric.icon} ${metric.iconColor}`"></i>
            </div>
          </div>
          <div class="mt-2 flex items-center">
            <span :class="`${metric.trend >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`">
              <i :class="`fas fa-${metric.trend >= 0 ? 'arrow-up' : 'arrow-down'} mr-1`"></i>
              {{ Math.abs(metric.trend).toFixed(1) }}%
            </span>
            <span class="ml-2 text-sm" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">
              vs previous period
            </span>
          </div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Clicks & Impressions Chart -->
        <div class="p-4 rounded-xl" :class="themeStore.isDark ? 'bg-[#151525]' : 'bg-white shadow-lg'">
          <h3 class="text-lg font-semibold mb-4" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">
            Clicks & Impressions Trend
          </h3>
          <LineChart
            v-if="chartData.clicksImpressions"
            :data="chartData.clicksImpressions"
            :options="chartOptions.clicksImpressions"
            class="h-[300px]"
          />
        </div>

        <!-- CTR & Position Chart -->
        <div class="p-4 rounded-xl" :class="themeStore.isDark ? 'bg-[#151525]' : 'bg-white shadow-lg'">
          <h3 class="text-lg font-semibold mb-4" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">
            CTR & Position Trend
          </h3>
          <LineChart
            v-if="chartData.ctrPosition"
            :data="chartData.ctrPosition"
            :options="chartOptions.ctrPosition"
            class="h-[300px]"
          />
        </div>

        <!-- Top Queries Table -->
        <div class="p-4 rounded-xl" :class="themeStore.isDark ? 'bg-[#151525]' : 'bg-white shadow-lg'">
          <h3 class="text-lg font-semibold mb-4" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">
            Top Performing Queries
          </h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">
                  <th class="text-left py-2">Query</th>
                  <th class="text-right">Clicks</th>
                  <th class="text-right">CTR</th>
                  <th class="text-right">Position</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="query in topQueries" 
                    :key="query.Query"
                    class="border-b transition-colors"
                    :class="themeStore.isDark ? 'border-gray-700 hover:bg-[#1A1A35]' : 'border-gray-200 hover:bg-gray-50'">
                  <td class="py-2" :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-900'">
                    {{ query.Query }}
                  </td>
                  <td class="text-right">{{ query.Clicks }}</td>
                  <td class="text-right">{{ formatPercentage(query.CTR) }}</td>
                  <td class="text-right">{{ formatPosition(query.Position) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Device Distribution -->
        <div class="p-4 rounded-xl" :class="themeStore.isDark ? 'bg-[#151525]' : 'bg-white shadow-lg'">
          <h3 class="text-lg font-semibold mb-4" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">
            Device Distribution
          </h3>
          <DoughnutChart
            v-if="chartData.devices"
            :data="chartData.devices"
            :options="chartOptions.devices"
            class="h-[300px]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useThemeStore } from '@/stores/themeStore';
import { useAuthStore } from '@/stores/auth';
import { appsScriptService } from '@/services/appsScriptService';
import { Line as LineChart, Doughnut as DoughnutChart } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const themeStore = useThemeStore();
const authStore = useAuthStore();

const searchData = ref({});
const loading = ref(true);
const error = ref(null);

// Fetch search data
const fetchSearchData = async () => {
  try {
    loading.value = true;
    const response = await appsScriptService.getSearchData(authStore.user.username);
    if (response.success) {
      searchData.value = response.data;
    } else {
      error.value = 'Failed to fetch search data';
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Computed properties
const overviewMetrics = computed(() => {
  if (!searchData.value?.overview?.rows?.length) return [];
  
  const latest = searchData.value.overview.rows[0];
  const previous = searchData.value.overview.rows[1];
  
  return [
    {
      label: 'Clicks',
      value: latest.Clicks.toLocaleString(),
      trend: calculateTrend(latest.Clicks, previous.Clicks),
      icon: 'fa-mouse-pointer',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-500'
    },
    {
      label: 'Impressions',
      value: latest.Impressions.toLocaleString(),
      trend: calculateTrend(latest.Impressions, previous.Impressions),
      icon: 'fa-eye',
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-500'
    },
    {
      label: 'CTR',
      value: formatPercentage(latest.CTR),
      trend: calculateTrend(latest.CTR, previous.CTR),
      icon: 'fa-percentage',
      bgColor: 'bg-yellow-500/10',
      iconColor: 'text-yellow-500'
    },
    {
      label: 'Avg Position',
      value: formatPosition(latest.Position),
      trend: -calculateTrend(latest.Position, previous.Position), // Inverse for position
      icon: 'fa-chart-line',
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-500'
    }
  ];
});

const chartData = computed(() => {
  if (!searchData.value?.overview?.rows?.length) return {};

  const dates = searchData.value.overview.rows.map(row => row.Date).reverse();
  
  return {
    clicksImpressions: {
      labels: dates,
      datasets: [
        {
          label: 'Clicks',
          data: searchData.value.overview.rows.map(row => row.Clicks).reverse(),
          borderColor: themeStore.isDark ? '#3b82f6' : '#2563eb',
          backgroundColor: themeStore.isDark ? '#3b82f680' : '#2563eb80',
          tension: 0.4
        },
        {
          label: 'Impressions',
          data: searchData.value.overview.rows.map(row => row.Impressions).reverse(),
          borderColor: themeStore.isDark ? '#10b981' : '#059669',
          backgroundColor: themeStore.isDark ? '#10b98180' : '#05966980',
          tension: 0.4
        }
      ]
    },
    ctrPosition: {
      labels: dates,
      datasets: [
        {
          label: 'CTR',
          data: searchData.value.overview.rows.map(row => row.CTR).reverse(),
          borderColor: themeStore.isDark ? '#f59e0b' : '#d97706',
          backgroundColor: themeStore.isDark ? '#f59e0b80' : '#d9770680',
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: 'Position',
          data: searchData.value.overview.rows.map(row => row.Position).reverse(),
          borderColor: themeStore.isDark ? '#8b5cf6' : '#7c3aed',
          backgroundColor: themeStore.isDark ? '#8b5cf680' : '#7c3aed80',
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    },
    devices: {
      labels: ['Desktop', 'Mobile', 'Tablet'],
      datasets: [{
        data: calculateDeviceDistribution(),
        backgroundColor: [
          themeStore.isDark ? '#3b82f6' : '#2563eb',
          themeStore.isDark ? '#10b981' : '#059669',
          themeStore.isDark ? '#f59e0b' : '#d97706'
        ]
      }]
    }
  };
});

const chartOptions = computed(() => ({
  clicksImpressions: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: themeStore.isDark ? '#fff' : '#000'
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: themeStore.isDark ? '#ffffff20' : '#00000020'
        },
        ticks: {
          color: themeStore.isDark ? '#fff' : '#000'
        }
      },
      y: {
        grid: {
          color: themeStore.isDark ? '#ffffff20' : '#00000020'
        },
        ticks: {
          color: themeStore.isDark ? '#fff' : '#000'
        }
      }
    }
  },
  ctrPosition: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: themeStore.isDark ? '#fff' : '#000'
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: themeStore.isDark ? '#ffffff20' : '#00000020'
        },
        ticks: {
          color: themeStore.isDark ? '#fff' : '#000'
        }
      },
      y: {
        position: 'left',
        grid: {
          color: themeStore.isDark ? '#ffffff20' : '#00000020'
        },
        ticks: {
          color: themeStore.isDark ? '#fff' : '#000',
          callback: value => `${(value * 100).toFixed(1)}%`
        }
      },
      y1: {
        position: 'right',
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          color: themeStore.isDark ? '#fff' : '#000'
        }
      }
    }
  },
  devices: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: themeStore.isDark ? '#fff' : '#000'
        }
      }
    }
  }
}));

// Utility functions
const calculateTrend = (current, previous) => {
  if (!current || !previous) return 0;
  return ((current - previous) / previous) * 100;
};

const formatPercentage = (value) => {
  if (typeof value === 'string') {
    return value;
  }
  return `${(value * 100).toFixed(1)}%`;
};

const formatPosition = (value) => {
  return typeof value === 'number' ? value.toFixed(1) : value;
};

const calculateDeviceDistribution = () => {
  if (!searchData.value?.devices?.rows) return [];
  
  const deviceData = {};
  searchData.value.devices.rows.forEach(row => {
    if (!deviceData[row.Device]) {
      deviceData[row.Device] = 0;
    }
    deviceData[row.Device] += row.Clicks;
  });
  
  return Object.values(deviceData);
};

const topQueries = computed(() => {
  if (!searchData.value?.queries?.rows) return [];
  
  return [...searchData.value.queries.rows]
    .sort((a, b) => b.Clicks - a.Clicks)
    .slice(0, 5);
});

// Initialize data
onMounted(() => {
  fetchSearchData();
});
</script>
