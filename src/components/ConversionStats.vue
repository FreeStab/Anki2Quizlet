<script setup>
import { computed } from 'vue'

const props = defineProps({
  stats: Object
})

const displayStats = computed(() => {
  if (!props.stats) return null
  
  return {
    filename: props.stats.filename || 'Unknown file',
    totalCards: props.stats.total || 0,
    conversionRate: props.stats.total > 0 ? '100%' : '0%'
  }
})
</script>

<template>
  <div v-if="displayStats" class="conversion-stats">
    <h2 class="stats-title">
      <span class="stats-icon">📊</span>
      Conversion Results
    </h2>
    
    <div class="stats-grid">
      <div class="stat-card success">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-label">Conversion Status</div>
          <div class="stat-value">Success</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📁</div>
        <div class="stat-content">
          <div class="stat-label">Source File</div>
          <div class="stat-value" :title="displayStats.filename">
            {{ truncateFilename(displayStats.filename) }}
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🎯</div>
        <div class="stat-content">
          <div class="stat-label">Cards Converted</div>
          <div class="stat-value">{{ displayStats.totalCards.toLocaleString() }}</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📈</div>
        <div class="stat-content">
          <div class="stat-label">Success Rate</div>
          <div class="stat-value">{{ displayStats.conversionRate }}</div>
        </div>
      </div>
    </div>
    
    <div class="stats-summary">
      <div class="summary-text">
        🎉 Successfully converted <strong>{{ displayStats.totalCards }}</strong> cards from 
        <strong>{{ displayStats.filename }}</strong> for Quizlet import.
      </div>
    </div>
  </div>
</template>

<style scoped>
.conversion-stats {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  margin: 2rem 0;
}

.stats-title {
  color: white;
  font-size: 1.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.stats-icon {
  font-size: 1.4rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-card.success {
  border-color: rgba(52, 168, 83, 0.3);
  background: rgba(52, 168, 83, 0.1);
}

.stat-icon {
  font-size: 2rem;
  line-height: 1;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
}

.stat-value {
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.2;
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stats-summary {
  background: rgba(52, 168, 83, 0.1);
  border: 1px solid rgba(52, 168, 83, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
}

.summary-text {
  color: rgba(255, 255, 255, 0.95);
  font-size: 1rem;
  line-height: 1.6;
  text-align: center;
}

.summary-text strong {
  color: white;
  font-weight: 700;
}

/* Responsive design */
@media (max-width: 768px) {
  .conversion-stats {
    padding: 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-icon {
    font-size: 1.5rem;
  }
  
  .stat-value {
    font-size: 1rem;
  }
  
  .stats-title {
    font-size: 1.4rem;
  }
  
  .summary-text {
    font-size: 0.9rem;
  }
}
</style>

<script>
export default {
  methods: {
    truncateFilename(filename) {
      if (!filename) return 'Unknown file'
      if (filename.length <= 25) return filename
      
      const extension = filename.split('.').pop()
      const name = filename.slice(0, filename.lastIndexOf('.'))
      
      if (name.length > 20) {
        return name.slice(0, 20) + '...' + (extension ? '.' + extension : '')
      }
      
      return filename
    }
  }
}
</script>
