<template>
  <div class="relative inline-block text-left" ref="dropdownRef">
    <!-- Dropdown Button -->
    <button
      @click="toggleDropdown"
      :aria-expanded="isDropdownOpen.toString()"
      aria-haspopup="listbox"
      :class="`inline-flex justify-center items-center w-[24px] h-[24px] text-sm font-medium text-white bg-${themeColors.primary}-600 rounded-full hover:bg-${themeColors.primary}-700 focus:outline-none focus:ring-2 focus:ring-${themeColors.primary}-500 transition`"
      type="button"
      tabindex="0"
      @keydown.enter.prevent="toggleDropdown"
      @keydown.space.prevent="toggleDropdown"
      @keydown.esc="closeDropdown"
    >
      <span class="sr-only">Open options</span>
      <i class="ri-more-2-fill"></i>
    </button>

    <!-- Dropdown Menu -->
    <transition name="fade">
      <div
        v-if="isDropdownOpen"
        :class="`absolute right-0 z-20 w-auto mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 min-w-[120px]`"
        role="listbox"
        @keydown.esc="closeDropdown"
        @mouseleave="closeDropdown"
      >
        <div class="flex flex-col items-start p-2" @click="closeDropdown">
          <slot name="menu" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useAppStore } from "@/store/app";

export default {
  name: "DropdownOpsi",
  setup() {
    const isDropdownOpen = ref(false);
    const dropdownRef = ref(null);

    // Ambil warna tema dari store
    const store = useAppStore();
    const themeColors = computed(() => store.getThemeColors);

    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value;
    };

    const closeDropdown = () => {
      isDropdownOpen.value = false;
    };

    // Click outside handler
    const handleClickOutside = (event) => {
      if (
        dropdownRef.value &&
        !dropdownRef.value.contains(event.target)
      ) {
        closeDropdown();
      }
    };

    onMounted(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    });

    return {
      isDropdownOpen,
      toggleDropdown,
      closeDropdown,
      dropdownRef,
      themeColors,
    };
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>