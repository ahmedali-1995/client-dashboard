import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          'chart': ['chart.js', 'vue-chartjs'],
          'vendor': ['vue', '@vue/runtime-dom', 'pinia', 'vue-router']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['chart.js', 'vue-chartjs', 'date-fns']
  }
})
