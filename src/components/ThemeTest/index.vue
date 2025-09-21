<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4" :class="`text-${themeColors.primary}-900`">
      Test Tema: {{ currentTheme }}
    </h2>
    
    <div class="grid grid-cols-2 gap-4">
      <div class="p-4 rounded-lg" :class="`bg-${themeColors.primary}-100`">
        <h3 class="font-semibold" :class="`text-${themeColors.primary}-900`">Primary Light</h3>
        <p class="text-sm" :class="`text-${themeColors.primary}-700`">Background: {{ themeColors.primaryLight }}</p>
      </div>
      
      <div class="p-4 rounded-lg" :class="`bg-${themeColors.primary}-600`">
        <h3 class="font-semibold text-white">Primary</h3>
        <p class="text-sm text-white">Background: {{ themeColors.primary }}</p>
      </div>
    </div>
    
    <div class="mt-4">
      <button 
        class="px-4 py-2 rounded mr-2"
        :class="`bg-${themeColors.primary}-600 hover:bg-${themeColors.primary}-700 text-white`"
      >
        Primary Button
      </button>
      
      <button 
        class="px-4 py-2 rounded mr-2"
        :class="`bg-${themeColors.success} hover:bg-green-700 text-white`"
      >
        Success Button
      </button>
      
      <button 
        class="px-4 py-2 rounded mr-2"
        :class="`bg-${themeColors.error} hover:bg-red-700 text-white`"
      >
        Error Button
      </button>
    </div>
    
    <div class="mt-4 p-4 bg-gray-100 rounded">
      <h4 class="font-semibold mb-2">Debug Info:</h4>
      <p><strong>Current Theme:</strong> {{ currentTheme }}</p>
      <p><strong>Primary Color:</strong> {{ themeColors.primary }}</p>
      <p><strong>Available Themes:</strong> {{ availableThemes.join(', ') }}</p>
    </div>
  </div>
</template>

<script>
import { useAppStore } from "@/store/app";
import { computed } from "vue";
import { THEMES, DEFAULT_THEME } from "@/config/variable";

export default {
  name: "ThemeTest",
  setup() {
    const store = useAppStore();
    
    const currentTheme = computed(() => store.theme.current);
    const availableThemes = computed(() => store.getAvailableThemes);
    
    const themeColors = computed(() => {
      const theme = THEMES[currentTheme.value] || DEFAULT_THEME;
      return {
        primary: theme.primary,
        primaryLight: theme.primaryLight,
        primaryDark: theme.primaryDark,
        success: theme.success,
        error: theme.error,
        warning: theme.warning,
        refresh: theme.refresh,
        add: theme.add,
        edit: theme.edit,
        download: theme.download,
        delete: theme.delete,
        help: theme.help,
        back: theme.back,
        dot: theme.dot,
        title: theme.title,
        subtitle: theme.subtitle,
      };
    });

    return {
      currentTheme,
      availableThemes,
      themeColors,
    };
  },
};
</script> 