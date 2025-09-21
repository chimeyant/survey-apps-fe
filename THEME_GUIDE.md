# Sistem Tema Dinamis

Sistem tema ini memungkinkan Anda untuk mengubah warna aplikasi secara mudah melalui store. Tema akan disimpan di localStorage sehingga akan tetap konsisten saat refresh halaman.

## Fitur

- ✅ 8 tema warna yang berbeda (cyan, blue, indigo, purple, teal, orange, red, green)
- ✅ Penyimpanan tema di localStorage
- ✅ Komponen ThemeSwitcher untuk mengubah tema
- ✅ Integrasi dengan semua komponen yang ada
- ✅ Backward compatibility dengan sistem warna lama

## Cara Menggunakan

### 1. Menggunakan ThemeSwitcher

Komponen `UThemeSwitcher` sudah ditambahkan ke header aplikasi. Pengguna dapat mengklik dropdown untuk memilih tema yang diinginkan.

### 2. Menggunakan Tema di Komponen

```vue
<template>
  <div>
    <!-- Menggunakan warna tema -->
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
    
    return {
      themeColors
    };
  }
};
</script>
```

### 3. Mengubah Tema Programmatically

```javascript
import { useAppStore } from "@/store/app";

const store = useAppStore();

// Mengubah tema
store.setTheme('blue'); // atau 'indigo', 'purple', dll.

// Mendapatkan warna tema saat ini
const colors = store.getThemeColors;
console.log(colors.primary); // 'blue'
```

## Tema yang Tersedia

| Nama Tema | Warna Utama | Kode |
|-----------|-------------|------|
| Cyan | Cyan | `cyan` |
| Blue | Blue | `blue` |
| Indigo | Indigo | `indigo` |
| Purple | Purple | `purple` |
| Teal | Teal | `teal` |
| Orange | Orange | `orange` |
| Red | Red | `red` |
| Green | Green | `green` |

## Struktur Warna Tema

Setiap tema memiliki struktur warna berikut:

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

## Menambahkan Tema Baru

Untuk menambahkan tema baru, edit file `src/config/variable.js`:

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

## Komponen yang Sudah Diupdate

- ✅ `FormDialog` - Dialog form dengan tema dinamis
- ✅ `Base Layout` - Layout utama dengan tema dinamis
- ✅ `ThemeSwitcher` - Komponen untuk mengubah tema

## Backward Compatibility

Sistem ini tetap kompatibel dengan kode lama yang menggunakan `colors` dari `@/config/variable`. Warna default akan menggunakan tema yang aktif.

## Tips Penggunaan

1. **Konsistensi**: Gunakan `themeColors.primary` untuk elemen utama
2. **Kontras**: Gunakan `themeColors.primaryLight` untuk background dan `themeColors.primaryDark` untuk teks
3. **Status**: Gunakan `themeColors.success`, `themeColors.error`, `themeColors.warning` untuk status
4. **Aksi**: Gunakan `themeColors.add`, `themeColors.edit`, `themeColors.delete` untuk tombol aksi

## Contoh Implementasi

```vue
<template>
  <div class="card">
    <div class="card-header" :class="`bg-${themeColors.primary}-100`">
      <h3 :class="`text-${themeColors.primary}-900`">Judul</h3>
    </div>
    <div class="card-body">
      <button 
        class="btn btn-primary"
        :class="`bg-${themeColors.primary}-600 hover:bg-${themeColors.primary}-700`"
      >
        Simpan
      </button>
    </div>
  </div>
</template>
``` 