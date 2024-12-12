<!-- DesignTab.vue -->
<template>
  <div class="max-w-3xl mx-auto py-6 space-y-8">
    <div v-if="!dataLoaded" class="flex items-center justify-center h-full py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
    <div v-else>
      <div class="flex space-x-4 border-b pb-3 mb-8">
        <button 
          v-for="sub in subTabs" 
          :key="sub.id" 
          @click="switchSubTab(sub.id)"
          class="px-4 py-2 text-sm font-semibold transition-colors relative group"
          :class="currentSubTab === sub.id 
            ? 'border-b-2 border-emerald-500 text-emerald-500' 
            : 'text-gray-600 hover:text-emerald-500'"
        >
          {{ sub.name }}
          <div 
            v-if="submitted[sub.id]" 
            class="absolute top-0 right-0 h-2 w-2 bg-emerald-500 rounded-full translate-x-1/2 -translate-y-1/2"
            title="Already submitted"
          ></div>
        </button>
      </div>

      <!-- Form (if not submitted) -->
      <div v-if="!submitted[currentSubTab]" class="space-y-6">
        <!-- Progress Indicator -->
        <div class="flex items-center justify-between text-sm font-medium text-gray-600">
          <div>{{ currentSlideIndex + 1 }} / 4</div>
          <div class="relative w-1/2 h-2 bg-gray-200 rounded-full">
            <div 
              class="absolute h-2 bg-emerald-500 rounded-full transition-all" 
              :style="{ width: ((currentSlideIndex + 1) / 4) * 100 + '%' }"
            ></div>
          </div>
        </div>

        <!-- Question Card -->
        <div class="border p-6 rounded bg-white shadow transition-all relative overflow-hidden">
          <h3 class="text-lg font-semibold mb-4">
            {{ currentSlide.question }}
          </h3>
          <p class="text-sm text-gray-500 mb-4">
            Please select one option that best fits your preference.
          </p>
          <div class="grid grid-cols-2 gap-4">
            <div 
              v-for="(choice, cIndex) in currentSlide.choices" 
              :key="cIndex"
              class="border rounded p-4 flex flex-col items-center transition hover:shadow-lg cursor-pointer relative hover:bg-gray-50 hover:border-emerald-300"
              :class="{
                'border-emerald-500 bg-emerald-50 scale-105': formData[currentSubTab][currentKey] === choice.value,
                'border-gray-200': formData[currentSubTab][currentKey] !== choice.value
              }"
              @click="selectChoice(currentKey, choice.value)"
            >
              <img :src="choice.image" alt="Choice Image" class="h-24 w-auto mb-2 object-cover rounded transition-transform group-hover:scale-105" />
              <p class="font-medium text-center text-sm text-gray-700">{{ choice.label }}</p>
              <div 
                v-if="formData[currentSubTab][currentKey] === choice.value" 
                class="absolute top-2 right-2 text-emerald-500"
              >
                <i class="fas fa-check-circle"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-end space-x-2">
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

      <!-- Preview (if submitted) -->
      <div v-else class="space-y-6">
        <div class="bg-emerald-50 border border-emerald-200 rounded p-6 shadow relative">
          <h3 class="text-xl font-semibold mb-2 text-emerald-700">Submission Preview ({{ currentSubTab }})</h3>
          <p class="text-gray-600 text-sm mb-4">
            Below are the options you selected. This form cannot be edited again without code changes.
          </p>

          <!-- Optional: Show submission time if desired -->
          <div v-if="submissionTime[currentSubTab]" class="text-sm text-gray-500 mb-4">
            Submitted on: {{ submissionTime[currentSubTab] }}
          </div>
          
          <div class="space-y-6">
            <transition-group name="fade" tag="div">
              <div 
                v-for="(slide, index) in questions[currentSubTab]" 
                :key="index" 
                class="bg-white border border-gray-200 p-4 rounded shadow-sm"
              >
                <h4 class="font-medium mb-2 text-gray-800">
                  {{ slide.question }}
                </h4>
                <div class="flex items-start space-x-4">
                  <div v-for="choice in slide.choices" :key="choice.value">
                    <div v-if="formData[currentSubTab][slide.keys[0]] === choice.value" class="flex items-center space-x-3">
                      <img :src="choice.image" alt="Chosen Image" class="h-16 w-auto object-cover rounded border border-gray-200"/>
                      <p class="text-sm font-medium text-gray-700">{{ choice.label }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </transition-group>
          </div>

          <div class="mt-6 flex space-x-3">
            <button 
              @click="printPreview"
              class="px-4 py-2 bg-white border border-gray-300 text-sm text-gray-700 rounded hover:bg-gray-100"
              title="Print your chosen preferences"
            >
              Print
            </button>
          </div>
        </div>

        <div class="flex justify-start">
          <p class="text-sm text-gray-500">
            To select different preferences, code changes are required.
          </p>
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

const dataLoaded = ref(false)
const submissionTime = reactive({
  ui: null,
  logo: null,
  banners: null
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
    // Record submission time if needed
    submissionTime[type] = new Date().toLocaleString()
  } else {
    alert('Error submitting form: ' + response.error)
  }
}

const loadSubmittedAnswers = async (type) => {
  const username = authStore.user?.username
  if (!username) return
  const response = await appsScriptService.getSubmittedAnswers(username, type)
  if (response.success && response.data) {
    Object.keys(response.data).forEach(key => {
      if (formData[type].hasOwnProperty(key)) {
        formData[type][key] = response.data[key]
      }
    })
    // Optionally set a fixed submission time on load if you stored it somewhere.
    // For now, just set it when we fetch answers:
    submissionTime[type] = new Date().toLocaleString()
  }
}

onMounted(async () => {
  const uiVal = String(props.userData.ui_submitted || '').toLowerCase()
  const logoVal = String(props.userData.logo_submitted || '').toLowerCase()
  const bannersVal = String(props.userData.banners_submitted || '').toLowerCase()

  submitted.ui = (uiVal === 'true')
  submitted.logo = (logoVal === 'true')
  submitted.banners = (bannersVal === 'true')

  for (const sub of subTabs) {
    if (submitted[sub.id]) {
      await loadSubmittedAnswers(sub.id)
    }
  }

  dataLoaded.value = true
})

const switchSubTab = (id) => {
  currentSubTab.value = id
  currentSlideIndex.value = 0
}

const printPreview = () => {
  window.print()
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.hover\:shadow-lg:hover {
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
</style>
