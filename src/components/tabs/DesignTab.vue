<!-- DesignTab.vue -->
<template>
  <div>
    <!-- Horizontal Sub-Tab Navigation -->
    <div class="flex space-x-4 border-b mb-4">
      <button 
        v-for="sub in subTabs" 
        :key="sub.id" 
        @click="currentSubTab = sub.id"
        :class="[
          'px-4 py-2',
          currentSubTab === sub.id 
            ? 'border-b-2 border-emerald-500 text-emerald-500' 
            : 'text-gray-600 hover:text-emerald-500'
        ]"
      >
        {{ sub.name }}
      </button>
    </div>

    <!-- If not submitted, show the form with 4 slides -->
    <div v-if="!submitted[currentSubTab]" class="space-y-8">
      <div 
        v-for="(slide, index) in questions[currentSubTab]" 
        :key="index" 
        class="border p-4 rounded bg-gray-50"
      >
        <h3 class="font-semibold mb-4">{{ slide.question }}</h3>
        <div class="grid grid-cols-2 gap-4">
          <div 
            v-for="(choice, cIndex) in slide.choices" 
            :key="cIndex"
            class="border rounded p-2 flex flex-col items-center hover:shadow-lg transition cursor-pointer"
            :class="{
              'border-emerald-500': formData[currentSubTab][slide.keys[index]] === choice.value
            }"
            @click="selectChoice(slide.keys[index], choice.value)"
          >
            <img :src="choice.image" alt="Choice Image" class="h-24 w-auto mb-2 object-cover"/>
            <p class="font-medium">{{ choice.label }}</p>
          </div>
        </div>
      </div>
      
      <button 
        @click="submitForm(currentSubTab)"
        class="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
      >
        Submit
      </button>
    </div>

    <!-- If submitted, show the preview -->
    <div v-else class="space-y-4">
      <h3 class="text-xl font-semibold">Submission Preview ({{ currentSubTab }})</h3>
      <div 
        v-for="(slide, index) in questions[currentSubTab]" 
        :key="index" 
        class="border p-4 rounded bg-white"
      >
        <h4 class="font-medium mb-2">{{ slide.question }}</h4>
        <div class="flex items-center space-x-4">
          <div v-for="choice in slide.choices" :key="choice.value">
            <div v-if="formData[currentSubTab][slide.keys[index]] === choice.value">
              <img :src="choice.image" alt="Chosen Image" class="h-24 w-auto object-cover mb-2"/>
              <p>{{ choice.label }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { appsScriptService } from '@/services/appsScriptService'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const subTabs = [
  { id: 'ui', name: 'UI' },
  { id: 'logo', name: 'Logo' },
  { id: 'banners', name: 'Banners' }
]

const currentSubTab = ref('ui')

/* Each sub-tab has 4 slides (questions).
   Each slide has a question and 4 image choices.
   keys array to map each slide's answer to a property in formData.
*/
const questions = {
  ui: [
    {
      question: 'What UI style do you prefer?',
      keys: ['ui_slide1', 'ui_slide2', 'ui_slide3', 'ui_slide4'],
      // For simplicity, each "slide" here is actually one question with multiple choices.
      // We will treat each array element as one slide, so we need 4 slides total.
    },
    {
      question: 'Choose your primary color scheme:',
      keys: ['ui_slide1', 'ui_slide2', 'ui_slide3', 'ui_slide4']
    },
    {
      question: 'Select your preferred layout style:',
      keys: ['ui_slide1', 'ui_slide2', 'ui_slide3', 'ui_slide4']
    },
    {
      question: 'Select your preferred font style:',
      keys: ['ui_slide1', 'ui_slide2', 'ui_slide3', 'ui_slide4']
    }
  ],
  logo: [
    {
      question: 'Select the logo style you like most:',
      keys: ['logo_slide1', 'logo_slide2', 'logo_slide3', 'logo_slide4']
    },
    {
      question: 'Choose a color combination for your logo:',
      keys: ['logo_slide1', 'logo_slide2', 'logo_slide3', 'logo_slide4']
    },
    {
      question: 'Pick a shape that resonates with your brand:',
      keys: ['logo_slide1', 'logo_slide2', 'logo_slide3', 'logo_slide4']
    },
    {
      question: 'Select a font style for your logo text:',
      keys: ['logo_slide1', 'logo_slide2', 'logo_slide3', 'logo_slide4']
    }
  ],
  banners: [
    {
      question: 'Choose a banner layout style:',
      keys: ['banners_slide1', 'banners_slide2', 'banners_slide3', 'banners_slide4']
    },
    {
      question: 'Pick the primary banner image concept:',
      keys: ['banners_slide1', 'banners_slide2', 'banners_slide3', 'banners_slide4']
    },
    {
      question: 'Select a banner color palette:',
      keys: ['banners_slide1', 'banners_slide2', 'banners_slide3', 'banners_slide4']
    },
    {
      question: 'Choose a call-to-action style for the banner:',
      keys: ['banners_slide1', 'banners_slide2', 'banners_slide3', 'banners_slide4']
    }
  ]
}

// Add choices to each slide
const choiceImages = [
  { label: 'Choice 1', value: 'choice1', image: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Choice+1' },
  { label: 'Choice 2', value: 'choice2', image: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Choice+2' },
  { label: 'Choice 3', value: 'choice3', image: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Choice+3' },
  { label: 'Choice 4', value: 'choice4', image: 'https://via.placeholder.com/150/FFFF00/000000?text=Choice+4' }
]

questions.ui[0].choices = choiceImages
questions.ui[1].choices = choiceImages
questions.ui[2].choices = choiceImages
questions.ui[3].choices = choiceImages

questions.logo[0].choices = choiceImages
questions.logo[1].choices = choiceImages
questions.logo[2].choices = choiceImages
questions.logo[3].choices = choiceImages

questions.banners[0].choices = choiceImages
questions.banners[1].choices = choiceImages
questions.banners[2].choices = choiceImages
questions.banners[3].choices = choiceImages

// Initialize formData with empty strings
const formData = reactive({
  ui: {
    ui_slide1: '',
    ui_slide2: '',
    ui_slide3: '',
    ui_slide4: ''
  },
  logo: {
    logo_slide1: '',
    logo_slide2: '',
    logo_slide3: '',
    logo_slide4: ''
  },
  banners: {
    banners_slide1: '',
    banners_slide2: '',
    banners_slide3: '',
    banners_slide4: ''
  }
})

const submitted = reactive({
  ui: false,
  logo: false,
  banners: false
})

const selectChoice = (key, value) => {
  formData[currentSubTab.value][key] = value
}

// Modify the questions array keys to correctly map each slide's key
// For each subTab, we have 4 slides, each should have unique keys.
// We'll just override the keys array now that we know the structure:
questions.ui[0].keys = ['ui_slide1']
questions.ui[1].keys = ['ui_slide2']
questions.ui[2].keys = ['ui_slide3']
questions.ui[3].keys = ['ui_slide4']

questions.logo[0].keys = ['logo_slide1']
questions.logo[1].keys = ['logo_slide2']
questions.logo[2].keys = ['logo_slide3']
questions.logo[3].keys = ['logo_slide4']

questions.banners[0].keys = ['banners_slide1']
questions.banners[1].keys = ['banners_slide2']
questions.banners[2].keys = ['banners_slide3']
questions.banners[3].keys = ['banners_slide4']

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
</script>

<style scoped>
.hover\:shadow-lg:hover {
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
</style>
