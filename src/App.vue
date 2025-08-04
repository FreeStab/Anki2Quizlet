<script setup>
import { ref, onMounted } from 'vue'
import FileUpload from './components/FileUpload.vue'
import CardPreview from './components/CardPreview.vue'
import ConversionStats from './components/ConversionStats.vue'
import GitHubPagesBanner from './components/GitHubPagesBanner.vue'

const cards = ref([])
const isProcessing = ref(false)
const conversionStats = ref(null)

const handleFileProcessed = (processedCards) => {
  cards.value = processedCards.cards || []
  conversionStats.value = {
    total: processedCards.count || 0,
    filename: processedCards.filename || 'Unknown'
  }
}

const handleProcessingStateChange = (processing) => {
  isProcessing.value = processing
}

onMounted(() => {
  // Register PWA update handling
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload()
    })
  }
})
</script>

<template>
  <div id="app">
    <GitHubPagesBanner />
    
    <header class="app-header">
      <h1>
        <span class="logo-icon">🔄</span>
        Anki to Quizlet Converter
      </h1>
      <p class="subtitle">Convert your Anki decks to Quizlet-compatible Word documents</p>
    </header>

    <main class="app-main">
      <FileUpload 
        @file-processed="handleFileProcessed"
        @processing-state="handleProcessingStateChange"
        :is-processing="isProcessing"
      />

      <ConversionStats 
        v-if="conversionStats" 
        :stats="conversionStats"
      />

      <CardPreview 
        v-if="cards.length > 0" 
        :cards="cards"
        :filename="conversionStats?.filename"
      />
    </main>

    <footer class="app-footer">
      <p>
        Made with ❤️ for language learners • 
        <a href="https://github.com" target="_blank" rel="noopener">
          View on GitHub
        </a>
      </p>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
              'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  text-align: center;
  padding: 2rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.app-header h1 {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.logo-icon {
  font-size: 2rem;
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-weight: 300;
}

.app-main {
  flex: 1;
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  text-align: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.1);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.app-footer a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
}

.app-footer a:hover {
  text-decoration: underline;
}

/* Responsive design */
@media (max-width: 768px) {
  .app-header h1 {
    font-size: 2rem;
  }
  
  .app-main {
    padding: 1rem 0.5rem;
  }
}
</style>
