<script setup>
import { ref } from "vue";
import { useDropZone } from "@vueuse/core";
import axios from "axios";
import { createApiUrl } from "../config/api.js";

const emit = defineEmits(["file-processed", "processing-state"]);

const props = defineProps({
  isProcessing: Boolean,
});

const dropZoneRef = ref();
const selectedFile = ref(null);
const dragOver = ref(false);
const error = ref("");
const uploadProgress = ref(0);

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop: handleDrop,
  onEnter: () => {
    dragOver.value = true;
  },
  onLeave: () => {
    dragOver.value = false;
  },
});

function handleDrop(files) {
  dragOver.value = false;
  if (files && files.length > 0) {
    handleFileSelect(files[0]);
  }
}

function handleFileInput(event) {
  const file = event.target.files[0];
  if (file) {
    handleFileSelect(file);
  }
}

function handleFileSelect(file) {
  error.value = "";

  // Validate file type
  if (!file.name.toLowerCase().endsWith(".apkg")) {
    error.value = "Please select a valid .apkg file";
    return;
  }

  // Validate file size (100MB limit)
  const maxSize = 100 * 1024 * 1024;
  if (file.size > maxSize) {
    error.value = "File size must be less than 100MB";
    return;
  }

  selectedFile.value = file;
  processFile(file);
}

async function processFile(file) {
  if (!file) return;

  emit("processing-state", true);
  error.value = "";
  uploadProgress.value = 0;

  try {
    const formData = new FormData();
    formData.append("apkgFile", file);

    const response = await axios.post(createApiUrl("/api/upload"), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        uploadProgress.value = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
      },
    });

    if (response.data.success) {
      emit("file-processed", response.data);
    } else {
      throw new Error(response.data.error || "Processing failed");
    }
  } catch (err) {
    console.error("File processing error:", err);
    error.value = err.response?.data?.error || err.message || "Failed to process file";
  } finally {
    emit("processing-state", false);
    uploadProgress.value = 0;
  }
}

function clearFile() {
  selectedFile.value = null;
  error.value = "";
  uploadProgress.value = 0;
}
</script>

<template>
  <div class="file-upload-container">
    <div
      ref="dropZoneRef"
      class="drop-zone"
      :class="{
        'drag-over': isOverDropZone || dragOver,
        processing: props.isProcessing,
        'has-file': selectedFile,
      }"
    >
      <div class="drop-zone-content">
        <!-- Upload icon and text -->
        <div v-if="!selectedFile && !props.isProcessing" class="upload-prompt">
          <div class="upload-icon">📁</div>
          <h3>Drop your .apkg file here</h3>
          <p>or click to browse files</p>
          <div class="file-info">
            <small>Supports Anki package files (.apkg) up to 100MB</small>
          </div>
        </div>

        <!-- Processing state -->
        <div v-if="props.isProcessing" class="processing-state">
          <div class="spinner"></div>
          <h3>Processing your Anki deck...</h3>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
          </div>
          <p>{{ uploadProgress }}% uploaded</p>
        </div>

        <!-- File selected -->
        <div v-if="selectedFile && !props.isProcessing" class="file-selected">
          <div class="file-icon">✅</div>
          <h3>{{ selectedFile.name }}</h3>
          <p>{{ formatFileSize(selectedFile.size) }}</p>
          <button @click="clearFile" class="clear-btn">Choose Different File</button>
        </div>
      </div>

      <!-- Hidden file input -->
      <input
        type="file"
        ref="fileInput"
        @change="handleFileInput"
        accept=".apkg"
        style="display: none"
      />
    </div>

    <!-- Browse button -->
    <button
      v-if="!selectedFile && !props.isProcessing"
      @click="$refs.fileInput.click()"
      class="browse-btn"
    >
      Browse Files
    </button>

    <!-- Error message -->
    <div v-if="error" class="error-message">
      <span class="error-icon">⚠️</span>
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.file-upload-container {
  margin-bottom: 2rem;
}

.drop-zone {
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drop-zone:hover {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.1);
}

.drop-zone.drag-over {
  border-color: #4285f4;
  background: rgba(66, 133, 244, 0.1);
  transform: scale(1.02);
}

.drop-zone.processing {
  border-color: #34a853;
  background: rgba(52, 168, 83, 0.1);
  cursor: not-allowed;
}

.drop-zone.has-file {
  border-color: #34a853;
  background: rgba(52, 168, 83, 0.1);
}

.drop-zone-content {
  width: 100%;
}

.upload-prompt h3 {
  color: white;
  margin: 1rem 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.upload-prompt p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
}

.upload-icon,
.file-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.file-info {
  margin-top: 1rem;
}

.file-info small {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.processing-state h3 {
  color: white;
  margin: 1rem 0;
  font-size: 1.5rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin: 1rem 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4285f4, #34a853);
  transition: width 0.3s ease;
}

.file-selected h3 {
  color: white;
  margin: 1rem 0 0.5rem 0;
  font-size: 1.3rem;
  word-break: break-all;
}

.file-selected p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
}

.browse-btn,
.clear-btn {
  background: linear-gradient(135deg, #4285f4, #34a853);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.browse-btn:hover,
.clear-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
}

.browse-btn:active,
.clear-btn:active {
  transform: translateY(0);
}

.clear-btn {
  background: linear-gradient(135deg, #ea4335, #fbbc04);
  font-size: 0.9rem;
  padding: 0.5rem 1.5rem;
}

.error-message {
  background: rgba(234, 67, 53, 0.1);
  border: 1px solid rgba(234, 67, 53, 0.3);
  color: #ff6b6b;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.error-icon {
  font-size: 1.2rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .drop-zone {
    padding: 2rem 1rem;
    min-height: 150px;
  }

  .upload-prompt h3 {
    font-size: 1.3rem;
  }

  .upload-icon,
  .file-icon {
    font-size: 2.5rem;
  }
}
</style>

<script>
export default {
  methods: {
    formatFileSize(bytes) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    },
  },
};
</script>
