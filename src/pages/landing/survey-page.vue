<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Sistem Manajemen Survey Kabupaten Tangerang
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Bantu kami mengumpulkan data  di wilayah Anda untuk meningkatkan pelayanan di Kabupaten Tangerang
        </p>
      </div>

      <!-- Survey Form -->
      <div class="bg-white rounded-lg shadow-xl p-8">
        <form @submit.prevent="submitSurvey" class="space-y-8">
          
          <!-- Survey Topic Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Topik Survey <span class="text-red-500">*</span>
            </label>
            <UComboBox
              v-model="formData.survey_topic_id"
              :items="surveyTopics"
              placeholder="Pilih topik survey"
              @change="onTopicChange"
              :error="errors.survey_topic_id"
            />
          </div>

          <!-- Survey Topic Category Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Kategori Lokasi <span class="text-red-500">*</span>
            </label>
            <UComboBox
              v-model="formData.survey_topic_category_id"
              :items="surveyTopicCategories"
              placeholder="Pilih kategori lokasi"
              :error="errors.survey_topic_category_id"
            />
          </div>

          <!-- Surveyor Information -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nama Surveyor <span class="text-red-500">*</span>
            </label>
            <UTextField
              v-model="formData.surveyor_name"
              placeholder="Masukkan nama lengkap"
              :error="errors.surveyor"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Jabatan</label>
            <UTextField
              v-model="formData.surveyor_position"
              placeholder="Masukkan jabatan"
              :error="errors.surveyor_position"
            />
          </div>

          <!-- Location Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- District -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Kecamatan <span class="text-red-500">*</span>
              </label>
              <UComboBox
                v-model="formData.district_code"
                :items="districts"
                placeholder="Pilih Kecamatan"
                @change="onDistrictChange"
                :error="errors.district_code"
              />
            </div>

            <!-- Village -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Desa/Kelurahan <span class="text-red-500">*</span>
              </label>
              <UComboBox
                v-model="formData.village_code"
                :items="villages"
                placeholder="Pilih Desa/Kelurahan"
                :error="errors.village_code"
                :disabled="!formData.district_code"
              />
            </div>
          </div>

          <!-- Address -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Alamat Lengkap <span class="text-red-500">*</span>
            </label>
            <UTextArea
              v-model="formData.address"
              placeholder="Masukkan alamat lengkap lokasi survey"
              :rows="3"
              :error="errors.address"
            />
          </div>

          <!-- Postal Code and Phone -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Kode Pos
              </label>
              <UTextField
                v-model="formData.postal_code"
                placeholder="Masukkan kode pos"
                :error="errors.postal_code"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nomor Telepon <span class="text-red-500">*</span>
              </label>
              <UPhoneInput
                v-model="formData.phone"
                placeholder="Masukkan nomor telepon"
                :error="errors.phone"
              />
            </div>
          </div>

          <!-- Coordinate Picker with Map -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Pilih Lokasi di Peta <span class="text-red-500">*</span>
            </label>
            <div class="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <UMapCoordinatePicker
                v-model="coordinates"
                @update:modelValue="onLocationChange"
                :initial-location="initialLocation"
                :error="errors.coordinates"
              />
            </div>
            <p class="text-sm text-gray-500 mt-2">
              💡 Klik di peta atau gunakan tombol "Lokasi Saat Ini" untuk mendapatkan koordinat GPS
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Esitmasi Penggunaan Per hari <span class="text-red-500">*</span></label>
            <UTextField
              v-model="formData.meta[0].usage_per_day"
              placeholder="Masukkan estimasi penggunaan layanan ini per hari (orang)"
              :error="errors.usage_per_day"
              type="number"
            />
          </div>
          <div class="text-sm text-gray-500 mt-2">
            Dokumen Pendukung Lainnya
          </div>

          <div v-for="document in formData.attachments" :key="document.id">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ document.name }}</label>
            <UFileUpload
              v-model="document.uuid"
              :max-files="5"
              :max-file-size="5"
              folder="images"
              :error="errors.attachments"
              @change="(values)=>addOtherDocument(values, document)"
            />

          </div>

           

          <!-- Submit Button -->
          <div class="flex justify-center pt-6">
            <UButton
              type="submit"
              :loading="isSubmitting"
              class="px-12 py-3 text-lg"
            >
              Kirim Survey
            </UButton>
          </div>
          
        </form>
      </div>

      <!-- Information Section -->
      <div class="mt-12 bg-white rounded-lg shadow-lg p-6">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">
          📋 Informasi Penting
        </h3>
        <ul class="space-y-2 text-gray-600">
          <li class="flex items-start">
            <span class="text-green-500 mr-2">✓</span>
            <span>Data yang Anda berikan akan digunakan untuk pemetaan pelayanan di Kabupaten Tangerang</span>
          </li>
          <li class="flex items-start">
            <span class="text-green-500 mr-2">✓</span>
            <span>Informasi pribadi Anda akan dijaga kerahasiaannya</span>
          </li>
          <li class="flex items-start">
            <span class="text-green-500 mr-2">✓</span>
            <span>Survey ini bertujuan untuk meningkatkan kualitas data layanan  di wilayah Anda</span>
          </li>
          <li class="flex items-start">
            <span class="text-green-500 mr-2">✓</span>
            <span>Koordinat GPS akan membantu kami memetakan lokasi dengan akurat</span>
          </li>
        </ul>
      </div>

      <!-- Tips Section -->
      <div class="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-blue-900 mb-3">
          💡 Tips Mengisi Survey
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
          <div>
            <p class="font-medium mb-2">📍 Lokasi GPS:</p>
            <ul class="space-y-1">
              <li>• Gunakan tombol "Lokasi Saat Ini" untuk akurasi terbaik</li>
              <li>• Klik langsung di peta untuk memilih lokasi</li>
              <li>• Drag marker untuk memindahkan posisi</li>
            </ul>
          </div>
          <div>
            <p class="font-medium mb-2">🏠 Informasi Alamat:</p>
            <ul class="space-y-1">
              <li>• Isi alamat lengkap dengan detail</li>
              <li>• Pilih wilayah administratif yang tepat</li>
              <li>• Pastikan nomor telepon aktif</li>
            </ul>
          </div>
          <div>
            <p class="font-medium mb-2">📸 Foto Dokumentasi:</p>
            <ul class="space-y-1">
              <li>• Ambil foto langsung dari kamera untuk kualitas terbaik</li>
              <li>• Pilih dari galeri jika sudah ada foto</li>
              <li>• Drag & drop foto untuk upload yang mudah</li>
              <li>• Maksimal 5 foto, 5MB per foto</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <UToast ref="toast" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { UButton, UTextField, UTextArea, UComboBox, UPhoneInput, UToast, UMapCoordinatePicker, UPhotoUpload,UFileUpload } from '@/components'
import { useAppStore } from '@/store/app'
import { useRouter } from 'vue-router'

const store = useAppStore()
const router = useRouter()


// Reactive data
const formData = reactive({
  survey_topic_id: null,
  survey_topic_category_id: null,
  surveyor_name: '',
  surveyor_position: '',
  province_code: '',
  regency_code: '',
  district_code: '',
  village_code: '',
  address: '',
  postal_code: '',
  phone: '',
  meta:[{}],
  attachments: [],
  status: 'active'
})

const coordinates = reactive({
  latitude: '',
  longitude: ''
})

const errors = ref({})
const isSubmitting = ref(false)

// Options for dropdowns
const surveyTopics = ref([])
const surveyTopicCategories = ref([])
const provinces = ref([])
const regencies = ref([])
const districts = ref([])
const villages = ref([])
const otherDocuments = ref([])

// Initial location (Tangerang coordinates)
const initialLocation = reactive({
  lat: -6.1783,
  lng: 106.6319
})

// Toast reference
const toast = ref(null)

// Methods
const onTopicChange = (value) => {
  formData.survey_topic_category_id = value?.category_id || null
  fetchSurveyTopicCategories(value?.id)
  fetchOtherDocuments(value?.id)
}

const onLocationChange = (location) => {
  
  coordinates.latitude = location.latitude
  coordinates.longitude = location.longitude

}

const onProvinceChange = (value) => {
  formData.regency_code = ''
  formData.district_code = ''
  formData.village_code = ''
  regencies.value = []
  districts.value = []
  villages.value = []
  
  if (value) {
    fetchRegencies(value.code)
  }
}

const onRegencyChange = (value) => {
  formData.district_code = ''
  formData.village_code = ''
  districts.value = []
  villages.value = []
  
  if (value) {
    fetchDistricts(value.code)
  }
}

const onDistrictChange = (value) => {
  formData.village_code = ''
  villages.value = []
  
  if (value) {
    fetchVillages(value.value)
  }
}

const onPhotoUploadComplete = (photoData) => {
  console.log('Photo uploaded:', photoData)
  toast.value?.show('Foto berhasil diupload!', 'success')
}

const onPhotoUploadError = (error) => {
  console.error('Photo upload error:', error)
  toast.value?.show(error, 'error')
}

const validateForm = () => {
  errors.value = {}
  
  if (!formData.survey_topic_id) {
    errors.value.survey_topic_id = 'Topik survey harus dipilih'
  }
  
  if (!formData.surveyor?.trim()) {
    errors.value.surveyor = 'Nama surveyor harus diisi'
  }
  
  if (!formData.province_code) {
    errors.value.province_code = 'Provinsi harus dipilih'
  }
  
  if (!formData.regency_code) {
    errors.value.regency_code = 'Kabupaten/Kota harus dipilih'
  }
  
  if (!formData.district_code) {
    errors.value.district_code = 'Kecamatan harus dipilih'
  }
  
  if (!formData.village_code) {
    errors.value.village_code = 'Desa/Kelurahan harus dipilih'
  }
  
  if (!formData.address?.trim()) {
    errors.value.address = 'Alamat lengkap harus diisi'
  }
  
  if (!formData.phone?.trim()) {
    errors.value.phone = 'Nomor telepon harus diisi'
  }
  
  if (!coordinates.latitude || !coordinates.longitude) {
    errors.value.coordinates = 'Lokasi GPS harus dipilih'
  }
  
  if (!formData.attachments || formData.attachments.length === 0) {
    errors.value.attachments = 'Foto dokumentasi harus diupload'
  }
  
  return Object.keys(errors.value).length === 0
}

const submitSurvey = async () => {
 

  isSubmitting.value = true
  
  try {
    // Prepare submission data
    const submissionData = {
      ...formData,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    }

    console.log(coordinates)


    const response = await store.postRecord('/api/v1/survey/send', submissionData, 'store', true)
    if (response.status) {
      router.push('/sending-success')
    } else {
      console.log(response)
    }

    
  } catch (error) {
    console.error('Error submitting survey:', error)
    toast.value?.show('Terjadi kesalahan jaringan. Silakan coba lagi.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// API Functions
const fetchSurveyTopics = async () => {
  try {
    const response = await store.getCombo('/api/v1/combo/survey-topics', true)
    surveyTopics.value = response
  } catch (error) {
    console.error('Error fetching survey topics:', error)
  }
}

const fetchSurveyTopicCategories = async () => {
  try {
    const response = await store.getCombo('/api/v1/combo/survey-topic-categories/' + formData.survey_topic_id, true)
    surveyTopicCategories.value = response
  } catch (error) {
    console.error('Error fetching survey topic categories:', error)
  }
}

const fetchProvinces = async () => {
  try {
    const response = await fetch('/api/v1/provinces')
    const result = await response.json()
    
    if (response.ok) {
      provinces.value = result.data.map(province => ({
        value: province.code,
        label: province.name
      }))
    }
  } catch (error) {
    console.error('Error fetching provinces:', error)
  }
}

const fetchRegencies = async (provinceCode) => {
  try {
    const response = await fetch(`/api/v1/regencies?province_code=${provinceCode}`)
    const result = await response.json()
    
    if (response.ok) {
      regencies.value = result.data.map(regency => ({
        value: regency.code,
        label: regency.name
      }))
    }
  } catch (error) {
    console.error('Error fetching regencies:', error)
  }
}

const fetchDistricts = async (regencyCode) => {
  try {
    const response = await store.getCombo('/api/v1/combo/districts', true)
    districts.value = response
  } catch (error) {
    console.error('Error fetching districts:', error)
  }
}

const fetchVillages = async (districtCode) => {
  try {
    const response = await store.getCombo('/api/v1/combo/villages/' + districtCode, true)
    villages.value = response
  } catch (error) {
    console.error('Error fetching villages:', error)
  }
}

const fetchOtherDocuments = async () => {
  try {
    const response = await store.fetchRecords('/api/v1/survey/survey-topic-documents-all/'+ formData.survey_topic_id,{}, true)
    console.log(response)
    otherDocuments.value = response.data.data
    formData.attachments = response.data.data
  } catch (error) {
    console.error('Error fetching other documents:', error)
  }
}

const addOtherDocument = (payload, document) => {
  const object = {
          ...document,
          file_name: payload.value
        }

        if (payload.value != null) {
          // Add or update the file_name for the document with the same uuid
          const idx = formData.attachments.findIndex(item => item.uuid === document.uuid);
          if (idx !== -1) {
            formData.attachments[idx].file_name = payload.value;
          } else {
            formData.attachments.push(object);
          }
        } else {
          // If payload.value is null, update file_name to null by uuid
          const idx = formData.attachments.findIndex(item => item.uuid === document.uuid);
          if (idx !== -1) {
            formData.attachments[idx].file_name = null;
          }
        }

}

// Lifecycle
onMounted(() => {
  fetchSurveyTopics()
  fetchDistricts()
  
  // Try to get current location for initial map position
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        initialLocation.lat = position.coords.latitude
        initialLocation.lng = position.coords.longitude
      },
      (error) => {
        console.log('Could not get current location, using default')
      }
    )
  }
})
</script>

<style scoped>
/* Custom styles for better UX */
.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive grid adjustments */
@media (max-width: 768px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}

/* Map container styling */
:deep(.leaflet-container) {
  border-radius: 0.5rem;
}

/* Coordinate picker styling */
:deep(.coordinate-picker) {
  width: 100%;
}
</style>