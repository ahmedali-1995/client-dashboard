<!-- DesignTab.vue -->
<template>
  <div class="max-w-3xl mx-auto space-y-8">
    <div class="flex space-x-4 border-b mb-4 pb-2">
      <button 
        v-for="sub in subTabs" 
        :key="sub.id" 
        @click="switchSubTab(sub.id)"
        :disabled="submitted[sub.id]"
        :class="[
          'px-4 py-2 text-sm font-semibold transition-colors',
          currentSubTab === sub.id 
            ? 'border-b-2 border-emerald-500 text-emerald-500' 
            : 'text-gray-600 hover:text-emerald-500'
        ]"
      >
        {{ sub.name }}
      </button>
    </div>

    <div v-if="!submitted[currentSubTab]" class="space-y-4">
      <div class="flex items-center justify-between text-sm text-gray-600">
        <div>{{ currentSlideIndex + 1 }} / 4</div>
        <div class="space-x-2">
          <span 
            v-for="(dot, i) in 4"
            :key="i"
            class="inline-block w-2 h-2 rounded-full"
            :class="i === currentSlideIndex ? 'bg-emerald-500' : 'bg-gray-300'"
          ></span>
        </div>
      </div>

      <div class="border p-6 rounded bg-white shadow">
        <h3 class="text-lg font-semibold mb-4">{{ currentSlide.question }}</h3>
        <p class="text-sm text-gray-500 mb-4">Please choose one option that best fits your preference.</p>
        <div class="grid grid-cols-2 gap-4">
          <div 
            v-for="(choice, cIndex) in currentSlide.choices" 
            :key="cIndex"
            class="border rounded p-4 flex flex-col items-center hover:shadow-lg transition cursor-pointer relative"
            :class="{
              'border-emerald-500 bg-emerald-50': formData[currentSubTab][currentKey] === choice.value,
              'border-gray-200': formData[currentSubTab][currentKey] !== choice.value
            }"
            @click="selectChoice(currentKey, choice.value)"
          >
            <img :src="choice.image" alt="Choice Image" class="h-24 w-auto mb-2 object-cover rounded" />
            <p class="font-medium text-center text-sm">{{ choice.label }}</p>
            <div v-if="formData[currentSubTab][currentKey] === choice.value" class="absolute top-2 right-2 text-emerald-500">
              <i class="fas fa-check-circle"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-between">
        <button
          v-if="currentSlideIndex > 0"
          @click="prevSlide"
          class="px-4 py-2 text-sm border rounded hover:bg-gray-100 text-gray-700"
        >
          Back
        </button>
        <button
          v-if="currentSlideIndex < 3"
          @click="nextSlide"
          :disabled="!formData[currentSubTab][currentKey]"
          class="px-4 py-2 text-sm rounded bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
        <button
          v-else
          @click="submitForm(currentSubTab)"
          :disabled="!formData[currentSubTab][currentKey]"
          class="px-4 py-2 text-sm rounded bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </div>
    </div>

    <div v-else class="space-y-4">
      <h3 class="text-xl font-semibold mb-4">Submission Preview ({{ currentSubTab }})</h3>
      <p class="text-gray-500 text-sm">Below are the options you selected. This form cannot be edited again without code changes.</p>
      <div 
        v-for="(slide, index) in questions[currentSubTab]" 
        :key="index" 
        class="border p-4 rounded bg-white shadow"
      >
        <h4 class="font-medium mb-2">{{ slide.question }}</h4>
        <div class="flex items-center space-x-4">
          <div v-for="choice in slide.choices" :key="choice.value">
            <div v-if="formData[currentSubTab][slide.keys[0]] === choice.value">
              <img :src="choice.image" alt="Chosen Image" class="h-24 w-auto object-cover mb-2 rounded"/>
              <p class="text-sm">{{ choice.label }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { appsScriptService } from '@/services/appsScriptService'

const authStore = useAuthStore()

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

const formData = reactive({
  ui: { ui_slide1: '', ui_slide2: '', ui_slide3: '', ui_slide4: '' },
  logo: { logo_slide1: '', logo_slide2: '', logo_slide3: '', logo_slide4: '' },
  banners: { banners_slide1: '', banners_slide2: '', banners_slide3: '', banners_slide4: '' }
})

const submitted = reactive({
  ui: false,
  logo: false,
  banners: false
})

const currentSlide = computed(() => questions[currentSubTab.value][currentSlideIndex.value])
const currentKey = computed(() => currentSlide.value.keys[0])

const selectChoice = (key, value) => {
  formData[currentSubTab.value][key] = value
}

const nextSlide = () => {
  if (currentSlideIndex.value < 3 && formData[currentSubTab.value][currentKey.value]) {
    currentSlideIndex.value++
  }
}

const prevSlide = () => {
  if (currentSlideIndex.value > 0) {
    currentSlideIndex.value--
  }
}

const submitForm = async (type) => {
  const username = authStore.user?.username
  if (!username) return
  const dataToSubmit = { ...formData[type] }
  const response = await appsScriptService.submitDesignData(username, type, dataToSubmit)
  if (response.success) {
    submitted[type] = true
  } else {
    alert('Error submitting form: ' + response.error)
  }
}

onMounted(() => {
  const uiSubmitted = (props.userData.ui_submitted || '').toLowerCase() === 'true'
  const logoSubmitted = (props.userData.logo_submitted || '').toLowerCase() === 'true'
  const bannersSubmitted = (props.userData.banners_submitted || '').toLowerCase() === 'true'

  submitted.ui = uiSubmitted
  submitted.logo = logoSubmitted
  submitted.banners = bannersSubmitted
})

const switchSubTab = (id) => {
  currentSubTab.value = id
  currentSlideIndex.value = 0
}
</script>

<style scoped>
.hover\:shadow-lg:hover {
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
</style>
