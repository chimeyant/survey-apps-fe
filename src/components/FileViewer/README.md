# FileViewer Component

Komponen `UFileViewer` adalah dialog yang dapat menampilkan berbagai jenis file dengan preview yang sesuai dengan tipe file tersebut.

## Features

- **Multi-format Support**: Mendukung image, PDF, text, video, audio, dan file lainnya
- **Interactive Controls**: Zoom in/out untuk gambar, download, print, dan close
- **Draggable Dialog**: Dialog dapat dipindahkan dengan drag & drop
- **Keyboard Shortcuts**: Mendukung shortcut keyboard untuk navigasi dan print
- **Print Support**: Mendukung print untuk image, PDF, dan text files
- **Responsive Design**: Tampilan responsif untuk berbagai ukuran layar
- **Error Handling**: Menampilkan error state dan retry functionality

## Supported File Types

### Images

- JPG, JPEG, PNG, GIF, BMP, WebP, SVG
- Fitur zoom in/out dan reset zoom
- Print support dengan format yang optimal
- Keyboard shortcuts: `+`, `-`, `0`

### PDF

- Preview menggunakan iframe
- Toolbar tersembunyi untuk tampilan yang bersih
- Print support langsung dari browser

### Text Files

- TXT, MD, JSON, XML, CSV, LOG, JS, TS, Vue, HTML, CSS
- Menampilkan konten dalam format yang mudah dibaca
- Print support dengan formatting yang rapi

### Video

- MP4, AVI, MOV, WMV, FLV, WebM, MKV
- Native video player dengan controls

### Audio

- MP3, WAV, OGG, AAC, FLAC, M4A
- Native audio player dengan controls

### Unsupported Files

- Menampilkan icon file dan opsi download
- Opsi untuk membuka di tab baru

## Props

| Prop       | Type    | Default  | Description                                          |
| ---------- | ------- | -------- | ---------------------------------------------------- |
| `visible`  | Boolean | `false`  | Mengontrol visibilitas dialog                        |
| `fileUrl`  | String  | `""`     | URL atau path ke file                                |
| `fileName` | String  | `"File"` | Nama file yang akan ditampilkan                      |
| `fileSize` | String  | `""`     | Ukuran file (opsional)                               |
| `fileType` | String  | `""`     | Tipe file (opsional, akan auto-detect dari fileName) |

## Events

| Event      | Parameters | Description                             |
| ---------- | ---------- | --------------------------------------- |
| `close`    | -          | Dipanggil ketika dialog ditutup         |
| `download` | `url`      | Dipanggil ketika tombol download diklik |

## Usage

### Basic Usage

```vue
<template>
  <div>
    <!-- Trigger button -->
    <button @click="showFileViewer = true">View File</button>

    <!-- File Viewer -->
    <UFileViewer
      :visible="showFileViewer"
      :file-url="fileUrl"
      :file-name="fileName"
      :file-size="fileSize"
      @close="showFileViewer = false"
      @download="onDownload"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import { UFileViewer } from "@/components";

export default {
  components: {
    UFileViewer,
  },
  setup() {
    const showFileViewer = ref(false);
    const fileUrl = ref("https://example.com/sample.pdf");
    const fileName = ref("sample.pdf");
    const fileSize = ref("2.5 MB");

    const onDownload = (url) => {
      console.log("Downloading:", url);
    };

    return {
      showFileViewer,
      fileUrl,
      fileName,
      fileSize,
      onDownload,
    };
  },
};
</script>
```

### With Different File Types

```vue
<template>
  <div>
    <!-- Image -->
    <img
      :src="imageUrl"
      @click="openFileViewer(imageUrl, 'image.jpg', '1.2 MB', 'jpg')"
    />

    <!-- PDF -->
    <div @click="openFileViewer(pdfUrl, 'document.pdf', '3.1 MB', 'pdf')">
      View PDF
    </div>

    <!-- Text File -->
    <div @click="openTextFile()">View Text</div>

    <UFileViewer
      :visible="fileViewer.visible"
      :file-url="fileViewer.url"
      :file-name="fileViewer.name"
      :file-size="fileViewer.size"
      :file-type="fileViewer.type"
      @close="closeFileViewer"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import { UFileViewer } from "@/components";

export default {
  components: {
    UFileViewer,
  },
  setup() {
    const fileViewer = ref({
      visible: false,
      url: "",
      name: "",
      size: "",
      type: "",
    });

    const openFileViewer = (url, name, size, type) => {
      fileViewer.value = {
        visible: true,
        url,
        name,
        size,
        type,
      };
    };

    const openTextFile = () => {
      const textContent = "Your text content here...";
      const blob = new Blob([textContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      openFileViewer(url, "sample.txt", "1.5 KB", "txt");
    };

    const closeFileViewer = () => {
      fileViewer.value.visible = false;
      // Clean up blob URL
      if (fileViewer.value.url.startsWith("blob:")) {
        URL.revokeObjectURL(fileViewer.value.url);
      }
    };

    return {
      fileViewer,
      openFileViewer,
      openTextFile,
      closeFileViewer,
    };
  },
};
</script>
```

## Keyboard Shortcuts

| Key        | Action     | Description                   |
| ---------- | ---------- | ----------------------------- |
| `Esc`      | Close      | Menutup dialog                |
| `Ctrl+P`   | Print      | Print file (image, PDF, text) |
| `+` or `=` | Zoom In    | Zoom in pada gambar           |
| `-`        | Zoom Out   | Zoom out pada gambar          |
| `0`        | Reset Zoom | Reset zoom ke 100%            |

## Styling

Komponen menggunakan Tailwind CSS dan mengikuti theme system yang ada. Dialog dapat disesuaikan dengan:

- **Header**: Background menggunakan warna primary theme
- **Content**: Background putih dengan border radius
- **Controls**: Button dengan hover effects
- **Responsive**: Max width dan height yang responsif

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Notes

- Untuk file PDF, pastikan server mendukung CORS
- File besar mungkin memerlukan waktu loading
- Blob URL akan otomatis dibersihkan saat dialog ditutup
- Drag & drop hanya bekerja pada header dialog
