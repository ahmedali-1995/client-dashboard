<template>
  <div class="p-4">
    <button 
      @click="testConnection" 
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Test Connection
    </button>
    <pre v-if="result" class="mt-4 p-4 bg-gray-100 rounded">{{ result }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { googleService } from '../services/googleService'

const result = ref(null)

const testConnection = async () => {
  try {
    result.value = await googleService.debug.testConnection()
    console.log('Test result:', result.value)
  } catch (error) {
    console.error('Test failed:', error)
    result.value = { error: error.message }
  }
}
</script>
