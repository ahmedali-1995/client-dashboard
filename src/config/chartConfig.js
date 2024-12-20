// src/config/chartConfig.js
export const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

export const createChartData = (labels, datasets) => ({
  labels,
  datasets
})