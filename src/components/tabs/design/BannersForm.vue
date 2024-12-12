<!-- src/components/tabs/design/BannersForm.vue -->
<template>
  <div>
    <div v-if="submitted">
      <h2 class="text-2xl font-bold mb-4">Banners Design Submission Preview</h2>
      <div class="border p-4 rounded">
        <p><strong>Question 1:</strong> {{ formData.question1 }}</p>
        <p><strong>Question 2:</strong> {{ formData.question2 }}</p>
        <img :src="formData.image1" alt="Submitted Banners Design" class="mt-4 w-full h-auto" />
      </div>
    </div>

    <div v-else>
      <form @submit.prevent="handleSubmit">
        <div v-for="(slide, index) in slides" :key="index" v-show="currentSlide === index">
          <div class="mb-4">
            <label class="block text-gray-700">Question {{ index + 1 }}</label>
            <input
              v-model="formData[`question${index + 1}`]"
              type="text"
              required
              class="w-full px-3 py-2 border rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Upload Image</label>
            <input
              @change="handleImageUpload($event, `image${index + 1}`)"
              type="file"
              accept="image/*"
              required
              class="w-full"
            />
            <img
              v-if="formData[`image${index + 1}`]"
              :src="formData[`image${index + 1}`]"
              alt="Preview"
              class="mt-2 w-full h-auto"
            />
          </div>
        </div>

        <div class="flex justify-between mt-4">
          <button
            type="button"
            @click="prevSlide"
            :disabled="currentSlide === 0"
            class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            @click="nextSlide"
            :disabled="currentSlide === slides.length - 1"
            class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div class="mt-4">
          <button
            type="submit"
            class="px-4 py-2 bg-emerald-500 text-white rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { appsScriptService } from '../../../services/appsScriptService';

const slides = [
  { title: 'Slide 1: Describe your banners needs' },
  { title: 'Slide 2: Upload your banners inspirations' },
];

const currentSlide = ref(0);
const formData = ref({
  question1: '',
  question2: '',
  image1: '',
  image2: '',
});
const submitted = ref(false);

const authStore = useAuthStore();

const nextSlide = () => {
  if (currentSlide.value < slides.length - 1) {
    currentSlide.value += 1;
  }
};

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value -= 1;
  }
};

const handleImageUpload = (event, key) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      formData.value[key] = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = async () => {
  const submissionData = {
    action: 'submitDesign',
    username: authStore.user.username, // Retrieve the current user's username
    type: 'Banners',
    data: {
      question1: formData.value.question1,
      question2: formData.value.question2,
      image1: formData.value.image1,
      image2: formData.value.image2,
    },
    timestamp: new Date().toISOString(),
  };

  const response = await appsScriptService.submitDesign(submissionData);
  if (response.success) {
    submitted.value = true;
  } else {
    alert(`Submission failed: ${response.error}`);
  }
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
