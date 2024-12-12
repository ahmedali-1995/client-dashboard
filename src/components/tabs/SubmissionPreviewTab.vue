<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">{{ submissionTitle }}</h2>
    
    <!-- Display submission data based on tab type -->
    <div v-if="tabType === 'ui'">
      <p><strong>Color Scheme:</strong> {{ submission.colorScheme }}</p>
      <p><strong>Layout:</strong> {{ submission.layout }}</p>
      <img :src="submission.mockupImage" alt="UI Mockup" class="mt-2 w-full h-auto"/>
    </div>
    
    <div v-else-if="tabType === 'logo'">
      <p><strong>Logo Style:</strong> {{ submission.logoStyle }}</p>
      <p><strong>Colors:</strong> {{ submission.colors }}</p>
      <img :src="submission.logoImage" alt="Logo" class="mt-2 w-32 h-32"/>
    </div>
    
    <div v-else-if="tabType === 'banners'">
      <p><strong>Banner Size:</strong> {{ submission.bannerSize }}</p>
      <p><strong>Content:</strong> {{ submission.content }}</p>
      <img :src="submission.bannerImage" alt="Banner" class="mt-2 w-full h-auto"/>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  submission: {
    type: Object,
    required: true,
  },
});

// Determine the tab type based on the submission's properties
const tabType = computed(() => {
  if (props.submission.colorScheme) return 'ui';
  if (props.submission.logoStyle) return 'logo';
  if (props.submission.bannerSize) return 'banners';
  return 'unknown';
});

// Generate a title based on the tab type
const submissionTitle = computed(() => {
  switch(tabType.value) {
    case 'ui':
      return 'UI Design Submission';
    case 'logo':
      return 'Logo Design Submission';
    case 'banners':
      return 'Banners Design Submission';
    default:
      return 'Submission Preview';
  }
});
</script>

<style scoped>
/* Add any scoped styles here */
</style>
