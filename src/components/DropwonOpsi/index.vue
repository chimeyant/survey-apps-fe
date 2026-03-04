<template>
  <div class="relative inline-block text-left" ref="dropdownRef">
    <button
      type="button"
      class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
      :aria-expanded="isDropdownOpen"
      aria-haspopup="menu"
      aria-label="Buka menu aksi"
      tabindex="0"
      @click="toggleDropdown"
      @keydown.enter.prevent="toggleDropdown"
      @keydown.space.prevent="toggleDropdown"
      @keydown.esc="closeDropdown"
    >
      <i class="ri-more-2-fill text-lg"></i>
    </button>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isDropdownOpen"
        :class="[
          'absolute right-0 z-30 mt-1.5 origin-top-right rounded-lg border border-gray-200 bg-white py-1 shadow-lg focus:outline-none',
          menuWidth
        ]"
        role="menu"
        aria-orientation="vertical"
        @mouseleave="closeDropdown"
        @keydown.esc="closeDropdown"
      >
        <div class="py-0.5" role="none" @click="closeDropdown">
          <slot name="menu" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";

export default {
  name: "UDropdownOpsi",
  props: {
    /** Tailwind width class untuk panel dropdown, contoh: min-w-[160px], w-64, w-72, max-w-xs */
    menuWidth: {
      type: String,
      default: "min-w-[160px]",
    },
  },
  setup(props) {
    const isDropdownOpen = ref(false);
    const dropdownRef = ref(null);

    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value;
    };

    const closeDropdown = () => {
      isDropdownOpen.value = false;
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
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
      menuWidth: props.menuWidth,
    };
  },
};
</script>
