# 🎨 Sistem Tema Dinamis

Sistem tema yang memungkinkan pengguna mengubah warna aplikasi secara real-time dengan penyimpanan otomatis di localStorage.

## ✨ Fitur Utama

- **8 Tema Warna**: cyan, blue, indigo, purple, teal, orange, red, green
- **Penyimpanan Otomatis**: Tema disimpan di localStorage
- **Komponen Dinamis**: Semua komponen menggunakan tema yang aktif
- **Backward Compatibility**: Tetap kompatibel dengan sistem warna lama
- **Theme Switcher**: Komponen dropdown untuk mengubah tema

## 🚀 Cara Menggunakan

### 1. Mengubah Tema
- Klik dropdown tema di header aplikasi
- Pilih tema yang diinginkan
- Tema akan langsung berubah dan tersimpan

### 2. Menggunakan Tema di Komponen

```vue
<template>
  <div>
    <button 
      class="px-4 py-2 rounded"
      :class="[
        `bg-${themeColors.primary}-600`,
        `hover:bg-${themeColors.primary}-700`,
        `text-white`
      ]"
    >
      Button dengan Tema
    </button>
  </div>
</template>

<script>
import { useAppStore } from "@/store/app";
import { computed } from "vue";

export default {
  setup() {
    const store = useAppStore();
    const themeColors = computed(() => store.getThemeColors);
    
    return { themeColors };
  }
};
</script>
```

### 3. Mengubah Tema Programmatically

```javascript
import { useAppStore } from "@/store/app";

const store = useAppStore();

// Mengubah tema
store.setTheme('blue');

// Mendapatkan warna tema saat ini
const colors = store.getThemeColors;
console.log(colors.primary); // 'blue'
```

## 🎯 Tema yang Tersedia

| Tema | Warna Utama | Kode |
|------|-------------|------|
| 🟢 Cyan | Cyan | `cyan` |
| 🔵 Blue | Blue | `blue` |
| 🟣 Indigo | Indigo | `indigo` |
| 🟪 Purple | Purple | `purple` |
| 🟦 Teal | Teal | `teal` |
| 🟠 Orange | Orange | `orange` |
| 🔴 Red | Red | `red` |
| 🟢 Green | Green | `green` |

## 📁 File yang Diperbarui

### Konfigurasi
- `src/config/variable.js` - Definisi tema dan warna
- `src/store/app.js` - Store dengan sistem tema

### Komponen
- `src/components/FormDialog/index.vue` - Dialog dengan tema dinamis
- `src/components/ThemeSwitcher/index.vue` - Komponen pengubah tema
- `src/components/ThemeDemo/index.vue` - Demo penggunaan tema
- `src/layouts/base.vue` - Layout utama dengan tema dinamis

### Routing
- `src/router/index.js` - Route untuk demo tema

## 🔧 Struktur Warna

Setiap tema memiliki struktur warna yang konsisten:

```javascript
{
  primary: "cyan",           // Warna utama
  primaryLight: "cyan-lighten-5", // Warna utama terang
  primaryDark: "cyan-darken-5",   // Warna utama gelap
  success: "green-darken-2",      // Warna sukses
  error: "red",                   // Warna error
  warning: "orange-darken-4",     // Warna warning
  refresh: "blue",                // Warna refresh
  add: "green",                   // Warna tambah
  edit: "orange",                 // Warna edit
  download: "blue",               // Warna download
  delete: "red",                  // Warna hapus
  help: "grey",                   // Warna bantuan
  back: "cyan",                   // Warna kembali
  dot: "white",                   // Warna dot
  title: "white",                 // Warna judul
  subtitle: "grey"                // Warna sub judul
}
```

## 🎨 Tips Penggunaan

### 1. Konsistensi Warna
```vue
<!-- Gunakan primary untuk elemen utama -->
<div :class="`bg-${themeColors.primary}-100`">
  <h3 :class="`text-${themeColors.primary}-900`">Judul</h3>
</div>
```

### 2. Status Warna
```vue
<!-- Gunakan warna status yang sesuai -->
<button :class="`bg-${themeColors.success}`">Sukses</button>
<button :class="`bg-${themeColors.error}`">Error</button>
<button :class="`bg-${themeColors.warning}`">Warning</button>
```

### 3. Aksi Warna
```vue
<!-- Gunakan warna aksi yang sesuai -->
<button :class="`bg-${themeColors.add}`">Tambah</button>
<button :class="`bg-${themeColors.edit}`">Edit</button>
<button :class="`bg-${themeColors.delete}`">Hapus</button>
```

## 🔄 Menambahkan Tema Baru

1. Edit file `src/config/variable.js`
2. Tambahkan tema baru ke objek `THEMES`:

```javascript
const THEMES = {
  // ... tema yang ada
  pink: {
    name: "pink",
    primary: "pink",
    primaryLight: "pink-lighten-5",
    primaryDark: "pink-darken-5",
    success: "green-darken-2",
    error: "red",
    warning: "orange-darken-4",
    refresh: "blue",
    add: "green",
    edit: "orange",
    download: "blue",
    delete: "red",
    help: "grey",
    back: "pink",
    dot: "white",
    title: "white",
    subtitle: "grey",
  },
};
```

## 🧪 Demo

Akses halaman demo tema di: `/auth/logged/theme-demo`

Halaman ini menampilkan:
- Palette warna tema
- Contoh tombol dengan tema
- Contoh card dengan tema
- Status indicators
- Panduan penggunaan

## 🔒 Backward Compatibility

Sistem ini tetap kompatibel dengan kode lama yang menggunakan:

```javascript
import { colors } from "@/config/variable";

// Masih berfungsi
const primaryColor = colors.COLOR_PRIMARY;
```

## 📝 Dokumentasi Lengkap

Lihat file `THEME_GUIDE.md` untuk dokumentasi lengkap sistem tema.

## 🎯 Contoh Implementasi Lengkap

```vue
<template>
  <div class="card">
    <!-- Header dengan tema -->
    <div class="card-header" :class="`bg-${themeColors.primary}-100`">
      <h3 :class="`text-${themeColors.primary}-900`">{{ title }}</h3>
    </div>
    
    <!-- Body -->
    <div class="card-body">
      <p class="text-gray-600">{{ content }}</p>
      
      <!-- Actions dengan tema -->
      <div class="flex gap-2 mt-4">
        <button 
          class="px-3 py-1 rounded text-sm"
          :class="`bg-${themeColors.add} hover:bg-green-700 text-white`"
        >
          Tambah
        </button>
        <button 
          class="px-3 py-1 rounded text-sm"
          :class="`bg-${themeColors.edit} hover:bg-orange-700 text-white`"
        >
          Edit
        </button>
        <button 
          class="px-3 py-1 rounded text-sm"
          :class="`bg-${themeColors.delete} hover:bg-red-700 text-white`"
        >
          Hapus
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useAppStore } from "@/store/app";
import { computed } from "vue";

export default {
  props: {
    title: String,
    content: String,
  },
  setup() {
    const store = useAppStore();
    const themeColors = computed(() => store.getThemeColors);
    
    return { themeColors };
  }
};
</script>
```

---

**Sistem tema ini memberikan fleksibilitas maksimal dalam mengubah warna aplikasi sambil menjaga konsistensi dan kemudahan penggunaan.** 