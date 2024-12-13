<template>
  <div class="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Loading Spinner -->
    <div v-if="!designStore.dataLoaded" class="flex items-center justify-center h-96">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500"></div>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Tabs -->
      <div class="flex space-x-6 border-b border-gray-200 mb-8">
        <button
          v-for="sub in subTabs"
          :key="sub.id"
          @click="switchSubTab(sub.id)"
          class="relative px-4 py-2 text-sm font-medium focus:outline-none"
          :class="currentSubTab === sub.id
            ? 'text-emerald-600 border-b-2 border-emerald-600'
            : 'text-gray-600 hover:text-emerald-600'"
        >
          {{ sub.name }}
          <span
            v-if="designStore.submitted[sub.id]"
            class="absolute top-0 right-0 mt-1 mr-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full"
          >
            <i class="fas fa-check-circle"></i>
          </span>
        </button>
      </div>

      <transition name="fade" mode="out-in">
        <!-- Form Section -->
        <div v-if="!designStore.submitted[currentSubTab]" :key="'form-' + currentSubTab" class="space-y-8">
          <!-- Step Indicator -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-700">Step {{ currentSlideIndex + 1 }} of 4</span>
              <i class="fas fa-info-circle text-gray-400 hover:text-gray-500 cursor-pointer" title="Complete all steps to submit"></i>
            </div>
            <div class="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-2 bg-emerald-500 rounded-full transition-all duration-300"
                :style="{ width: ((currentSlideIndex + 1) / 4) * 100 + '%' }"
              ></div>
            </div>
          </div>

          <!-- Question Card -->
          <div class="relative bg-white shadow-md rounded-lg p-6 overflow-hidden">
            <div class="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none" :style="{ backgroundImage: `url('https://via.placeholder.com/400x400?text=Design')` }"></div>
            <div class="relative z-10">
              <h3 class="text-lg font-semibold mb-4 flex items-center space-x-2">
                <span>{{ currentSlide.question }}</span>
                <i class="fas fa-question-circle text-gray-400 hover:text-gray-500 cursor-pointer" title="Choose the option that best matches your preference"></i>
              </h3>
              <p class="text-sm text-gray-500 mb-6">Select one option. Hover over an option for more details.</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div
                  v-for="choice in currentSlide.choices"
                  :key="choice.value"
                  @click="selectChoice(currentKey, choice.value)"
                  class="flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg hover:border-emerald-500"
                  :class="designStore.formData[currentSubTab][currentKey] === choice.value ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white'"
                >
                  <img :src="choice.image" :alt="choice.label" class="h-24 w-auto mb-3 rounded object-cover" />
                  <p class="text-sm font-medium text-gray-700">{{ choice.label }}</p>
                  <div v-if="designStore.formData[currentSubTab][currentKey] === choice.value" class="mt-2 text-emerald-500">
                    <i class="fas fa-check-circle"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex justify-end space-x-4">
            <button
              v-if="currentSlideIndex > 0"
              @click="prevSlide"
              class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition"
            >
              Back
            </button>
            <button
              v-if="currentSlideIndex < 3"
              @click="nextSlide"
              :disabled="!designStore.formData[currentSubTab][currentKey]"
              class="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
            <button
              v-else
              @click="submitForm(currentSubTab)"
              :disabled="!designStore.formData[currentSubTab][currentKey]"
              class="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              Submit
            </button>
          </div>
        </div>

        <!-- Preview Section -->
        <div v-else :key="'preview-' + currentSubTab" class="space-y-8">
          <div class="relative bg-gradient-to-r from-emerald-50 to-white shadow-md rounded-lg p-6 overflow-hidden">
            <div class="absolute inset-0 bg-cover bg-center opacity-5 pointer-events-none" :style="{ backgroundImage: `url('https://via.placeholder.com/500x500?text=Preview')` }"></div>
            <div class="relative z-10">
              <h3 class="text-xl font-semibold mb-4 flex items-center space-x-2">
                <span>Submission Preview ({{ currentSubTab.toUpperCase() }})</span>
                <i class="fas fa-eye text-emerald-500" title="Read-only preview"></i>
              </h3>
              <p class="text-gray-600 text-sm mb-6">Below are the options you selected. This form cannot be edited again without code changes.</p>

              <div v-if="designStore.submissionTime[currentSubTab]" class="text-sm text-gray-500 mb-4">
                Submitted on: {{ designStore.submissionTime[currentSubTab] }}
              </div>

              <div class="space-y-6">
                <div
                  v-for="slide in questions[currentSubTab]"
                  :key="slide.question"
                  class="bg-white border border-gray-200 p-4 rounded-lg shadow-sm transition hover:shadow-md"
                >
                  <h4 class="font-medium mb-2 text-gray-800 flex items-center space-x-2">
                    <span>{{ slide.question }}</span>
                    <i class="fas fa-info-circle text-gray-400 hover:text-gray-500 cursor-pointer" title="Your chosen option is displayed below"></i>
                  </h4>
                  <div class="flex items-center space-x-4">
                    <img
                      v-if="designStore.formData[currentSubTab][slide.keys[0]]"
                      :src="getChoiceImage(currentSubTab, slide.keys[0])"
                      :alt="getChoiceLabel(currentSubTab, slide.keys[0])"
                      class="h-16 w-auto rounded border border-gray-200"
                    />
                    <p class="text-sm text-gray-700">{{ getChoiceLabel(currentSubTab, slide.keys[0]) || 'Not answered' }}</p>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="mt-6 flex space-x-4">
                <button
                  @click="printPreview"
                  class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition"
                  title="Print your chosen preferences"
                >
                  Print
                </button>
                <button
                  @click="copyAnswers"
                  class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition"
                  title="Copy your answers to clipboard"
                >
                  Copy Answers
                </button>
              </div>
            </div>
          </div>

          <div class="flex justify-start">
            <p class="text-sm text-gray-500 italic">
              To select different preferences, code changes are required.
            </p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDesignStore } from '@/stores/designStore'
import { appsScriptService } from '@/services/appsScriptService'

const authStore = useAuthStore()
const designStore = useDesignStore()

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

function printPreview() {
  window.print()
}

function copyAnswers() {
  const type = currentSubTab.value
  const answers = designStore.formData[type]
  const lines = []
  for (const slide of questions[type]) {
    const answerKey = slide.keys[0]
    const chosenValue = answers[answerKey]
    const chosenChoice = slide.choices.find(c => c.value === chosenValue)
    if (chosenChoice) {
      lines.push(`${slide.question}: ${chosenChoice.label}`)
    } else {
      lines.push(`${slide.question}: Not answered`)
    }
  }
  const text = lines.join('\n')
  navigator.clipboard.writeText(text).then(() => {
    alert('Answers copied to clipboard!')
  }, () => {
    alert('Failed to copy answers.')
  })
}

function getChoiceImage(type, key) {
  const slide = questions[type].find(s => s.keys.includes(key))
  if (slide) {
    const choice = slide.choices.find(c => c.value === designStore.formData[type][key])
    return choice ? choice.image : ''
  }
  return ''
}

function getChoiceLabel(type, key) {
  const slide = questions[type].find(s => s.keys.includes(key))
  if (slide) {
    const choice = slide.choices.find(c => c.value === designStore.formData[type][key])
    return choice ? choice.label : ''
  }
  return ''
}

onMounted(async () => {
  if (!designStore.isInitialized) {
    const uiVal = String(props.userData.ui_submitted || '').toLowerCase()
    const logoVal = String(props.userData.logo_submitted || '').toLowerCase()
    const bannersVal = String(props.userData.banners_submitted || '').toLowerCase()

    designStore.submitted.ui = (uiVal === 'true')
    designStore.submitted.logo = (logoVal === 'true')
    designStore.submitted.banners = (bannersVal === 'true')

    for (const sub of subTabs) {
      if (designStore.submitted[sub.id]) {
        await loadSubmittedAnswers(sub.id)
      }
    }

    designStore.markDataLoaded()
    designStore.markInitialized()
  } else {
    if (!designStore.dataLoaded) {
      designStore.markDataLoaded()
    }
  }
})

async function loadSubmittedAnswers(type) {
  const username = authStore.user?.username
  if (!username) return
  const response = await appsScriptService.getSubmittedAnswers(username, type)
  if (response.success && response.data) {
    Object.keys(response.data).forEach(key => {
      if (designStore.formData[type].hasOwnProperty(key)) {
        designStore.setFormData(type, key, response.data[key])
      }
    })
    designStore.setSubmissionTime(type, new Date().toLocaleString())
  }
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
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

button:disabled {
  cursor: not-allowed;
}
</style>
