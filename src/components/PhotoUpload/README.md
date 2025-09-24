# PhotoUpload Component

Komponen upload foto yang mendukung pengambilan dari galeri dan kamera langsung dengan preview dan manajemen foto.

## Features

### 📸 **Multiple Input Methods**
- **File Dialog** - Pilih foto dari file system
- **Camera Capture** - Ambil foto langsung dari kamera
- **Drag & Drop** - Drag foto ke area upload
- **Gallery Selection** - Pilih dari galeri perangkat

### 🖼️ **Photo Management**
- **Preview Grid** - Tampilan grid foto yang telah diupload
- **Photo Viewer** - Modal viewer dengan navigasi foto
- **Upload Progress** - Progress bar untuk setiap foto
- **Remove Photos** - Hapus foto individual
- **File Info** - Nama file, ukuran, dan dimensi

### 📱 **Camera Features**
- **Live Preview** - Preview kamera real-time
- **Switch Camera** - Ganti antara kamera depan/belakang
- **Capture & Retake** - Ambil foto dan retake jika perlu
- **Multiple Camera Support** - Deteksi kamera yang tersedia

### 🎨 **User Experience**
- **Responsive Design** - Optimized untuk mobile dan desktop
- **Loading States** - Indikator loading saat upload
- **Error Handling** - Validasi file dan error messages
- **Touch Friendly** - Optimized untuk touch devices

## Usage

```vue
<template>
  <UPhotoUpload
    v-model="photos"
    :max-files="5"
    :max-file-size="5"
    folder="survey_photos"
    @upload-complete="onUploadComplete"
    @upload-error="onUploadError"
  />
</template>

<script setup>
import { ref } from 'vue'
import { UPhotoUpload } from '@/components'

const photos = ref([])

const onUploadComplete = (photoData) => {
  console.log('Photo uploaded:', photoData)
}

const onUploadError = (error) => {
  console.error('Upload error:', error)
}
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | Array | `[]` | Array foto yang telah diupload |
| `maxFiles` | Number | `5` | Maksimal jumlah foto |
| `maxFileSize` | Number | `5` | Maksimal ukuran file (MB) |
| `accept` | String | `'image/*'` | Tipe file yang diterima |
| `folder` | String | `'photos'` | Folder penyimpanan |
| `error` | String | `''` | Pesan error untuk validasi |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `Array` | Emitted saat array foto berubah |
| `upload-complete` | `Object` | Emitted saat foto berhasil diupload |
| `upload-error` | `String` | Emitted saat terjadi error upload |

## Photo Object Structure

```javascript
{
  id: "unique_id",
  file: File,
  name: "filename.jpg",
  size: 1024000,
  preview: "blob:url",
  uploading: false,
  progress: 100,
  dimensions: "1920x1080"
}
```

## Methods

### User Actions
- **Click Upload Area** - Buka file dialog
- **Drag & Drop** - Drag foto ke area upload
- **Camera Button** - Buka modal kamera
- **Gallery Button** - Buka file dialog
- **Photo Preview** - Klik foto untuk melihat full size
- **Remove Photo** - Hapus foto dari list
- **Switch Camera** - Ganti kamera (jika tersedia)

### Camera Controls
- **Capture** - Ambil foto dari kamera
- **Retake** - Ulangi pengambilan foto
- **Switch** - Ganti kamera depan/belakang
- **Close** - Tutup modal kamera

## Styling

Komponen menggunakan Tailwind CSS dan dapat dikustomisasi:

```css
/* Custom upload area */
.photo-upload-container :deep(.upload-area) {
  @apply border-blue-500;
}

/* Custom photo grid */
.photo-upload-container :deep(.photo-grid) {
  @apply grid-cols-3;
}

/* Custom camera modal */
.photo-upload-container :deep(.camera-overlay) {
  @apply bg-black bg-opacity-95;
}
```

## Browser Support

### Required APIs
- **File API** - Untuk file selection dan preview
- **MediaDevices API** - Untuk akses kamera
- **Canvas API** - Untuk capture foto dari video
- **Clipboard API** - Untuk copy/paste (optional)

### Browser Compatibility
- **Chrome** 53+ ✅
- **Firefox** 36+ ✅
- **Safari** 11+ ✅
- **Edge** 79+ ✅
- **Mobile Safari** 11+ ✅
- **Chrome Mobile** 53+ ✅

## Security & Privacy

### Camera Permissions
- Meminta izin akses kamera secara eksplisit
- Menampilkan error jika izin ditolak
- Auto-close modal jika kamera tidak tersedia

### File Validation
- Validasi tipe file (hanya image/*)
- Validasi ukuran file
- Validasi jumlah file maksimal
- Sanitasi nama file

### Data Handling
- Object URLs untuk preview (auto-cleanup)
- Blob URLs untuk temporary storage
- No persistent storage di browser

## Performance

### Optimization Features
- **Lazy Loading** - Preview hanya saat diperlukan
- **Memory Management** - Auto-cleanup object URLs
- **Progressive Upload** - Upload progress simulation
- **Responsive Images** - Auto-resize untuk preview

### Mobile Optimization
- **Touch Events** - Optimized untuk touch devices
- **Responsive Layout** - Adaptive grid layout
- **Camera Integration** - Native camera experience
- **File Size Limits** - Prevent memory issues

## Error Handling

### Validation Errors
- File type validation
- File size validation
- File count validation
- Camera permission errors

### User Feedback
- Error messages dengan detail
- Loading states untuk setiap action
- Success notifications
- Progress indicators

## Accessibility

### Screen Reader Support
- Proper ARIA labels
- Alt text untuk images
- Keyboard navigation
- Focus management

### Visual Indicators
- Clear upload areas
- Loading animations
- Error highlighting
- Success feedback

## Integration Examples

### With Form Validation
```vue
<UPhotoUpload
  v-model="form.photos"
  :error="errors.photos"
  @upload-error="handleUploadError"
/>
```

### With API Upload
```vue
<UPhotoUpload
  v-model="photos"
  @upload-complete="uploadToServer"
  folder="user_uploads"
/>
```

### With Custom Styling
```vue
<UPhotoUpload
  v-model="photos"
  class="custom-photo-upload"
  :max-files="10"
  :max-file-size="10"
/>
```

## Notes

- Komponen memerlukan HTTPS untuk akses kamera
- File preview menggunakan Object URLs
- Camera stream auto-cleanup saat komponen di-unmount
- Drag & drop support untuk modern browsers
- Mobile-optimized dengan touch-friendly controls
