<template>
  <div class="max-w-4xl mx-auto py-8 px-4 relative">
    <!-- Loading State -->
    <div v-if="!designStore.dataLoaded" class="flex items-center justify-center h-96">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500 mx-auto mb-4"></div>
        <p class="text-gray-500 text-lg">Loading design preferences...</p>
      </div>
    </div>

    <!-- Main Design Selection Container -->
    <div v-else class="space-y-8">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-4 text-emerald-500">Design Your Brand</h1>
        <p class="text-gray-600 max-w-xl mx-auto">
          Customize your brand's visual identity by selecting design preferences across UI, Logo, and Banners.
        </p>
      </div>

      <!-- Tabs Navigation -->
      <div class="flex justify-center space-x-4 mb-8">
        <button 
          v-for="tab in subTabs" 
          :key="tab.id"
          @click="switchSubTab(tab.id)"
          class="px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out"
          :class="[
            currentSubTab === tab.id 
              ? 'bg-emerald-500 text-white shadow-lg' 
              : 'bg-gray-100 text-gray-600 hover:bg-emerald-100 hover:text-emerald-600'
          ]"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- Design Selection Container -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <!-- Progress Indicator -->
        <div class="bg-gray-100 dark:bg-gray-700 p-4 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center">
              <span>{{ currentSlideIndex + 1 }}</span>
            </div>
            <div>
              <h2 class="text-lg font-semibold dark:text-white">
                {{ currentSlide.question }}
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-300">
                Select an option that best represents your brand
              </p>
            </div>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-300">
            Step {{ currentSlideIndex + 1 }} of 4
          </div>
        </div>

        <!-- Choice Grid -->
        <div class="grid grid-cols-2 gap-6 p-8">
          <div 
            v-for="choice in currentSlide.choices" 
            :key="choice.value"
            @click="selectChoice(currentKey, choice.value)"
            class="cursor-pointer group transition-all duration-300 transform hover:scale-105 relative"
          >
            <div 
              class="border-4 rounded-2xl overflow-hidden transition-all duration-300"
              :class="{
                'border-emerald-500': designStore.formData[currentSubTab][currentKey] === choice.value,
                'border-transparent group-hover:border-emerald-200': designStore.formData[currentSubTab][currentKey] !== choice.value
              }"
            >
              <img 
                :src="choice.image" 
                :alt="choice.label" 
                class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div 
              class="mt-4 text-center transition-all duration-300"
              :class="{
                'text-emerald-600 font-semibold': designStore.formData[currentSubTab][currentKey] === choice.value,
                'text-gray-600 group-hover:text-emerald-500': designStore.formData[currentSubTab][currentKey] !== choice.value
              }"
            >
              {{ choice.label }}
            </div>
            <div 
              v-if="designStore.formData[currentSubTab][currentKey] === choice.value"
              class="absolute top-2 right-2 bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
            >
              <i class="fas fa-check"></i>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="bg-gray-100 dark:bg-gray-700 p-4 flex justify-between items-center">
          <button 
            @click="prevSlide" 
            :disabled="currentSlideIndex === 0"
            class="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 transition-all"
          >
            Previous
          </button>
          <button 
            @click="nextSlide" 
            :disabled="!designStore.formData[currentSubTab][currentKey]"
            class="px-6 py-2 rounded-lg bg-emerald-500 text-white disabled:bg-gray-400 transition-all"
          >
            {{ currentSlideIndex === 3 ? 'Submit' : 'Next' }}
          </button>
        </div>
      </div>

      <!-- Submission Preview -->
      <div 
        v-if="designStore.submitted[currentSubTab]" 
        class="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-emerald-500">
            {{ currentSubTab.toUpperCase() }} Design Submission
          </h2>
          <span class="text-sm text-gray-500">
            Submitted on: {{ designStore.submissionTime[currentSubTab] }}
          </span>
        </div>
        
        <div class="grid grid-cols-2 gap-6">
          <div 
            v-for="(slide, index) in questions[currentSubTab]" 
            :key="index"
            class="bg-gray-100 dark:bg-gray-700 rounded-xl p-4"
          >
            <h3 class="text-lg font-semibold mb-3 text-gray-700 dark:text-white">
              {{ slide.question }}
            </h3>
            <div 
              v-for="choice in slide.choices" 
              :key="choice.value"
              v-if="designStore.formData[currentSubTab][slide.keys[0]] === choice.value"
              class="flex items-center space-x-4"
            >
              <img 
                :src="choice.image" 
                :alt="choice.label" 
                class="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <p class="font-medium text-gray-700 dark:text-white">{{ choice.label }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { appsScriptService } from '@/services/appsScriptService'
import { useDesignStore } from '@/stores/designStore'

const authStore = useAuthStore()
const designStore = useDesignStore()

const props = defineProps({
  userData: {
    type: Object,
    required: true
  }
})

const subTabs = [
  { id: 'ui', name: 'UI' },
  { id: 'logo', name: 'Logo' },
  { id: 'banners', name: 'Banners' }
]

const currentSubTab = ref('ui')
const currentSlideIndex = ref(0)

const choiceImagesUI = [
  { label: 'Modern', value: 'ui_modern', image: 'https://static.wixstatic.com/media/84b06e_bac21fb74cc74f5d9ae0cfa7f73f8192~mv2.jpg' },
  { label: 'Minimal', value: 'ui_minimal', image: 'https://static.wixstatic.com/media/84b06e_726ba92470d64a0a9da12c3ee7bc1c45~mv2.png' },
  { label: 'Bold', value: 'ui_bold', image: 'https://static.wixstatic.com/media/84b06e_eff02c97bca240769a41f8e8c09ff5ef~mv2.jpg' },
  { label: 'Classic', value: 'ui_classic', image: 'https://static.wixstatic.com/media/84b06e_5b3d969468204df58f7a6cb5d1e5be44~mv2.jpg' }
]

const choiceImagesLogo = [
  { label: 'Abstract', value: 'logo_abstract', image: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Abstract' },
  { label: 'Geometric', value: 'logo_geometric', image: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Geometric' },
  { label: 'Iconic', value: 'logo_iconic', image: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Iconic' },
  { label: 'Typographic', value: 'logo_typographic', image: 'https://via.placeholder.com/150/FFFF00/000000?text=Typographic' }
]

const choiceImagesBanners = [
  { label: 'Hero Image', value: 'banner_hero', image: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Hero' },
  { label: 'Promotional', value: 'banner_promo', image: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Promo' },
  { label: 'Seasonal', value: 'banner_seasonal', image: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Seasonal' },
  { label: 'Minimalist', value: 'banner_minimalist', image: 'https://via.placeholder.com/150/FFFF00/000000?text=Minimalist' }
]

const questions = {
  ui: [
    { question: 'What UI style do you prefer?', keys: ['ui_slide1'], choices: choiceImagesUI },
    { question: 'Choose your primary color scheme:', keys: ['ui_slide2'], choices: choiceImagesUI },
    { question: 'Select your preferred layout style:', keys: ['ui_slide3'], choices: choiceImagesUI },
    { question: 'Select your preferred font style:', keys: ['ui_slide4'], choices: choiceImagesUI }
  ],
  logo: [
    { question: 'Select the logo style you like most:', keys: ['logo_slide1'], choices: choiceImagesLogo },
    { question: 'Choose a color combination for your logo:', keys: ['logo_slide2'], choices: choiceImagesLogo },
    { question: 'Pick a shape that resonates with your brand:', keys: ['logo_slide3'], choices: choiceImagesLogo },
    { question: 'Select a font style for your logo text:', keys: ['logo_slide4'], choices: choiceImagesLogo }
  ],
  banners: [
    { question: 'Choose a banner layout style:', keys: ['banners_slide1'], choices: choiceImagesBanners },
    { question: 'Pick the primary banner image concept:', keys: ['banners_slide2'], choices: choiceImagesBanners },
    { question: 'Select a banner color palette:', keys: ['banners_slide3'], choices: choiceImagesBanners },
    { question: 'Choose a call-to-action style for the banner:', keys: ['banners_slide4'], choices: choiceImagesBanners }
  ]
}

const currentSlide = computed(() => questions[currentSubTab.value][currentSlideIndex.value])
const currentKey = computed(() => currentSlide.value.keys[0])

function selectChoice(key, value) {
  designStore.setFormData(currentSubTab.value, key, value)
}

function nextSlide() {
  if (currentSlideIndex.value < 3 && designStore.formData[currentSubTab.value][currentKey.value]) {
    currentSlideIndex.value++
  } else if (currentSlideIndex.value === 3) {
    submitForm(currentSubTab.value)
  }
}

function prevSlide() {
  if (currentSlideIndex.value > 0) {
    currentSlideIndex.value--
  }
}

async function submitForm(type) {
  const username = authStore.user?.username
  if (!username) return

  const dataToSubmit = { ...designStore.formData[type] }
  const response = await appsScriptService.submitDesignData(username, type, dataToSubmit)
  
  if (response.success) {
    designStore.setSubmitted(type, true)
    designStore.setSubmissionTime(type, new Date().toLocaleString())
  } else {
    alert('Error submitting form: ' + response.error)
  }
}

function switchSubTab(id) {
  currentSubTab.value = id
  currentSlideIndex.value = 0
}

onMounted(async () => {
  const username = authStore.user?.username
  if (username && !designStore.isInitialized) {
    await designStore.fetchDesignData(username)
  }
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
