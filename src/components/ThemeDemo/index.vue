<template>
  <div class="theme-demo p-6">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-6" :class="`text-${themeColors.primary}-900`">
        Demo Sistem Tema
      </h2>
      
      <!-- Color Palette -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-4" :class="`text-${themeColors.primary}-800`">
          Palette Warna Tema: {{ currentTheme }}
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="w-16 h-16 rounded-lg mx-auto mb-2" :class="`bg-${themeColors.primary}-500`"></div>
            <span class="text-sm font-medium">Primary</span>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 rounded-lg mx-auto mb-2" :class="`bg-${themeColors.primary}-100`"></div>
            <span class="text-sm font-medium">Light</span>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 rounded-lg mx-auto mb-2" :class="`bg-${themeColors.primary}-900`"></div>
            <span class="text-sm font-medium">Dark</span>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 rounded-lg mx-auto mb-2 bg-gray-500"></div>
            <span class="text-sm font-medium">Gray</span>
          </div>
        </div>
      </div>

      <!-- Buttons Demo -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-4" :class="`text-${themeColors.primary}-800`">
          Tombol dengan Tema
        </h3>
        <div class="flex flex-wrap gap-4">
          <button 
            class="px-4 py-2 rounded-lg font-medium"
            :class="`bg-${themeColors.primary}-600 hover:bg-${themeColors.primary}-700 text-white`"
          >
            Primary Button
          </button>
          <button 
            class="px-4 py-2 rounded-lg font-medium border-2"
            :class="`border-${themeColors.primary}-600 text-${themeColors.primary}-600 hover:bg-${themeColors.primary}-50`"
          >
            Outline Button
          </button>
          <button 
            class="px-4 py-2 rounded-lg font-medium"
            :class="`bg-${themeColors.success} hover:bg-green-700 text-white`"
          >
            Success Button
          </button>
          <button 
            class="px-4 py-2 rounded-lg font-medium"
            :class="`bg-${themeColors.error} hover:bg-red-700 text-white`"
          >
            Error Button
          </button>
        </div>
      </div>

      <!-- Cards Demo -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-4" :class="`text-${themeColors.primary}-800`">
          Card dengan Tema
        </h3>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="rounded-lg shadow-lg overflow-hidden">
            <div class="p-4" :class="`bg-${themeColors.primary}-100`">
              <h4 class="font-semibold" :class="`text-${themeColors.primary}-900`">Card Header</h4>
            </div>
            <div class="p-6 bg-white">
              <p class="text-gray-600 mb-4">Ini adalah contoh card yang menggunakan tema dinamis.</p>
              <button 
                class="px-3 py-1 rounded text-sm"
                :class="`bg-${themeColors.primary}-600 hover:bg-${themeColors.primary}-700 text-white`"
              >
                Action
              </button>
            </div>
          </div>
          
          <div class="rounded-lg shadow-lg overflow-hidden">
            <div class="p-4" :class="`bg-${themeColors.primary}-50`">
              <h4 class="font-semibold" :class="`text-${themeColors.primary}-800`">Card Secondary</h4>
            </div>
            <div class="p-6 bg-white">
              <p class="text-gray-600 mb-4">Card dengan warna yang lebih soft.</p>
              <div class="flex gap-2">
                <button 
                  class="px-3 py-1 rounded text-sm"
                  :class="`bg-${themeColors.add} hover:bg-green-700 text-white`"
                >
                  Add
                </button>
                <button 
                  class="px-3 py-1 rounded text-sm"
                  :class="`bg-${themeColors.edit} hover:bg-orange-700 text-white`"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Status Indicators -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-4" :class="`text-${themeColors.primary}-800`">
          Status Indicators
        </h3>
        <div class="flex flex-wrap gap-4">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full" :class="`bg-${themeColors.success}`"></div>
            <span class="text-sm">Success</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full" :class="`bg-${themeColors.warning}`"></div>
            <span class="text-sm">Warning</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full" :class="`bg-${themeColors.error}`"></div>
            <span class="text-sm">Error</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full" :class="`bg-${themeColors.primary}-500`"></div>
            <span class="text-sm">Primary</span>
          </div>
        </div>
      </div>

      <!-- Theme Switcher Info -->
      <div class="bg-gray-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4" :class="`text-${themeColors.primary}-800`">
          Cara Menggunakan
        </h3>
        <div class="space-y-2 text-sm text-gray-600">
          <p>• Klik dropdown tema di header untuk mengubah tema</p>
          <p>• Tema akan disimpan di localStorage</p>
          <p>• Gunakan <code class="bg-gray-200 px-1 rounded">themeColors.primary</code> untuk warna utama</p>
          <p>• Gunakan <code class="bg-gray-200 px-1 rounded">themeColors.success</code>, <code class="bg-gray-200 px-1 rounded">themeColors.error</code> untuk status</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAppStore } from "@/store/app";
import { computed } from "vue";

export default {
  name: "ThemeDemo",
  setup() {
    const store = useAppStore();
    const themeColors = computed(() => store.getThemeColors);
    const currentTheme = computed(() => store.theme.current);

    return {
      themeColors,
      currentTheme,
    };
  },
};
</script>

<style scoped>
.theme-demo {
  min-height: 100vh;
}
</style> 