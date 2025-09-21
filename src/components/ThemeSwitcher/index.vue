<template>
  <div class="theme-switcher">
    <!-- Theme Dropdown -->
    <div class="relative">
      <button
        @click="toggleDropdown"
        class="flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors"
        :class="[
          `bg-${themeColors.primary}-50`,
          `border-${themeColors.primary}-200`,
          `hover:bg-${themeColors.primary}-100`,
          `text-${themeColors.primary}-700`
        ]"
      >
        <div class="w-4 h-4 rounded-full" :class="`bg-${themeColors.primary}-500`"></div>
        <span class="text-sm font-medium capitalize">{{ currentTheme }}</span>
        <i class="ri-arrow-down-s-line text-sm"></i>
      </button>

      <!-- Dropdown Menu -->
      <div
        v-if="isDropdownOpen"
        class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
      >
        <div class="py-1">
          <div
            v-for="theme in availableThemes"
            :key="theme"
            @click="changeTheme(theme)"
            class="flex items-center space-x-3 px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
            :class="{ 'bg-gray-100': theme === currentTheme }"
          >
            <div class="w-4 h-4 rounded-full" :class="`bg-${getThemeColor(theme)}-500`"></div>
            <span class="text-sm capitalize">{{ theme }}</span>
            <i v-if="theme === currentTheme" class="ri-check-line text-green-500 ml-auto"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Click outside to close dropdown -->
    <div
      v-if="isDropdownOpen"
      @click="closeDropdown"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script>
import { useAppStore } from "@/store/app";
import { computed, ref, onMounted } from "vue";
import { THEMES } from "@/config/variable";

export default {
  name: "ThemeSwitcher",
  setup() {
    const store = useAppStore();
    const isDropdownOpen = ref(false);

    const currentTheme = computed(() => store.theme.current);
    const availableThemes = computed(() => store.getAvailableThemes);
    const themeColors = computed(() => store.getThemeColors);

    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value;
    };

    const closeDropdown = () => {
      isDropdownOpen.value = false;
    };

    const changeTheme = (themeName) => {
      store.setTheme(themeName);
      closeDropdown();
    };

    const getThemeColor = (themeName) => {
      return THEMES[themeName]?.primary || 'gray';
    };

    // Load theme from localStorage on mount
    onMounted(() => {
      store.loadThemeFromStorage();
    });

    return {
      currentTheme,
      availableThemes,
      themeColors,
      isDropdownOpen,
      toggleDropdown,
      closeDropdown,
      changeTheme,
      getThemeColor,
    };
  },
};
</script>

<style scoped>
.theme-switcher {
  position: relative;
}
</style> 