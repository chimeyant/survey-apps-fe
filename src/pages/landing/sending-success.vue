<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-4xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <i class="ri-government-line text-white text-xl"></i>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Survey Data</h1>
              <p class="text-sm text-gray-600">Kabupaten Tangerang</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">Tanggal: {{ formatDate(new Date()) }}</p>
            <p class="text-sm text-gray-500">Waktu: {{ formatTime(new Date()) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 py-12">
      <!-- Success Section -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <div class="text-center">
          <!-- Success Icon -->
          <div class="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <i class="ri-check-line text-5xl text-green-600"></i>
          </div>
          
          <!-- Thank You Message -->
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            Terima Kasih!
          </h1>
          
          <p class="text-xl text-gray-600 mb-6 leading-relaxed">
            Survey Anda telah berhasil dikirim. Data yang Anda berikan sangat berharga untuk meningkatkan kualitas pelayanan publik di Kabupaten Tangerang.
          </p>
          
          <!-- Survey ID -->
          <div class="bg-gray-50 rounded-lg p-4 inline-block">
            <p class="text-sm text-gray-500 mb-1">ID Survey</p>
            <p class="text-lg font-mono font-bold text-gray-900">{{ surveyId }}</p>
          </div>
        </div>
      </div>

      <!-- Information Cards -->
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <!-- What Happens Next -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <i class="ri-lightbulb-line text-2xl text-blue-600"></i>
            </div>
            <h2 class="text-xl font-bold text-gray-900">Langkah Selanjutnya</h2>
          </div>
          <div class="space-y-3">
            <div class="flex items-start">
              <i class="ri-checkbox-circle-line text-green-500 mt-1 mr-3 text-sm"></i>
              <p class="text-gray-700">Data akan dianalisis oleh tim evaluasi pelayanan</p>
            </div>
            <div class="flex items-start">
              <i class="ri-checkbox-circle-line text-green-500 mt-1 mr-3 text-sm"></i>
              <p class="text-gray-700">Identifikasi area yang perlu perbaikan</p>
            </div>
            <div class="flex items-start">
              <i class="ri-checkbox-circle-line text-green-500 mt-1 mr-3 text-sm"></i>
              <p class="text-gray-700">Penyusunan rencana peningkatan pelayanan</p>
            </div>
            <div class="flex items-start">
              <i class="ri-checkbox-circle-line text-green-500 mt-1 mr-3 text-sm"></i>
              <p class="text-gray-700">Implementasi perbaikan berdasarkan masukan</p>
            </div>
          </div>
        </div>

        <!-- Impact Information -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <i class="ri-heart-line text-2xl text-green-600"></i>
            </div>
            <h2 class="text-xl font-bold text-gray-900">Dampak Positif</h2>
          </div>
          <div class="space-y-3">
            <div class="flex items-start">
              <i class="ri-arrow-right-line text-blue-500 mt-1 mr-3 text-sm"></i>
              <p class="text-gray-700">Meningkatkan kualitas pelayanan publik</p>
            </div>
            <div class="flex items-start">
              <i class="ri-arrow-right-line text-blue-500 mt-1 mr-3 text-sm"></i>
              <p class="text-gray-700">Mempercepat proses administrasi</p>
            </div>
            <div class="flex items-start">
              <i class="ri-arrow-right-line text-blue-500 mt-1 mr-3 text-sm"></i>
              <p class="text-gray-700">Meningkatkan kepuasan masyarakat</p>
            </div>
            <div class="flex items-start">
              <i class="ri-arrow-right-line text-blue-500 mt-1 mr-3 text-sm"></i>
              <p class="text-gray-700">Membangun kepercayaan publik</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Section -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8" v-show="false">
        <h2 class="text-2xl font-bold text-gray-900 text-center mb-8">
          Partisipasi Survey Pelayanan
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600 mb-2">4,256</div>
            <p class="text-sm text-gray-600">Survey Terkumpul</p>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600 mb-2">29</div>
            <p class="text-sm text-gray-600">Kecamatan</p>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-600 mb-2">92%</div>
            <p class="text-sm text-gray-600">Kepuasan Masyarakat</p>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-orange-600 mb-2">15</div>
            <p class="text-sm text-gray-600">Jenis Pelayanan</p>
          </div>
        </div>
      </div>

      <!-- Services Covered -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8" v-show="false">
        <h2 class="text-2xl font-bold text-gray-900 text-center mb-8">
          Jenis Pelayanan yang Dievaluasi
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <i class="ri-file-text-line text-2xl text-blue-600 mb-2"></i>
            <p class="text-sm font-medium text-gray-700">Administrasi Kependudukan</p>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <i class="ri-building-line text-2xl text-green-600 mb-2"></i>
            <p class="text-sm font-medium text-gray-700">Perizinan Bangunan</p>
          </div>
          <div class="text-center p-4 bg-purple-50 rounded-lg">
            <i class="ri-car-line text-2xl text-purple-600 mb-2"></i>
            <p class="text-sm font-medium text-gray-700">Pelayanan Kendaraan</p>
          </div>
          <div class="text-center p-4 bg-orange-50 rounded-lg">
            <i class="ri-health-book-line text-2xl text-orange-600 mb-2"></i>
            <p class="text-sm font-medium text-gray-700">Kesehatan</p>
          </div>
          <div class="text-center p-4 bg-red-50 rounded-lg">
            <i class="ri-school-line text-2xl text-red-600 mb-2"></i>
            <p class="text-sm font-medium text-gray-700">Pendidikan</p>
          </div>
          <div class="text-center p-4 bg-indigo-50 rounded-lg">
            <i class="ri-community-line text-2xl text-indigo-600 mb-2"></i>
            <p class="text-sm font-medium text-gray-700">Sosial</p>
          </div>
          <div class="text-center p-4 bg-pink-50 rounded-lg">
            <i class="ri-hand-coin-line text-2xl text-pink-600 mb-2"></i>
            <p class="text-sm font-medium text-gray-700">Ekonomi</p>
          </div>
          <div class="text-center p-4 bg-teal-50 rounded-lg">
            <i class="ri-road-map-line text-2xl text-teal-600 mb-2"></i>
            <p class="text-sm font-medium text-gray-700">Infrastruktur</p>
          </div>
          <div class="text-center p-4 bg-cyan-50 rounded-lg">
            <i class="ri-shield-check-line text-2xl text-cyan-600 mb-2"></i>
            <p class="text-sm font-medium text-gray-700">Keamanan</p>
          </div>
          <div class="text-center p-4 bg-yellow-50 rounded-lg">
            <i class="ri-leaf-line text-2xl text-yellow-600 mb-2"></i>
            <p class="text-sm font-medium text-gray-700">Lingkungan</p>
          </div>
        </div>
      </div>

      <!-- Timeline Section -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 text-center mb-8">
          Timeline Peningkatan Pelayanan
        </h2>
        <div class="relative">
          <!-- Timeline Line -->
          <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <!-- Timeline Items -->
          <div class="space-y-8">
            <div class="relative flex items-start">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-6 relative z-10">
                <i class="ri-check-line text-2xl text-green-600"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Pengumpulan Data</h3>
                <p class="text-gray-600 mb-2">Survey dan evaluasi pelayanan publik</p>
                <span class="text-sm text-green-600 font-medium">Selesai</span>
              </div>
            </div>
            
            <div class="relative flex items-start">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-6 relative z-10">
                <i class="ri-calendar-line text-2xl text-blue-600"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Analisis & Perencanaan</h3>
                <p class="text-gray-600 mb-2">Analisis data dan penyusunan rencana perbaikan</p>
                <span class="text-sm text-blue-600 font-medium">Dalam Proses</span>
              </div>
            </div>
            
            <div class="relative flex items-start">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mr-6 relative z-10">
                <i class="ri-tools-line text-2xl text-gray-600"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Implementasi</h3>
                <p class="text-gray-600 mb-2">Penerapan perbaikan sistem pelayanan</p>
                <span class="text-sm text-gray-500 font-medium">Q2 2025</span>
              </div>
            </div>
            
            <div class="relative flex items-start">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mr-6 relative z-10">
                <i class="ri-rocket-line text-2xl text-gray-600"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Evaluasi & Monitoring</h3>
                <p class="text-gray-600 mb-2">Pemantauan dan evaluasi berkelanjutan</p>
                <span class="text-sm text-gray-500 font-medium">Q3 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact & Support -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 text-center mb-8">
          Butuh Bantuan?
        </h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="text-center p-6 bg-blue-50 rounded-lg">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="ri-phone-line text-2xl text-blue-600"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Call Center</h3>
            <p class="text-gray-600 mb-3">Hubungi kami untuk bantuan pelayanan</p>
            <a href="tel:+6281234567890" class="text-blue-600 font-medium hover:underline">
              (021) 1234-5678
            </a>
          </div>
          
          <div class="text-center p-6 bg-green-50 rounded-lg">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="ri-whatsapp-line text-2xl text-green-600"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">WhatsApp</h3>
            <p class="text-gray-600 mb-3">Chat langsung dengan customer service</p>
            <a href="https://wa.me/6281234567890" class="text-green-600 font-medium hover:underline">
              +62 812-3456-7890
            </a>
          </div>
          
          <div class="text-center p-6 bg-purple-50 rounded-lg">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="ri-mail-line text-2xl text-purple-600"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Email</h3>
            <p class="text-gray-600 mb-3">Kirim pertanyaan detail via email</p>
            <a href="mailto:survey@tangerangkab.go.id" class="text-purple-600 font-medium hover:underline">
              survey@tangerangkab.go.id
            </a>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="text-center">
        <div class="space-y-4">
          <UButton
            @click="goToHome"
            class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium text-lg mr-4"
          >
            <i class="ri-home-line mr-2"></i>
            Kembali ke Beranda
          </UButton>
          
          <UButton
            @click="goToSurvey"
            variant="outline"
            class="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-medium text-lg"
          >
            <i class="ri-survey-line mr-2"></i>
            Isi Survey Lain
          </UButton>
        </div>
        
        <p class="text-sm text-gray-500 mt-6">
          Terima kasih telah berkontribusi dalam meningkatkan kualitas pelayanan publik Kabupaten Tangerang.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <div class="flex items-center justify-center mb-4">
          <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
            <i class="ri-government-line text-white"></i>
          </div>
          <h3 class="text-lg font-semibold">Survey Data Kabupaten Tangerang</h3>
        </div>
        <p class="text-gray-400 text-sm mb-4">
          Meningkatkan kualitas pelayanan publik melalui partisipasi masyarakat yang aktif dan konstruktif.
        </p>
        <div class="flex justify-center space-x-6 text-sm text-gray-400">
          <a href="#" class="hover:text-white">Privacy Policy</a>
          <a href="#" class="hover:text-white">Terms of Service</a>
          <a href="#" class="hover:text-white">Contact Us</a>
        </div>
        <p class="text-xs text-gray-500 mt-4">
          © 2024 Survey Data Kabupaten Tangerang. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { UButton } from '@/components'

const router = useRouter()
const route = useRoute()
const surveyId = ref('')

const formatDate = (date) => {
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (date) => {
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const goToHome = () => {
  router.push('/')
}

const goToSurvey = () => {
  router.push('/survey')
}

const generateSurveyId = () => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `SRV-${timestamp.toUpperCase()}-${random.toUpperCase()}`
}

onMounted(() => {
    window.scrollTo(0, 0)
  surveyId.value = route.params.id || route.query.id || generateSurveyId()
})
</script>

<style scoped>
/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes checkmark {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Apply animations */
.min-h-screen {
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

.ri-check-line {
  animation: checkmark 0.8s ease-in-out;
}

.bg-white {
  animation: fadeInUp 0.6s ease-out;
}

/* Hover effects */
.hover\:bg-blue-50:hover {
  background-color: #eff6ff;
}

.hover\:text-white:hover {
  color: white;
}

.hover\:underline:hover {
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .text-4xl {
    font-size: 2rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
  }
  
  .p-8 {
    padding: 1.5rem;
  }
  
  .grid-cols-2 {
    grid-template-columns: repeat(1, 1fr);
  }
  
  .md\:grid-cols-2 {
    grid-template-columns: repeat(1, 1fr);
  }
  
  .md\:grid-cols-3 {
    grid-template-columns: repeat(1, 1fr);
  }
  
  .md\:grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .lg\:grid-cols-5 {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>