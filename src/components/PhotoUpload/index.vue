<template>
  <div class="photo-upload-container">
    <!-- Upload Area -->
    <div 
      class="upload-area"
      :class="{ 'drag-over': isDragOver, 'error': error }"
      @click="openFileDialog"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        @change="handleFileSelect"
        class="hidden"
      />
      
      <div class="upload-content" v-if="!isLoading">
        <div class="upload-icon">
          <i class="i-mdi-camera-plus text-4xl text-gray-400"></i>
        </div>
        <h3 class="upload-title">Upload Foto</h3>
        <p class="upload-description">
          Drag & drop foto di sini atau klik untuk memilih
        </p>
        <div class="upload-buttons">
          <UButton
            type="button"
            variant="outline"
            size="sm"
            @click.stop="openCamera"
          >
            📷 Ambil Foto
          </UButton>
          <UButton
            type="button"
            variant="outline"
            size="sm"
            @click.stop="openGallery"
          >
            🖼️ Pilih dari Galeri
          </UButton>
        </div>
      </div>

      <!-- Loading State -->
      <div class="upload-content" v-else>
        <div class="loading-spinner">
          <i class="i-mdi-loading animate-spin text-2xl text-blue-500"></i>
        </div>
        <p class="text-gray-600">Mengupload foto...</p>
      </div>
    </div>

    <!-- Photo Preview Grid -->
    <div v-if="photos.length > 0" class="photo-grid mt-4">
      <div
        v-for="(photo, index) in photos"
        :key="photo.id"
        class="photo-item"
      >
        <div class="photo-wrapper">
          <img
            :src="photo.preview"
            :alt="`Foto ${index + 1}`"
            class="photo-image"
            @click="viewPhoto(photo, index)"
          />
          
          <!-- Photo Actions -->
          <div class="photo-actions">
            <UButton
              type="button"
              size="sm"
              variant="outline"
              @click="viewPhoto(photo, index)"
              class="action-btn"
            >
              👁️
            </UButton>
            <UButton
              type="button"
              size="sm"
              variant="outline"
              @click="removePhoto(index)"
              class="action-btn"
            >
              🗑️
            </UButton>
          </div>

          <!-- Upload Progress -->
          <div v-if="photo.uploading" class="upload-progress">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: photo.progress + '%' }"
              ></div>
            </div>
            <span class="progress-text">{{ photo.progress }}%</span>
          </div>
        </div>

        <!-- Photo Info -->
        <div class="photo-info">
          <p class="photo-name">{{ photo.name }}</p>
          <p class="photo-size">{{ formatFileSize(photo.size) }}</p>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-message mt-2">
      <i class="i-mdi-alert-circle text-red-500 mr-1"></i>
      {{ error }}
    </div>

    <!-- Help Text -->
    <div class="help-text mt-2">
      <p class="text-sm text-gray-500">
        <i class="i-mdi-information mr-1"></i>
        Format yang didukung: JPG, PNG, GIF. Maksimal {{ maxFileSize }}MB per foto.
        Maksimal {{ maxFiles }} foto.
      </p>
    </div>

    <!-- Photo Viewer Modal -->
    <div v-if="showViewer" class="photo-viewer-overlay" @click="closeViewer">
      <div class="photo-viewer-content" @click.stop>
        <UButton
          type="button"
          variant="outline"
          @click="closeViewer"
          class="close-btn"
        >
          ✕
        </UButton>
        
        <div class="viewer-controls">
          <UButton
            type="button"
            variant="outline"
            @click="previousPhoto"
            :disabled="currentPhotoIndex === 0"
          >
            ⬅️
          </UButton>
          <span class="photo-counter">
            {{ currentPhotoIndex + 1 }} / {{ photos.length }}
          </span>
          <UButton
            type="button"
            variant="outline"
            @click="nextPhoto"
            :disabled="currentPhotoIndex === photos.length - 1"
          >
            ➡️
          </UButton>
        </div>

        <img
          :src="currentPhoto?.preview"
          :alt="currentPhoto?.name"
          class="viewer-image"
        />

        <div class="viewer-info">
          <h3 class="viewer-title">{{ currentPhoto?.name }}</h3>
          <p class="viewer-details">
            {{ formatFileSize(currentPhoto?.size) }} • 
            {{ currentPhoto?.dimensions }}
          </p>
        </div>
      </div>
    </div>

    <!-- Camera Modal -->
    <div v-if="showCamera" class="camera-overlay" @click="closeCamera">
      <div class="camera-content" @click.stop>
        <div class="camera-header">
          <h3 class="camera-title">Ambil Foto</h3>
          <UButton
            type="button"
            variant="outline"
            @click="closeCamera"
            class="close-btn"
          >
            ✕
          </UButton>
        </div>

        <div class="camera-container">
          <video
            ref="videoElement"
            class="camera-video"
            autoplay
            muted
            playsinline
          ></video>
          <canvas ref="canvasElement" class="hidden"></canvas>
        </div>

        <div class="camera-controls">
          <UButton
            type="button"
            variant="outline"
            @click="switchCamera"
            :disabled="!hasMultipleCameras"
          >
            🔄 Switch
          </UButton>
          <UButton
            type="button"
            @click="capturePhoto"
            class="capture-btn"
          >
            📷 Capture
          </UButton>
          <UButton
            type="button"
            variant="outline"
            @click="retakePhoto"
          >
            🔄 Retake
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { UButton } from '@/components'

// Props
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  maxFiles: {
    type: Number,
    default: 5
  },
  maxFileSize: {
    type: Number,
    default: 5 // MB
  },
  accept: {
    type: String,
    default: 'image/*'
  },
  folder: {
    type: String,
    default: 'photos'
  },
  error: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'upload-complete', 'upload-error'])

// Reactive data
const photos = ref([...props.modelValue])
const isLoading = ref(false)
const isDragOver = ref(false)
const showViewer = ref(false)
const showCamera = ref(false)
const currentPhotoIndex = ref(0)
const fileInput = ref(null)
const videoElement = ref(null)
const canvasElement = ref(null)
const stream = ref(null)
const hasMultipleCameras = ref(false)
const currentCameraIndex = ref(0)
const cameras = ref([])

// Computed
const currentPhoto = computed(() => {
  return photos.value[currentPhotoIndex.value]
})

const error = computed(() => {
  return props.error
})

// Methods
const openFileDialog = () => {
  fileInput.value?.click()
}

const openGallery = () => {
  openFileDialog()
}

const openCamera = async () => {
  try {
    showCamera.value = true
    await initializeCamera()
  } catch (error) {
    console.error('Error opening camera:', error)
    showCamera.value = false
  }
}

const initializeCamera = async () => {
  try {
    // Get available cameras
    const devices = await navigator.mediaDevices.enumerateDevices()
    cameras.value = devices.filter(device => device.kind === 'videoinput')
    hasMultipleCameras.value = cameras.value.length > 1

    // Get user media
    const constraints = {
      video: {
        deviceId: cameras.value[currentCameraIndex.value]?.deviceId,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    }

    stream.value = await navigator.mediaDevices.getUserMedia(constraints)
    
    if (videoElement.value) {
      videoElement.value.srcObject = stream.value
    }
  } catch (error) {
    console.error('Error accessing camera:', error)
    throw error
  }
}

const switchCamera = async () => {
  if (cameras.value.length <= 1) return

  currentCameraIndex.value = (currentCameraIndex.value + 1) % cameras.value.length
  
  // Stop current stream
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
  }

  // Initialize with new camera
  await initializeCamera()
}

const capturePhoto = () => {
  if (!videoElement.value || !canvasElement.value) return

  const canvas = canvasElement.value
  const video = videoElement.value
  const context = canvas.getContext('2d')

  // Set canvas size to video size
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  // Draw video frame to canvas
  context.drawImage(video, 0, 0)

  // Convert canvas to blob
  canvas.toBlob(async (blob) => {
    if (blob) {
      const file = new File([blob], `camera_photo_${Date.now()}.jpg`, {
        type: 'image/jpeg'
      })
      
      await handleFile([file])
      closeCamera()
    }
  }, 'image/jpeg', 0.8)
}

const retakePhoto = () => {
  // Reset camera view
  if (videoElement.value) {
    videoElement.value.play()
  }
}

const closeCamera = () => {
  showCamera.value = false
  
  // Stop camera stream
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  handleFile(files)
}

const handleDrop = (event) => {
  isDragOver.value = false
  const files = Array.from(event.dataTransfer.files).filter(file => 
    file.type.startsWith('image/')
  )
  handleFile(files)
}

const handleDragOver = (event) => {
  isDragOver.value = true
}

const handleDragLeave = (event) => {
  isDragOver.value = false
}

const handleFile = async (files) => {
  if (files.length === 0) return

  // Validate file count
  if (photos.value.length + files.length > props.maxFiles) {
    emit('upload-error', `Maksimal ${props.maxFiles} foto`)
    return
  }

  // Validate and process each file
  for (const file of files) {
    if (!validateFile(file)) continue

    const photoData = {
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
      uploading: true,
      progress: 0,
      dimensions: 'Calculating...'
    }

    // Get image dimensions
    getImageDimensions(file).then(dimensions => {
      photoData.dimensions = `${dimensions.width}x${dimensions.height}`
    })

    photos.value.push(photoData)

    // Simulate upload progress
    await simulateUpload(photoData)
  }

  emit('update:modelValue', photos.value)
}

const validateFile = (file) => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    emit('upload-error', 'File harus berupa gambar')
    return false
  }

  // Check file size
  if (file.size > props.maxFileSize * 1024 * 1024) {
    emit('upload-error', `File terlalu besar. Maksimal ${props.maxFileSize}MB`)
    return false
  }

  return true
}

const getImageDimensions = (file) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    img.src = URL.createObjectURL(file)
  })
}

const simulateUpload = async (photoData) => {
  // Simulate upload progress
  for (let progress = 0; progress <= 100; progress += 10) {
    await new Promise(resolve => setTimeout(resolve, 100))
    photoData.progress = progress
  }

  photoData.uploading = false
  
  // Emit upload complete event
  emit('upload-complete', photoData)
}

const removePhoto = (index) => {
  const photo = photos.value[index]
  
  // Revoke object URL to free memory
  if (photo.preview) {
    URL.revokeObjectURL(photo.preview)
  }
  
  photos.value.splice(index, 1)
  emit('update:modelValue', photos.value)
}

const viewPhoto = (photo, index) => {
  currentPhotoIndex.value = index
  showViewer.value = true
}

const closeViewer = () => {
  showViewer.value = false
}

const previousPhoto = () => {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--
  }
}

const nextPhoto = () => {
  if (currentPhotoIndex.value < photos.value.length - 1) {
    currentPhotoIndex.value++
  }
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Lifecycle
onMounted(() => {
  // Check camera support
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.warn('Camera not supported')
  }
})

onUnmounted(() => {
  // Cleanup object URLs
  photos.value.forEach(photo => {
    if (photo.preview) {
      URL.revokeObjectURL(photo.preview)
    }
  })

  // Stop camera stream
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
  }
})
</script>

<style scoped>
.photo-upload-container {
  width: 100%;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-area:hover {
  border-color: #60a5fa;
  background-color: #eff6ff;
}

.upload-area.drag-over {
  border-color: #3b82f6;
  background-color: #dbeafe;
}

.upload-area.error {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.upload-icon {
  color: #9ca3af;
}

.upload-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
}

.upload-description {
  font-size: 0.875rem;
  color: #6b7280;
}

.upload-buttons {
  display: flex;
  gap: 0.5rem;
}

.loading-spinner {
  color: #3b82f6;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

@media (min-width: 768px) {
  .photo-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .photo-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.photo-item {
  position: relative;
}

.photo-wrapper {
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.photo-image {
  width: 100%;
  height: 8rem;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s;
}

.photo-image:hover {
  transform: scale(1.05);
}

.photo-actions {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.photo-wrapper:hover .photo-actions {
  opacity: 1;
}

.action-btn {
  background-color: white;
  color: #374151;
}

.action-btn:hover {
  background-color: #f3f4f6;
}

.upload-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 0.5rem;
}

.progress-bar {
  width: 100%;
  background-color: #4b5563;
  border-radius: 9999px;
  height: 0.5rem;
  margin-bottom: 0.25rem;
}

.progress-fill {
  background-color: #3b82f6;
  height: 0.5rem;
  border-radius: 9999px;
  transition: all 0.3s;
}

.progress-text {
  font-size: 0.75rem;
}

.photo-info {
  margin-top: 0.5rem;
}

.photo-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.photo-size {
  font-size: 0.75rem;
  color: #6b7280;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
}

.help-text {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Photo Viewer */
.photo-viewer-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.photo-viewer-content {
  position: relative;
  max-width: 56rem;
  max-height: 100%;
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.8);
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 1);
}

.viewer-controls {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 10;
}

.photo-counter {
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
}

.viewer-image {
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
}

.viewer-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 1rem;
}

.viewer-title {
  font-weight: 600;
}

.viewer-details {
  font-size: 0.875rem;
  opacity: 0.75;
}

/* Camera Modal */
.camera-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.camera-content {
  position: relative;
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
  max-width: 42rem;
  width: 100%;
}

.camera-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.camera-title {
  font-size: 1.125rem;
  font-weight: 600;
}

.camera-container {
  position: relative;
}

.camera-video {
  width: 100%;
  height: 16rem;
  object-fit: cover;
}

@media (min-width: 768px) {
  .camera-video {
    height: 24rem;
  }
}

.camera-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.capture-btn {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
}

.capture-btn:hover {
  background-color: #2563eb;
}

/* Responsive */
@media (max-width: 768px) {
  .upload-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .viewer-controls {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>

