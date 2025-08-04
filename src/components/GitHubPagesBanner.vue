<template>
  <div v-if="showBanner" class="github-pages-banner">
    <div class="banner-content">
      <div class="banner-icon">⚠️</div>
      <div class="banner-text">
        <h4>Running from GitHub Pages</h4>
        <p>
          To use this app, you need to run the backend server locally. 
          <a href="#" @click="showInstructions = !showInstructions" class="toggle-link">
            {{ showInstructions ? 'Hide' : 'Show' }} instructions
          </a>
        </p>
        <div v-if="showInstructions" class="instructions">
          <ol>
            <li>Clone the repository: <code>git clone https://github.com/your-username/Anki2Quizlet.git</code></li>
            <li>Navigate to the project: <code>cd Anki2Quizlet</code></li>
            <li>Install dependencies: <code>npm install</code></li>
            <li>Start the backend: <code>npm run server</code></li>
            <li>The backend will run on <code>http://localhost:3001</code></li>
          </ol>
          <p class="note">
            💡 <strong>Tip:</strong> Keep the backend running while using this web app.
          </p>
        </div>
      </div>
      <button @click="dismissBanner" class="banner-close">✕</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showBanner = ref(false)
const showInstructions = ref(false)

const isGitHubPages = () => {
  return window.location.hostname.includes('github.io')
}

const dismissBanner = () => {
  showBanner.value = false
  localStorage.setItem('gh-pages-banner-dismissed', 'true')
}

onMounted(() => {
  if (isGitHubPages()) {
    const dismissed = localStorage.getItem('gh-pages-banner-dismissed')
    showBanner.value = !dismissed
  }
})
</script>

<style scoped>
.github-pages-banner {
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  border: 1px solid #ffc107;
  border-radius: 8px;
  margin: 1rem;
  box-shadow: 0 2px 10px rgba(255, 193, 7, 0.2);
}

.banner-content {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  gap: 1rem;
}

.banner-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.2rem;
}

.banner-text {
  flex: 1;
}

.banner-text h4 {
  margin: 0 0 0.5rem 0;
  color: #856404;
  font-size: 1.1rem;
  font-weight: 600;
}

.banner-text p {
  margin: 0 0 0.5rem 0;
  color: #856404;
  line-height: 1.4;
}

.toggle-link {
  color: #0066cc;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
}

.toggle-link:hover {
  color: #004499;
}

.instructions {
  background: rgba(255, 255, 255, 0.7);
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
  border-left: 4px solid #ffc107;
}

.instructions ol {
  margin: 0 0 1rem 0;
  padding-left: 1.5rem;
}

.instructions li {
  margin-bottom: 0.5rem;
  color: #495057;
}

.instructions code {
  background: #f8f9fa;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9em;
  color: #e83e8c;
  border: 1px solid #dee2e6;
}

.note {
  background: #e7f3ff;
  padding: 0.8rem;
  border-radius: 5px;
  border-left: 4px solid #007bff;
  margin: 1rem 0 0 0;
  color: #004085;
}

.banner-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #856404;
  padding: 0.5rem;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background-color 0.2s;
}

.banner-close:hover {
  background: rgba(133, 100, 4, 0.1);
}
</style>
