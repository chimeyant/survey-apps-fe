# MapCoordinatePicker Component

Komponen interaktif untuk memilih koordinat GPS dengan peta yang dapat diklik.

## Features

### 🗺️ **Map Integration**
- **Leaflet Map** - Menggunakan Vue Leaflet untuk rendering peta
- **Click to Select** - Klik di peta untuk memilih lokasi
- **Draggable Marker** - Drag marker untuk memindahkan posisi
- **Current Location** - Auto-detect lokasi pengguna saat ini
- **Map Types** - Toggle antara peta biasa dan satelit

### 📍 **Coordinate Input**
- **Manual Input** - Input latitude/longitude secara manual
- **Auto Sync** - Sinkronisasi otomatis antara input dan peta
- **Validation** - Validasi koordinat real-time
- **Copy Function** - Salin koordinat ke clipboard

### 🎛️ **Controls & Features**
- **Auto Center** - Otomatis center peta pada lokasi terpilih
- **Current Location Marker** - Marker khusus untuk lokasi pengguna
- **Coordinate Info** - Display informasi koordinat yang terpilih
- **Clear Selection** - Hapus pilihan lokasi
- **Responsive Design** - Responsif untuk mobile dan desktop

## Usage

```vue
<template>
  <UMapCoordinatePicker
    v-model="coordinates"
    :initial-location="{ lat: -6.1783, lng: 106.6319 }"
    @location-change="onLocationChange"
    :error="coordinateError"
  />
</template>

<script setup>
import { reactive } from 'vue'
import { UMapCoordinatePicker } from '@/components'

const coordinates = reactive({
  latitude: '',
  longitude: ''
})

const onLocationChange = (location) => {
  console.log('Location changed:', location)
}
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | Object | `{ latitude: '', longitude: '' }` | Koordinat yang dipilih |
| `initialLocation` | Object | `{ lat: -6.2088, lng: 106.8456 }` | Lokasi awal peta |
| `error` | String | `''` | Pesan error untuk validasi |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `{ latitude: string, longitude: string }` | Emitted saat koordinat berubah |
| `location-change` | `{ latitude: string, longitude: string }` | Emitted saat lokasi berubah |

## Methods

### User Actions
- **Click Map** - Klik di peta untuk memilih lokasi
- **Drag Marker** - Drag marker untuk memindahkan posisi
- **Get Current Location** - Tombol untuk mendapatkan lokasi saat ini
- **Manual Input** - Input koordinat secara manual
- **Copy Coordinates** - Salin koordinat ke clipboard

### Map Controls
- **Toggle Satellite** - Switch antara peta biasa dan satelit
- **Auto Center** - Enable/disable auto center
- **Clear Selection** - Hapus pilihan lokasi

## Styling

Komponen menggunakan Tailwind CSS untuk styling dan dapat dikustomisasi melalui CSS variables atau deep selectors.

```css
/* Custom map height */
.coordinate-picker :deep(.leaflet-container) {
  height: 300px !important;
}

/* Custom marker styling */
.coordinate-picker :deep(.leaflet-marker-icon) {
  border-radius: 50%;
}
```

## Dependencies

- `@vue-leaflet/vue-leaflet` - Vue wrapper untuk Leaflet
- `leaflet` - JavaScript library untuk peta interaktif
- `@/components` - Komponen UI internal (UButton, UTextField)

## Browser Support

- **Geolocation API** - Untuk fitur "Lokasi Saat Ini"
- **Clipboard API** - Untuk fitur "Salin Koordinat"
- **Modern Browsers** - Chrome, Firefox, Safari, Edge

## Notes

- Komponen memerlukan Leaflet CSS untuk styling yang benar
- Geolocation memerlukan HTTPS atau localhost
- Map tiles menggunakan OpenStreetMap dan Esri
- Koordinat disimpan dalam format string dengan 6 desimal
