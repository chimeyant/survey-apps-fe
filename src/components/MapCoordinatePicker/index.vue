<template>
  <div class="coordinate-picker">
    <!-- Input Fields -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Latitude <span class="text-red-500">*</span>
        </label>
        <UTextField
          v-model="latitude"
          placeholder="Masukkan Latitude"
          @input="onCoordinateChange"
          :error="errorLatitude"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Longitude <span class="text-red-500">*</span>
        </label>
        <UTextField
          v-model="longitude"
          placeholder="Masukkan Longitude"
          @input="onCoordinateChange"
          :error="errorLongitude"
        />
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-wrap gap-2 mb-4">
      <UButton
        type="button"
        variant="outline"
        size="sm"
        @click="getCurrentLocation"
        :loading="isGettingLocation"
      >
        📍 Lokasi Saat Ini
      </UButton>
      <UButton
        type="button"
        variant="outline"
        size="sm"
        @click="centerMapOnInput"
        :disabled="!isValidCoordinates"
      >
        🗺️ Lihat di Peta
      </UButton>
      <UButton
        type="button"
        variant="outline"
        size="sm"
        @click="copyCoordinates"
        :disabled="!isValidCoordinates"
      >
        📋 Salin Koordinat
      </UButton>
    </div>

    <!-- Map Container -->
    <div class="map-container border border-gray-300 rounded-lg overflow-hidden">
      <l-map
        ref="map"
        style="height: 400px; width: 100%;"
        :zoom="zoom"
        :center="mapCenter"
        @click="onMapClick"
        @ready="onMapReady"
      >
        <l-tile-layer
          :url="tileUrl"
          :attribution="attribution"
        />
        
        <!-- Marker for selected location -->
        <l-marker
          v-if="markerPosition"
          :lat-lng="markerPosition"
          :draggable="true"
          @moveend="onMarkerMove"
        >
          <l-popup>
            <div class="text-center">
              <p class="font-semibold">Lokasi Terpilih</p>
              <p class="text-sm text-gray-600">
                Lat: {{ markerPosition[0].toFixed(6) }}<br>
                Lng: {{ markerPosition[1].toFixed(6) }}
              </p>
              <UButton
                type="button"
                size="sm"
                @click="useMarkerPosition"
                class="mt-2"
              >
                Gunakan Lokasi Ini
              </UButton>
            </div>
          </l-popup>
        </l-marker>

        <!-- Current location marker (if available) -->
        <l-marker
          v-if="currentLocation"
          :lat-lng="currentLocation"
          :icon="currentLocationIcon"
        >
          <l-popup>
            <div class="text-center">
              <p class="font-semibold text-blue-600">📍 Lokasi Anda</p>
              <p class="text-sm text-gray-600">
                Lat: {{ currentLocation[0].toFixed(6) }}<br>
                Lng: {{ currentLocation[1].toFixed(6) }}
              </p>
            </div>
          </l-popup>
        </l-marker>
      </l-map>
    </div>

    <!-- Map Controls -->
    <div class="flex justify-between items-center mt-3 text-sm text-gray-600">
      <div>
        <span class="font-medium">Petunjuk:</span>
        Klik di peta untuk memilih lokasi, atau drag marker untuk memindahkan posisi
      </div>
      <div class="flex gap-4">
        <label class="flex items-center">
          <input
            type="checkbox"
            v-model="showSatellite"
            @change="toggleMapType"
            class="mr-1"
          >
          Satelit
        </label>
        <label class="flex items-center">
          <input
            type="checkbox"
            v-model="autoCenter"
            class="mr-1"
          >
          Auto Center
        </label>
      </div>
    </div>

    <!-- Coordinate Info -->
    <div v-if="markerPosition" class="mt-3 p-3 bg-blue-50 rounded-lg">
      <div class="flex justify-between items-center">
        <div>
          <p class="text-sm font-medium text-blue-900">Koordinat Terpilih:</p>
          <p class="text-sm text-blue-700">
            {{ markerPosition[0].toFixed(6) }}, {{ markerPosition[1].toFixed(6) }}
          </p>
        </div>
        <UButton
          type="button"
          size="sm"
          variant="outline"
          @click="clearSelection"
        >
          Hapus Pilihan
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet"
import L from 'leaflet'
import { UButton, UTextField } from '@/components'

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ latitude: '', longitude: '' })
  },
  initialLocation: {
    type: Object,
    default: () => ({ lat: -6.2088, lng: 106.8456 }) // Jakarta coordinates as default
  },
  error: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'location-change'])

// Reactive data
const latitude = ref(props.modelValue.latitude || '')
const longitude = ref(props.modelValue.longitude || '')
const isGettingLocation = ref(false)
const showSatellite = ref(false)
const autoCenter = ref(true)
const currentLocation = ref(null)
const map = ref(null)

// Map state
const zoom = ref(13)
const mapCenter = ref([props.initialLocation.lat, props.initialLocation.lng])
const markerPosition = ref(null)

// Map configuration
const tileUrl = ref("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
const attribution = ref('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors')

// Create custom icon for current location
const currentLocationIcon = L.divIcon({
  html: '<div class="current-location-marker">📍</div>',
  iconSize: [30, 30],
  className: 'current-location-icon'
})

// Computed properties
const isValidCoordinates = computed(() => {
  const lat = parseFloat(latitude.value)
  const lng = parseFloat(longitude.value)
  return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
})

const errorLatitude = computed(() => {
  if (!latitude.value) return ''
  const lat = parseFloat(latitude.value)
  if (isNaN(lat)) return 'Latitude harus berupa angka'
  if (lat < -90 || lat > 90) return 'Latitude harus antara -90 dan 90'
  return ''
})

const errorLongitude = computed(() => {
  if (!longitude.value) return ''
  const lng = parseFloat(longitude.value)
  if (isNaN(lng)) return 'Longitude harus berupa angka'
  if (lng < -180 || lng > 180) return 'Longitude harus antara -180 dan 180'
  return ''
})

// Methods
const onCoordinateChange = () => {
  emit('update:modelValue', {
    latitude: latitude.value,
    longitude: longitude.value
  })
}

const onMapClick = (event) => {
  const { lat, lng } = event.latlng
  markerPosition.value = [lat, lng]
  latitude.value = lat.toFixed(6)
  longitude.value = lng.toFixed(6)
  onCoordinateChange()
  
  if (autoCenter.value) {
    mapCenter.value = [lat, lng]
  }
}

const onMarkerMove = (event) => {
  const { lat, lng } = event.target.getLatLng()
  markerPosition.value = [lat, lng]
  latitude.value = lat.toFixed(6)
  longitude.value = lng.toFixed(6)
  onCoordinateChange()
}

const onMapReady = () => {
  // Get current location when map is ready
  getCurrentLocation()
}

const getCurrentLocation = () => {
  isGettingLocation.value = true
  
  if (!navigator.geolocation) {
    console.warn('Geolocation tidak didukung')
    isGettingLocation.value = false
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude
      
      currentLocation.value = [lat, lng]
      
      // If no marker is set, use current location
      if (!markerPosition.value) {
        markerPosition.value = [lat, lng]
        latitude.value = lat.toFixed(6)
        longitude.value = lng.toFixed(6)
        onCoordinateChange()
      }
      
      // Center map on current location
      if (autoCenter.value) {
        mapCenter.value = [lat, lng]
      }
      
      isGettingLocation.value = false
    },
    (error) => {
      console.warn('Error getting location:', error.message)
      isGettingLocation.value = false
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    }
  )
}

const centerMapOnInput = () => {
  if (isValidCoordinates.value) {
    const lat = parseFloat(latitude.value)
    const lng = parseFloat(longitude.value)
    
    markerPosition.value = [lat, lng]
    mapCenter.value = [lat, lng]
  }
}

const useMarkerPosition = () => {
  if (markerPosition.value) {
    latitude.value = markerPosition.value[0].toFixed(6)
    longitude.value = markerPosition.value[1].toFixed(6)
    onCoordinateChange()
  }
}

const clearSelection = () => {
  markerPosition.value = null
  latitude.value = ''
  longitude.value = ''
  onCoordinateChange()
}

const copyCoordinates = () => {
  if (isValidCoordinates.value) {
    const coords = `${latitude.value}, ${longitude.value}`
    navigator.clipboard.writeText(coords).then(() => {
      // You can add a toast notification here
      console.log('Koordinat disalin ke clipboard')
    })
  }
}

const toggleMapType = () => {
  if (showSatellite.value) {
    tileUrl.value = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    attribution.value = '&copy; <a href="https://www.esri.com/">Esri</a>'
  } else {
    tileUrl.value = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution.value = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    latitude.value = newValue.latitude || ''
    longitude.value = newValue.longitude || ''
    
    if (newValue.latitude && newValue.longitude) {
      const lat = parseFloat(newValue.latitude)
      const lng = parseFloat(newValue.longitude)
      
      if (!isNaN(lat) && !isNaN(lng)) {
        markerPosition.value = [lat, lng]
        if (autoCenter.value) {
          mapCenter.value = [lat, lng]
        }
      }
    }
  }
}, { deep: true })

// Lifecycle
onMounted(() => {
  // Initialize with current location or default
  nextTick(() => {
    if (navigator.geolocation) {
      getCurrentLocation()
    } else {
      // Use default location (Tangerang)
      mapCenter.value = [props.initialLocation.lat, props.initialLocation.lng]
    }
  })
})
</script>

<style scoped>
.coordinate-picker {
  @apply w-full;
}

.map-container {
  @apply relative;
}

.current-location-marker {
  @apply text-2xl;
}

.current-location-icon {
  @apply bg-transparent border-0;
}

/* Leaflet popup customization */
:deep(.leaflet-popup-content) {
  @apply text-center;
}

:deep(.leaflet-popup-content-wrapper) {
  @apply rounded-lg;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .coordinate-picker :deep(.leaflet-container) {
    height: 300px !important;
  }
}
</style>
