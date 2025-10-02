<template>
  <div
    id="file-viewer-dialog"
    :class="{
      'hidden': !isVisible
    }"
    :style="{
      backgroundColor: `rgba(0,0,0,0.8)`,
      zIndex: 9999
    }"
    class="fixed inset-0 flex items-center justify-center animate-fadeIn"
    @click="closeOnBackdrop"
  >
    <!-- Dialog Box -->
    <div
      ref="dialogBox"
      class="rounded-lg shadow-2xl bg-white max-w-4xl max-h-[90vh] w-full mx-4"
      :style="dialogStyle"
      @click.stop
    >
      <!-- Header -->
      <div
        class="flex justify-between items-center p-4 border-b cursor-move"
        :class="[
          `bg-${colors.PRIMARY}-700`,
          `border-b-${colors.PRIMARY}-900`
        ]"
        @mousedown="startDrag"
      >
        <div class="flex items-center gap-3">
          <i :class="fileIcon" class="text-white text-xl"></i>
          <h3 class="text-lg font-semibold text-white">{{ fileName }}</h3>
          <span class="text-sm text-gray-200">({{ fileSize }})</span>
        </div>
        <div class="flex gap-x-2">
          <!-- Print Button -->
          <button
            v-if="fileUrl && (isImage || isPdf || isTextFile)"
            @click="printFile"
            class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
            title="Print"
          >
            <i class="ri-printer-line text-white text-lg"></i>
          </button>
          
          <!-- Download Button -->
          <button
            v-if="fileUrl"
            @click="downloadFile"
            class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
            title="Download"
          >
            <i class="ri-download-line text-white text-lg"></i>
          </button>
          <!-- Zoom Controls for Images -->
          <div v-if="isImage" class="flex gap-x-1">
            <button
              @click="zoomOut"
              class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
              title="Zoom Out"
            >
              <i class="ri-zoom-out-line text-white text-lg"></i>
            </button>
            <span class="flex items-center px-2 text-white text-sm">{{ Math.round(zoomLevel * 100) }}%</span>
            <button
              @click="zoomIn"
              class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
              title="Zoom In"
            >
              <i class="ri-zoom-in-line text-white text-lg"></i>
            </button>
            <button
              @click="resetZoom"
              class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
              title="Reset Zoom"
            >
              <i class="ri-refresh-line text-white text-lg"></i>
            </button>
          </div>
          <!-- Close Button -->
          <button
            @click="close"
            class="p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
            title="Close"
          >
            <i class="ri-close-line text-white text-lg"></i>
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="p-4 overflow-auto max-h-[calc(90vh-80px)]">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center h-64">
          <div class="text-center">
            <i class="ri-loader-4-line animate-spin text-4xl text-gray-400 mb-4"></i>
            <p class="text-gray-600">Loading file...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex items-center justify-center h-64">
          <div class="text-center">
            <i class="ri-error-warning-line text-4xl text-red-500 mb-4"></i>
            <p class="text-red-600 mb-2">{{ error }}</p>
            <button
              @click="retry"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>

        <!-- Image Preview -->
        <div v-else-if="isImage" class="flex justify-center">
          <img
            ref="imageElement"
            :src="fileUrl"
            :alt="fileName"
            class="max-w-full h-auto transition-transform duration-200"
            :style="{ transform: `scale(${zoomLevel})` }"
            @load="onImageLoad"
            @error="onError"
          />
        </div>

        <!-- PDF Preview -->
        <div v-else-if="isPdf" class="w-full">
          <iframe
            :src="pdfUrl"
            class="w-full h-[600px] border-0 rounded"
            @load="onPdfLoad"
            @error="onError"
          ></iframe>
        </div>

        <!-- Text File Preview -->
        <div v-else-if="isTextFile" class="w-full">
          <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">{{ textContent }}</pre>
        </div>

        <!-- Video Preview -->
        <div v-else-if="isVideo" class="w-full">
          <video
            :src="fileUrl"
            controls
            class="w-full max-h-96 rounded"
            @loadstart="onVideoLoad"
            @error="onError"
          ></video>
        </div>

        <!-- Audio Preview -->
        <div v-else-if="isAudio" class="w-full">
          <audio
            :src="fileUrl"
            controls
            class="w-full"
            @loadstart="onAudioLoad"
            @error="onError"
          ></audio>
        </div>

        <!-- Default/Unsupported File Type -->
        <div v-else class="flex items-center justify-center h-64">
          <div class="text-center">
            <i :class="fileIcon" class="text-6xl text-gray-400 mb-4"></i>
            <p class="text-gray-600 mb-4">{{ fileName }}</p>
            <p class="text-sm text-gray-500 mb-4">Preview not available for this file type</p>
            <div class="flex gap-2 justify-center">
              <button
                v-if="fileUrl"
                @click="downloadFile"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                <i class="ri-download-line mr-2"></i>Download
              </button>
              <button
                @click="openInNewTab"
                class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                <i class="ri-external-link-line mr-2"></i>Open in New Tab
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAppStore } from "@/store/app";
import { computed, ref, watch, onMounted, onUnmounted } from "vue";

export default {
  name: "FileViewer",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    fileUrl: {
      type: String,
      default: ""
    },
    fileName: {
      type: String,
      default: "File"
    },
    fileSize: {
      type: String,
      default: ""
    },
    fileType: {
      type: String,
      default: ""
    }
  },
  emits: ['close', 'download'],
  setup(props, { emit }) {
    const store = useAppStore();
    const colors = computed(() => store.colors);
    
    // State
    const isVisible = ref(props.visible);
    const loading = ref(false);
    const error = ref("");
    const textContent = ref("");
    const zoomLevel = ref(1);
    
    // Refs
    const dialogBox = ref(null);
    const imageElement = ref(null);
    
    // Draggable functionality
    const position = ref({ x: 0, y: 0 });
    const isDragging = ref(false);
    const dragOffset = ref({ x: 0, y: 0 });

    // Computed properties
    const fileExtension = computed(() => {
      if (props.fileType) return props.fileType.toLowerCase();
      const ext = props.fileName.split('.').pop()?.toLowerCase() || '';
      return ext;
    });

    const isImage = computed(() => {
      const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
      return imageExts.includes(fileExtension.value);
    });

    const isPdf = computed(() => fileExtension.value === 'pdf');

    const isTextFile = computed(() => {
      const textExts = ['txt', 'md', 'json', 'xml', 'csv', 'log', 'js', 'ts', 'vue', 'html', 'css'];
      return textExts.includes(fileExtension.value);
    });

    const isVideo = computed(() => {
      const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
      return videoExts.includes(fileExtension.value);
    });

    const isAudio = computed(() => {
      const audioExts = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'];
      return audioExts.includes(fileExtension.value);
    });

    const fileIcon = computed(() => {
      if (isImage.value) return 'ri-image-line';
      if (isPdf.value) return 'ri-file-pdf-line';
      if (isTextFile.value) return 'ri-file-text-line';
      if (isVideo.value) return 'ri-video-line';
      if (isAudio.value) return 'ri-music-line';
      return 'ri-file-line';
    });

    const pdfUrl = computed(() => {
      if (isPdf.value && props.fileUrl) {
        return `${props.fileUrl}#toolbar=0&navpanes=0&scrollbar=0`;
      }
      return props.fileUrl;
    });

    const dialogStyle = computed(() => {
      if (isDragging.value || position.value.x !== 0 || position.value.y !== 0) {
        return {
          position: 'fixed',
          left: `${position.value.x}px`,
          top: `${position.value.y}px`,
          transform: 'none',
          zIndex: 10000
        };
      }
      return {
        zIndex: 10000
      };
    });

    // Methods
    const close = () => {
      isVisible.value = false;
      emit('close');
    };

    const closeOnBackdrop = (e) => {
      if (e.target.id === 'file-viewer-dialog') {
        close();
      }
    };

    const downloadFile = () => {
      if (props.fileUrl) {
        const link = document.createElement('a');
        link.href = props.fileUrl;
        link.download = props.fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        emit('download', props.fileUrl);
      }
    };

    const printFile = () => {
      if (!props.fileUrl) return;

      if (isImage.value) {
        // For images, open in new window and print
        const printWindow = window.open(props.fileUrl, '_blank');
        printWindow.onload = function() {
          printWindow.print();
        };
      } else if (isPdf.value) {
        // For PDF, open in new window and print
        const printWindow = window.open(props.fileUrl, '_blank');
        printWindow.onload = function() {
          printWindow.print();
        };
      } else if (isTextFile.value) {
        // For text files, create a simple print window
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Print - ' + props.fileName + '</title></head><body><h2>' + props.fileName + '</h2><pre>' + textContent.value + '</pre></body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    };

    const openInNewTab = () => {
      if (props.fileUrl) {
        window.open(props.fileUrl, '_blank');
      }
    };

    const zoomIn = () => {
      zoomLevel.value = Math.min(zoomLevel.value + 0.25, 3);
    };

    const zoomOut = () => {
      zoomLevel.value = Math.max(zoomLevel.value - 0.25, 0.25);
    };

    const resetZoom = () => {
      zoomLevel.value = 1;
    };

    const loadTextFile = async () => {
      if (!isTextFile.value || !props.fileUrl) return;
      
      try {
        loading.value = true;
        const response = await fetch(props.fileUrl);
        if (!response.ok) throw new Error('Failed to load file');
        textContent.value = await response.text();
      } catch (err) {
        error.value = 'Failed to load text file';
      } finally {
        loading.value = false;
      }
    };

    const retry = () => {
      error.value = "";
      if (isTextFile.value) {
        loadTextFile();
      }
    };

    // Event handlers
    const onImageLoad = () => {
      loading.value = false;
      error.value = "";
    };

    const onPdfLoad = () => {
      loading.value = false;
      error.value = "";
    };

    const onVideoLoad = () => {
      loading.value = false;
      error.value = "";
    };

    const onAudioLoad = () => {
      loading.value = false;
      error.value = "";
    };

    const onError = () => {
      loading.value = false;
      error.value = 'Failed to load file';
    };

    // Draggable functionality
    const startDrag = (e) => {
      if (e.target.closest('.cursor-move') && !e.target.closest('button')) {
        isDragging.value = true;
        
        const rect = dialogBox.value.getBoundingClientRect();
        dragOffset.value = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
        
        position.value = {
          x: rect.left,
          y: rect.top
        };
        
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', stopDrag);
        e.preventDefault();
      }
    };

    const handleDrag = (e) => {
      if (isDragging.value) {
        const newX = e.clientX - dragOffset.value.x;
        const newY = e.clientY - dragOffset.value.y;
        
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const dialogWidth = dialogBox.value.offsetWidth;
        const dialogHeight = dialogBox.value.offsetHeight;
        
        position.value = {
          x: Math.max(0, Math.min(newX, viewportWidth - dialogWidth)),
          y: Math.max(0, Math.min(newY, viewportHeight - dialogHeight))
        };
      }
    };

    const stopDrag = () => {
      isDragging.value = false;
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', stopDrag);
    };

    const resetPosition = () => {
      position.value = { x: 0, y: 0 };
      isDragging.value = false;
    };

    // Watchers
    watch(() => props.visible, (newVal) => {
      isVisible.value = newVal;
      if (newVal) {
        error.value = "";
        resetPosition();
        if (isTextFile.value) {
          loading.value = true;
          loadTextFile();
        } else if (isImage.value) {
          // For images, show immediately without loading state
          loading.value = false;
        } else if (isPdf.value || isVideo.value || isAudio.value) {
          // For other media files, show loading briefly
          loading.value = true;
          setTimeout(() => {
            if (loading.value) {
              loading.value = false;
            }
          }, 1000);
        } else {
          // For unsupported files, no loading needed
          loading.value = false;
        }
      }
    });

    watch(() => props.fileUrl, () => {
      if (isVisible.value) {
        error.value = "";
        if (isTextFile.value) {
          loading.value = true;
          loadTextFile();
        } else if (isImage.value) {
          // For images, show immediately without loading state
          loading.value = false;
        } else if (isPdf.value || isVideo.value || isAudio.value) {
          // For other media files, show loading briefly
          loading.value = true;
          setTimeout(() => {
            if (loading.value) {
              loading.value = false;
            }
          }, 1000);
        } else {
          loading.value = false;
        }
      }
    });

    // Keyboard shortcuts
    const handleKeydown = (e) => {
      if (!isVisible.value) return;
      
      // Ctrl+P for print
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        printFile();
        return;
      }
      
      switch (e.key) {
        case 'Escape':
          close();
          break;
        case '+':
        case '=':
          if (isImage.value) zoomIn();
          break;
        case '-':
          if (isImage.value) zoomOut();
          break;
        case '0':
          if (isImage.value) resetZoom();
          break;
      }
    };

    onMounted(() => {
      document.addEventListener('keydown', handleKeydown);
    });

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', stopDrag);
    });

    return {
      // State
      isVisible,
      loading,
      error,
      textContent,
      zoomLevel,
      
      // Refs
      dialogBox,
      imageElement,
      
      // Computed
      colors,
      isImage,
      isPdf,
      isTextFile,
      isVideo,
      isAudio,
      fileIcon,
      pdfUrl,
      dialogStyle,
      
      // Methods
      close,
      closeOnBackdrop,
      downloadFile,
      printFile,
      openInNewTab,
      zoomIn,
      zoomOut,
      resetZoom,
      retry,
      
      // Event handlers
      onImageLoad,
      onPdfLoad,
      onVideoLoad,
      onAudioLoad,
      onError,
      
      // Draggable
      startDrag
    };
  }
};
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Custom scrollbar for content area */
.overflow-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
