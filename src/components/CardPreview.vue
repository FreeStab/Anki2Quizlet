<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { createApiUrl } from "../config/api.js"

const props = defineProps({
  cards: Array,
  filename: String
})

const currentPage = ref(1)
const cardsPerPage = 10
const isExporting = ref(false)
const searchTerm = ref('')

const filteredCards = computed(() => {
  if (!searchTerm.value) return props.cards
  
  const search = searchTerm.value.toLowerCase()
  return props.cards.filter(card => 
    card.term.toLowerCase().includes(search) ||
    card.definition.toLowerCase().includes(search) ||
    card.tags.toLowerCase().includes(search)
  )
})

const totalPages = computed(() => 
  Math.ceil(filteredCards.value.length / cardsPerPage)
)

const paginatedCards = computed(() => {
  const start = (currentPage.value - 1) * cardsPerPage
  const end = start + cardsPerPage
  return filteredCards.value.slice(start, end)
})

const displayStats = computed(() => ({
  total: filteredCards.value.length,
  showing: Math.min(cardsPerPage, filteredCards.value.length - (currentPage.value - 1) * cardsPerPage),
  start: (currentPage.value - 1) * cardsPerPage + 1,
  end: Math.min(currentPage.value * cardsPerPage, filteredCards.value.length)
}))

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

async function exportToDocx() {
  isExporting.value = true
  
  try {
    const response = await axios.post(createApiUrl('/api/export-docx'), {
      cards: filteredCards.value,
      filename: props.filename
    }, {
      responseType: 'blob'
    })
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    
    const exportFilename = props.filename ? 
      props.filename.replace('.apkg', '_quizlet.docx') : 
      'quizlet_export.docx'
    
    link.setAttribute('download', exportFilename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    
    window.URL.revokeObjectURL(url)
    
  } catch (error) {
    console.error('Export error:', error)
    alert('Failed to export Word document. Please try again.')
  } finally {
    isExporting.value = false
  }
}

function clearSearch() {
  searchTerm.value = ''
  currentPage.value = 1
}
</script>

<template>
  <div class="card-preview-container">
    <div class="preview-header">
      <h2>
        <span class="preview-icon">👀</span>
        Card Preview
      </h2>
      
      <div class="header-controls">
        <div class="search-box">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search cards..."
            class="search-input"
          />
          <button 
            v-if="searchTerm"
            @click="clearSearch"
            class="clear-search-btn"
          >
            ✕
          </button>
        </div>
        
        <button 
          @click="exportToDocx"
          :disabled="isExporting || filteredCards.length === 0"
          class="export-btn"
        >
          <span v-if="isExporting" class="export-spinner"></span>
          <span v-else class="export-icon">�</span>
          {{ isExporting ? 'Exporting...' : 'Export to Word' }}
        </button>
      </div>
    </div>

    <div class="stats-bar">
      <div class="stats-text">
        Showing {{ displayStats.start }}-{{ displayStats.end }} of {{ displayStats.total }} cards
        <span v-if="searchTerm" class="search-indicator">
          (filtered by: "{{ searchTerm }}")
        </span>
      </div>
    </div>

    <div class="cards-grid">
      <div
        v-for="card in paginatedCards"
        :key="card.id"
        class="card-item"
      >
        <div class="card-front">
          <div class="card-label">Term</div>
          <div class="card-content">{{ card.term }}</div>
        </div>
        
        <div class="card-arrow">➡️</div>
        
        <div class="card-back">
          <div class="card-label">Definition</div>
          <div class="card-content">{{ card.definition }}</div>
        </div>
        
        <div v-if="card.tags" class="card-tags">
          <span class="tags-label">Tags:</span>
          <span class="tags-content">{{ card.tags }}</span>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="filteredCards.length === 0 && searchTerm" class="empty-state">
      <div class="empty-icon">🔍</div>
      <h3>No cards found</h3>
      <p>Try adjusting your search terms</p>
      <button @click="clearSearch" class="clear-search-btn-large">
        Clear Search
      </button>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button 
        @click="prevPage"
        :disabled="currentPage === 1"
        class="pagination-btn"
      >
        ← Previous
      </button>
      
      <div class="pagination-numbers">
        <button
          v-for="page in Math.min(5, totalPages)"
          :key="page"
          @click="goToPage(page)"
          :class="['pagination-number', { active: currentPage === page }]"
        >
          {{ page }}
        </button>
        
        <span v-if="totalPages > 5" class="pagination-ellipsis">...</span>
        
        <button
          v-if="totalPages > 5 && currentPage < totalPages - 2"
          @click="goToPage(totalPages)"
          :class="['pagination-number', { active: currentPage === totalPages }]"
        >
          {{ totalPages }}
        </button>
      </div>
      
      <button 
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="pagination-btn"
      >
        Next →
      </button>
    </div>

    <div class="export-help">
      <h3>📋 How to import to Quizlet:</h3>
      <ol>
        <li>Click "Export to Word" to download your converted file (.docx format)</li>
        <li>Go to <a href="https://quizlet.com" target="_blank" rel="noopener">Quizlet.com</a> and log in</li>
        <li>Click "Create" → "Study set"</li>
        <li>Click "Import from Word, Excel, Google Docs, etc."</li>
        <li>Upload your downloaded Word document (.docx file)</li>
        <li>Quizlet will automatically detect the term-definition pairs</li>
        <li>Review and publish your study set</li>
      </ol>
      <div class="import-note">
        <strong>Note:</strong> The Word document contains your cards in multiple formats to ensure compatibility with Quizlet's import system.
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-preview-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  margin-top: 2rem;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.preview-header h2 {
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.preview-icon {
  font-size: 1.5rem;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.9rem;
  width: 200px;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-input:focus {
  outline: none;
  border-color: #4285f4;
  background: rgba(255, 255, 255, 0.15);
}

.clear-search-btn {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.clear-search-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.export-btn {
  background: linear-gradient(135deg, #34a853, #4285f4);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.export-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 168, 83, 0.3);
}

.export-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.export-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.export-icon {
  font-size: 1rem;
}

.stats-bar {
  background: rgba(255, 255, 255, 0.05);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.stats-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
}

.search-indicator {
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
}

.cards-grid {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

.card-item {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: auto auto;
  gap: 1rem;
  align-items: start;
}

.card-item:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.card-front, .card-back {
  min-height: 80px;
}

.card-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.card-content {
  color: white;
  font-size: 1rem;
  line-height: 1.5;
  word-wrap: break-word;
}

.card-arrow {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}

.card-tags {
  grid-column: 1 / -1;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.tags-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  font-weight: 600;
}

.tags-content {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(255, 255, 255, 0.8);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: white;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.clear-search-btn-large {
  background: linear-gradient(135deg, #4285f4, #34a853);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.clear-search-btn-large:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.pagination-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.pagination-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.pagination-number {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  min-width: 40px;
}

.pagination-number:hover {
  background: rgba(255, 255, 255, 0.2);
}

.pagination-number.active {
  background: linear-gradient(135deg, #4285f4, #34a853);
  border-color: transparent;
}

.pagination-ellipsis {
  color: rgba(255, 255, 255, 0.6);
  padding: 0 0.5rem;
}

.export-help {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
}

.export-help h3 {
  color: white;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.export-help ol {
  color: rgba(255, 255, 255, 0.9);
  padding-left: 1.5rem;
  line-height: 1.8;
}

.export-help li {
  margin-bottom: 0.5rem;
}

.export-help a {
  color: #4285f4;
  text-decoration: none;
  font-weight: 600;
}

.export-help a:hover {
  text-decoration: underline;
}

.import-note {
  background: rgba(66, 133, 244, 0.1);
  border: 1px solid rgba(66, 133, 244, 0.2);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
}

.import-note strong {
  color: white;
}

/* Responsive design */
@media (max-width: 768px) {
  .preview-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  .search-input {
    width: 100%;
  }
  
  .card-item {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto;
    text-align: center;
  }
  
  .card-arrow {
    transform: rotate(90deg);
    grid-row: 3;
  }
  
  .card-tags {
    grid-column: 1;
    grid-row: 4;
  }
  
  .pagination {
    flex-wrap: wrap;
  }
  
  .export-help ol {
    padding-left: 1rem;
  }
}
</style>
