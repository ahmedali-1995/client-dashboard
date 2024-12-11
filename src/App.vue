<template>
  <router-view></router-view>
</template>

<script setup>
// App level setup
import { onMounted } from 'vue'
import { useThemeStore } from './stores/themeStore'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})
</script>
