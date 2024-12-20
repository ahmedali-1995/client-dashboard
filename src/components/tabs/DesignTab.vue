<template>
  <div class="max-w-3xl mx-auto py-6 space-y-8 relative">
    <div v-if="!designStore.dataLoaded" class="flex items-center justify-center h-full py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
    <div v-else>
      <div class="flex space-x-4 border-b pb-3 mb-8 relative">
        <div v-for="sub in subTabs" :key="sub.id" class="relative group">
          <button 
            @click="switchSubTab(sub.id)"
            class="px-4 py-2 text-sm font-semibold transition-colors relative z-10"
            :class="currentSubTab === sub.id 
              ? 'border-b-2 border-emerald-500 text-emerald-500' 
              : 'text-gray-600 hover:text-emerald-500'"
          >
            {{ sub.name }}
          </button>
        </div>
      </div>

      <transition name="fade">
        <!-- If not submitted: FORM -->
        <div v-if="!designStore.submitted[currentSubTab]" key="form" class="space-y-8">
          <!-- Step Indicator -->
          <div class="flex items-center justify-between text-sm font-medium text-gray-600">
            <div class="flex items-center space-x-2">
              <span>Step {{ currentSlideIndex + 1 }} of 4</span>
              <i class="fas fa-info-circle text-gray-400 hover:text-gray-500 cursor-pointer" title="Complete all steps to submit"></i>
            </div>
            <div class="relative w-1/2 h-2 bg-gray-200 rounded-full">
              <div 
                class="absolute h-2 bg-emerald-500 rounded-full transition-all" 
                :style="{ width: ((currentSlideIndex + 1) / 4) * 100 + '%' }"
              ></div>
            </div>
          </div>

          <!-- Question Card -->
          <div class="border p-6 rounded bg-white shadow transition-all relative overflow-hidden">
            <div class="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://via.placeholder.com/200x200?text=UI')] bg-no-repeat bg-center"></div>
            <h3 class="text-lg font-semibold mb-4 flex items-center space-x-2">
              <span>{{ currentSlide.question }}</span>
              <i class="fas fa-question-circle text-gray-400 hover:text-gray-500 cursor-pointer" title="Choose the option that best matches your preference"></i>
            </h3>
            <p class="text-sm text-gray-500 mb-4">
              Select one option. Hover over an option for a closer look.
            </p>
            <div class="grid grid-cols-2 gap-4">
              <div 
                v-for="choice in currentSlide.choices" 
                :key="choice.value"
                class="border rounded p-4 flex flex-col items-center transition hover:shadow-lg cursor-pointer relative hover:bg-gray-50 hover:border-emerald-300 group"
                :class="{
                  'border-emerald-500 bg-emerald-50 scale-105 shadow-xl': designStore.formData[currentSubTab][currentKey] === choice.value,
                  'border-gray-200': designStore.formData[currentSubTab][currentKey] !== choice.value
                }"
                @click="selectChoice(currentKey, choice.value)"
              >
                <img :src="choice.image" alt="Choice Image" class="h-24 w-auto mb-2 object-cover rounded transition-transform group-hover:scale-105" />
                <p class="font-medium text-center text-sm text-gray-700">{{ choice.label }}</p>
                <div 
                  v-if="designStore.formData[currentSubTab][currentKey] === choice.value" 
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
              class="px-4 py-2 text-sm border rounded hover:bg-gray-100 text-gray-700 transition"
            >
              Back
            </button>
            <button
              v-if="currentSlideIndex < 3"
              @click="nextSlide"
              :disabled="!designStore.formData[currentSubTab][currentKey]"
              class="px-4 py-2 text-sm rounded bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
            <button
              v-else
              @click="submitForm(currentSubTab)"
              :disabled="!designStore.formData[currentSubTab][currentKey]"
              class="px-4 py-2 text-sm rounded bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              Submit
            </button>
          </div>
        </div>

        <!-- If submitted: PREVIEW -->
        <div v-else key="preview" class="space-y-8">
          <div class="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded p-6 shadow relative overflow-hidden">
            <div class="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://via.placeholder.com/300x300?text=Preview')] bg-no-repeat bg-center"></div>
            <h3 class="text-xl font-semibold mb-2 text-emerald-700 flex items-center space-x-2">
              <span>Submission Preview ({{ currentSubTab }})</span>
              <i class="fas fa-eye text-emerald-500" title="Read-only preview"></i>
            </h3>
            <p class="text-gray-600 text-sm mb-4">
              Below are the options you selected. This form cannot be edited again without code changes.
            </p>

            <div v-if="designStore.submissionTime[currentSubTab]" class="text-sm text-gray-500 mb-4">
              Submitted on: {{ designStore.submissionTime[currentSubTab] }}
            </div>
            
            <transition-group name="fade" tag="div" class="space-y-6">
              <div 
                v-for="slide in questions[currentSubTab]" 
                :key="slide.question"
                class="bg-white border border-gray-200 p-4 rounded shadow-sm transition hover:shadow-md"
              >
                <h4 class="font-medium mb-2 text-gray-800 flex items-center space-x-2">
                  <span>{{ slide.question }}</span>
                  <i class="fas fa-info-circle text-gray-400" title="Your chosen option is displayed below"></i>
                </h4>
                <div class="flex items-start space-x-4">
                  <div v-for="choice in slide.choices" :key="choice.value">
                    <div v-if="designStore.formData[currentSubTab][slide.keys[0]] === choice.value" class="flex items-center space-x-3">
                      <img :src="choice.image" alt="Chosen Image" class="h-16 w-auto object-cover rounded border border-gray-200"/>
                      <p class="text-sm font-medium text-gray-700">{{ choice.label }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </transition-group>

            <div class="mt-6 flex space-x-3">
              <button 
                @click="printPreview"
                class="px-4 py-2 bg-white border border-gray-300 text-sm text-gray-700 rounded hover:bg-gray-100 transition"
                title="Print your chosen preferences"
              >
                Print
              </button>
              <button
                @click="copyAnswers"
                class="px-4 py-2 bg-white border border-gray-300 text-sm text-gray-700 rounded hover:bg-gray-100 transition"
                title="Copy your answers to clipboard"
              >
                Copy Answers
              </button>
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
import { ref, reactive, computed, onMounted } from 'vue'  // <- Make sure onMounted is included
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

onMounted(async () => {
  // Check if not initialized
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
    // Data was already loaded before, no need to re-fetch
    // Just mark dataLoaded to true if it isn't already
    if (!designStore.dataLoaded) {
      designStore.markDataLoaded()
    }
  }
})

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
