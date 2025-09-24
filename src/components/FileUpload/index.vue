<template>
  <div>
    <div
      id="dialog"
      :class="{
        'hidden': !show,
    }"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center animate-fadeIn"
    >
      <!-- Dialog Box -->
      <div class="bg-white rounded-lg shadow-lg max-w-lg w-full  overflow-hidden">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4 h-[48px] bg-teal-700 px-4 border-b-teal-900 border-b-4">
          <h3 class="text-smfont-semibold text-white">{{ title }}</h3>
          <i class="ri-close-circle-fill text-white hover:cursor-pointer"></i>
        </div>
        <!-- Form -->
        <div class="p-5">
          <slot name="formdata" />
          <!-- Actions  -->
          <div class="flex justify-end">
            <button
              type="button"
              class="bg-gray-200 hover:bg-gray-300 border-l-gray-500 border-l-4 text-gray-700 px-4 py-1 rounded-sm mr-2"
            >Batal</button>
            <button
              @click="postRecord"
              type="button"
              class="bg-teal-600 hover:bg-teal-700 border-l-teal-900 border-l-4 text-white px-4 py-1 rounded-sm"
            >Ya</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="w-full" :class="{ 'flex items-start space-x-3': labelPosition === 'inline' }">
    <!-- Label -->
    <label 
      v-if="label" 
      :for="inputId" 
      :class="labelClasses"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- FileUpload Container Wrapper for inline mode -->
    <div :class="{ 'flex-1': labelPosition === 'inline' }">
      <div class="flex w-full justify-between border h-full  border-gray-400 bg-white  rounded-md  overflow-hidden ">
      <div
        class="py-2 w-full px-2"
        v-if="!uploader.state"
      >
        <input
          type="text"
          class="w-full focus:outline-none text-sm disabled:bg-white"
          :placeholder="placeholder"
          disabled
          v-model="filename"
        >
        <input
          type="file"
          class="hidden"
          ref="fileInput"
          :accept="accept"
          @change="postUpload"
        >
      </div>

      <div
        class="flex bg-cyan-600 text-xs  py-2 font-medium w-full text-white text-center justify-center items-center"
        v-if="uploader.state"
        :style="{ width: `${uploader.progress}%` }"
      >
        {{ uploader.progress }} %
      </div>
      <div class="flex">
        <!-- Delete Button -->
        <div
          v-if="filename"
          class="flex justify-center items-center h-full w-[50px] bg-red-500 hover:cursor-pointer hover:bg-red-600 text-white border-r border-red-600"
          @click="clearFile"
          title="Hapus file"
        >
          <i class="ri-delete-bin-fill text-xl"></i>
        </div>
        
        <!-- Camera Button -->
        <div
          v-if="accept.includes('image') || accept === '*'"
          class="flex justify-center items-center h-full w-[50px] bg-green-500 hover:cursor-pointer hover:bg-green-600 text-white border-r border-green-600"
          @click="openCamera"
          title="Ambil foto dari kamera"
        >
          <i class="ri-camera-fill text-xl"></i>
        </div>
        
        <!-- Upload Button -->
        <div
          class="flex justify-center items-center h-full w-[50px] bg-cyan-500 hover:cursor-pointer hover:bg-cyan-600 text-white"
          @click="openFileUpload"
          title="Upload file"
        >
          <i class="ri-upload-cloud-fill text-xl"></i>
        </div>
      </div>
    </div>
      <div class="text-[8pt] text-gray-500 my-1">
        <span>Max 2 Mb</span>
      </div>

    <!-- File Preview Section -->
    <div v-if="showPreview && filename && filePreview" class="mt-4 border border-gray-200 rounded-lg p-3 bg-gray-50">
      <div class="flex items-start space-x-3">
        <!-- Preview Content -->
        <div class="flex-shrink-0">
          <!-- Image Preview -->
          <div v-if="filePreview.type === 'image'" :class="previewSizeClasses">
            <img 
              :src="filePreview.url" 
              :alt="filename"
              class="w-full h-full object-cover rounded-md border border-gray-300"
              @error="handlePreviewError"
            />
          </div>
          
          <!-- PDF Preview -->
          <div v-else-if="filePreview.type === 'pdf'" :class="previewSizeClasses">
            <div class="w-full h-full bg-red-100 border border-red-300 rounded-md flex flex-col items-center justify-center text-red-600">
              <i class="ri-file-pdf-fill text-3xl mb-2"></i>
              <span class="text-xs font-medium">PDF</span>
            </div>
          </div>
          
          <!-- Document Preview -->
          <div v-else-if="filePreview.type === 'document'" :class="previewSizeClasses">
            <div class="w-full h-full bg-blue-100 border border-blue-300 rounded-md flex flex-col items-center justify-center text-blue-600">
              <i class="ri-file-text-fill text-3xl mb-2"></i>
              <span class="text-xs font-medium">DOC</span>
            </div>
          </div>
          
          <!-- Other File Types -->
          <div v-else :class="previewSizeClasses">
            <div class="w-full h-full bg-gray-100 border border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-600">
              <i class="ri-file-fill text-3xl mb-2"></i>
              <span class="text-xs font-medium">FILE</span>
            </div>
          </div>
        </div>
        
        <!-- File Info -->
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-gray-900 truncate">
            {{ filename }}
          </div>
          <div class="text-xs text-gray-500 mt-1">
            <span v-if="filePreview.size">{{ formatFileSize(filePreview.size) }}</span>
            <span v-if="filePreview.size && filePreview.lastModified"> • </span>
            <span v-if="filePreview.lastModified">{{ formatDate(filePreview.lastModified) }}</span>
          </div>
          <div v-if="filePreview.type === 'image' && filePreview.dimensions" class="text-xs text-gray-500 mt-1">
            {{ filePreview.dimensions.width }} × {{ filePreview.dimensions.height }} px
          </div>
        </div>
        
        <!-- Preview Actions -->
        <div class="flex-shrink-0 flex space-x-1">
          <!-- View Full Size (for images) -->
          <button
            v-if="filePreview.type === 'image'"
            @click="openFullPreview"
            class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
            title="View full size"
          >
            <i class="ri-eye-fill text-sm"></i>
          </button>
          
          <!-- Download -->
          <button
            @click="downloadFile"
            class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
            title="Download file"
          >
            <i class="ri-download-fill text-sm"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Full Size Preview Modal -->
    <div
      v-if="showFullPreview"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      @click="closeFullPreview"
    >
      <div class="max-w-4xl max-h-full p-4">
        <img 
          :src="filePreview.url" 
          :alt="filename"
          class="max-w-full max-h-full object-contain rounded-lg"
        />
        <button
          @click="closeFullPreview"
          class="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl"
        >
          <i class="ri-close-line"></i>
        </button>
      </div>
    </div>

    <!-- Camera Modal -->
    <div
      v-if="showCamera"
      class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
      @click="closeCamera"
    >
      <div class="bg-white rounded-lg overflow-hidden max-w-2xl w-full mx-4">
        <!-- Camera Header -->
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-lg font-semibold">Ambil Foto</h3>
          <button
            @click="closeCamera"
            class="text-gray-500 hover:text-gray-700 text-xl"
          >
            <i class="ri-close-line"></i>
          </button>
        </div>

        <!-- Camera Container -->
        <div class="relative">
          <video
            ref="videoElement"
            class="w-full h-64 md:h-96 object-cover"
            autoplay
            muted
            playsinline
          ></video>
          <canvas ref="canvasElement" class="hidden"></canvas>
        </div>

        <!-- Camera Controls -->
        <div class="flex justify-center items-center gap-4 p-4 border-t">
          <button
            type="button"
            @click="switchCamera"
            :disabled="!hasMultipleCameras"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="ri-refresh-line mr-2"></i>Switch
          </button>
          <button
            type="button"
            @click="capturePhoto"
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full flex items-center"
          >
            <i class="ri-camera-fill mr-2"></i>Capture
          </button>
          <button
            type="button"
            @click="retakePhoto"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            <i class="ri-refresh-line mr-2"></i>Retake
          </button>
        </div>
      </div>
    </div>

    <!-- Error message -->
    <p v-if="error" :id="`${inputId}-error`" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>

    <!-- Helper text -->
    <p v-else-if="helperText" class="mt-1 text-sm text-gray-500">
      {{ helperText }}
    </p>
    
    </div> <!-- End FileUpload Container Wrapper -->
  </div>
</template>

<script>
import { useAppStore } from "@/store/app";
import { MSG_UPLOAD_SUCCESS, MSG_ERROR } from "@/config/lang";
import { computed, ref, watch } from "vue";
import { MSG_UPLOAD_FAILED } from "../../config/lang";

export default {
  props: {
    modelValue: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: "Your Title Here",
    },
    folder: {
      type: String,
      default: "app",
    },
    placeholder: {
      type: String,
      default: "Upload Your File Here..!",
    },
    accept: {
      type: String,
      default: "*",
    },
    showPreview: {
      type: Boolean,
      default: true,
    },
    previewSize: {
      type: String,
      default: "medium", // small, medium, large
    },
    // Label props
    label: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: "",
    },
    helperText: {
      type: String,
      default: "",
    },
    // Label position
    labelPosition: {
      type: String,
      default: "top",
      validator: (value) => ["top", "inline"].includes(value),
    },
    labelWidth: {
      type: String,
      default: "w-32",
    },
  },
  setup(props, { emit }) {
    const store = useAppStore();
    const colors = computed(() => store.colors);
    const types = computed(() => store.types);
    const uploader = computed(() => store.uploader);
    const show = ref(false);

    const title = ref(props.title);
    const folder = ref(props.folder);
    const placeholder = ref(props.placeholder);
    const accept = ref(props.accept);

    const filename = ref(null);
    const fileInput = ref(null);
    const filePreview = ref(null);
    const showFullPreview = ref(false);
    const currentFile = ref(null);
    const inputId = `fileupload-${Math.random().toString(36).substr(2, 9)}`;
    
    // Camera related refs
    const showCamera = ref(false);
    const videoElement = ref(null);
    const canvasElement = ref(null);
    const stream = ref(null);
    const hasMultipleCameras = ref(false);
    const currentCameraIndex = ref(0);
    const cameras = ref([]);

    // Computed properties
    const previewSizeClasses = computed(() => {
      const sizeMap = {
        small: 'w-12 h-12',
        medium: 'w-16 h-16',
        large: 'w-24 h-24'
      };
      return sizeMap[props.previewSize] || sizeMap.medium;
    });

    // Label classes
    const labelClasses = computed(() => {
      const baseClasses = "text-sm font-medium text-gray-700";
      
      if (props.labelPosition === "inline") {
        return [
          baseClasses,
          props.labelWidth,
          "flex-shrink-0 pt-2"
        ].join(" ");
      }
      
      return [baseClasses, "block mb-1"].join(" ");
    });

    // Helper functions
    const getFileType = (file) => {
      if (!file) return 'unknown';
      
      const type = file.type;
      if (type.startsWith('image/')) return 'image';
      if (type === 'application/pdf') return 'pdf';
      if (type.includes('document') || type.includes('word') || type.includes('text')) return 'document';
      return 'other';
    };

    const createFilePreview = async (file) => {
      if (!file || !props.showPreview) {
        filePreview.value = null;
        return;
      }

      const preview = {
        type: getFileType(file),
        size: file.size,
        lastModified: file.lastModified,
        url: null,
        dimensions: null
      };

      // Create preview URL for images
      if (preview.type === 'image') {
        preview.url = URL.createObjectURL(file);
        
        // Get image dimensions
        const img = new Image();
        img.onload = () => {
          preview.dimensions = {
            width: img.width,
            height: img.height
          };
        };
        img.src = preview.url;
      }

      filePreview.value = preview;
    };

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (timestamp) => {
      return new Date(timestamp).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const openFileUpload = () => {
      fileInput.value.click();
    };

    const openFullPreview = () => {
      showFullPreview.value = true;
    };

    const closeFullPreview = () => {
      showFullPreview.value = false;
    };

    const handlePreviewError = () => {
      console.warn('Failed to load preview image');
    };

    const downloadFile = () => {
      if (filename.value) {
        // Create download link using the server file path
        const downloadUrl = `${store.baseURL}/storage/${filename.value}`;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename.value;
        link.click();
      }
    };

    // Camera methods
    const openCamera = async () => {
      try {
        showCamera.value = true;
        await initializeCamera();
      } catch (error) {
        console.error('Error opening camera:', error);
        showCamera.value = false;
        store.setSnackbar('Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.', colors.value.ERROR, types.value.ERROR);
      }
    };

    const initializeCamera = async () => {
      try {
        // Get available cameras
        const devices = await navigator.mediaDevices.enumerateDevices();
        cameras.value = devices.filter(device => device.kind === 'videoinput');
        hasMultipleCameras.value = cameras.value.length > 1;

        // Get user media
        const constraints = {
          video: {
            deviceId: cameras.value[currentCameraIndex.value]?.deviceId,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };

        stream.value = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (videoElement.value) {
          videoElement.value.srcObject = stream.value;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        throw error;
      }
    };

    const switchCamera = async () => {
      if (cameras.value.length <= 1) return;

      currentCameraIndex.value = (currentCameraIndex.value + 1) % cameras.value.length;
      
      // Stop current stream
      if (stream.value) {
        stream.value.getTracks().forEach(track => track.stop());
      }

      // Initialize with new camera
      await initializeCamera();
    };

    const capturePhoto = () => {
      if (!videoElement.value || !canvasElement.value) return;

      const canvas = canvasElement.value;
      const video = videoElement.value;
      const context = canvas.getContext('2d');

      // Set canvas size to video size
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      context.drawImage(video, 0, 0);

      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `camera_photo_${Date.now()}.jpg`, {
            type: 'image/jpeg'
          });
          
          // Set the file to input and trigger upload
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInput.value.files = dataTransfer.files;
          
          await postUpload();
          closeCamera();
        }
      }, 'image/jpeg', 0.8);
    };

    const retakePhoto = () => {
      // Reset camera view
      if (videoElement.value) {
        videoElement.value.play();
      }
    };

    const closeCamera = () => {
      showCamera.value = false;
      
      // Stop camera stream
      if (stream.value) {
        stream.value.getTracks().forEach(track => track.stop());
        stream.value = null;
      }
    };

    const clearFile = async () => {
      const previousValue = filename.value;
      
      try {
        await store.deleteFile(filename.value);
        
        filename.value = null;
        fileInput.value.value = '';
        currentFile.value = null;
        
        // Clear preview and cleanup URLs
        if (filePreview.value?.url) {
          URL.revokeObjectURL(filePreview.value.url);
        }
        filePreview.value = null;
        showFullPreview.value = false;
        
        emit("update:modelValue", null);
        
        // Emit change event
        emit("change", {
          value: null,
          previousValue: previousValue,
          file: null,
          fileData: null
        });

        // Emit delete event
        emit("delete", {
          deletedFileName: previousValue,
          previousValue: previousValue
        });
        
        store.setSnackbar("File berhasil dihapus", colors.value.SUCCESS, types.value.SUCCESS);
      } catch (error) {
        console.log("Error deleting file:", error);
        
        emit("error", {
          error: error.message,
          file: null,
          previousValue: previousValue
        });
        
        store.setSnackbar("Gagal menghapus file: " + error.message, colors.value.ERROR, types.value.ERROR);
      }
    };

    watch(
      () => props.modelValue,
      (newVal) => {
        filename.value = newVal;
      }
    );

    const postUpload = async () => {
      try {
        const file = fileInput.value.files[0];
        const previousValue = filename.value;

        // Create preview immediately
        currentFile.value = file;
        await createFilePreview(file);

        const result = await store.uploadFile(file, props.folder);

        if (!result.data.status) {
          store.setSnackbar(MSG_ERROR, colors.ERROR, types.ERROR);
          emit("error", {
            error: MSG_ERROR,
            file: file,
            previousValue: previousValue
          });
          return;
        }

        const newFileName = result.data.data.file_name;
        filename.value = newFileName;

        emit("update:modelValue", newFileName);
        
        // Emit change event
        emit("change", {
          value: newFileName,
          previousValue: previousValue,
          file: file,
          fileData: result.data.data
        });

        // Emit upload event
        emit("upload", {
          fileName: newFileName,
          file: file,
          fileData: result.data.data
        });

        store.setSnackbar(MSG_UPLOAD_SUCCESS, colors.SUCCESS, types.ERROR);
      } catch (error) {
        console.log("err mesg :" + error.response.data.message)
        
        emit("error", {
          error: error.message,
          file: fileInput.value.files[0],
          previousValue: filename.value
        });
        
        store.setSnackbar(MSG_UPLOAD_FAILED + "," + error.message, colors.ERROR, "error");
      }
    };
    return {
      // Existing
      show,
      postUpload,
      uploader,
      title,
      folder,
      placeholder,
      accept,
      filename,
      fileInput,
      openFileUpload,
      clearFile,
      
      // Preview functionality
      filePreview,
      showFullPreview,
      previewSizeClasses,
      openFullPreview,
      closeFullPreview,
      handlePreviewError,
      downloadFile,
      formatFileSize,
      formatDate,
      
      // Camera functionality
      showCamera,
      videoElement,
      canvasElement,
      hasMultipleCameras,
      openCamera,
      closeCamera,
      capturePhoto,
      retakePhoto,
      switchCamera,
      
      // Label functionality
      inputId,
      labelClasses,
    };
  },
};
</script>