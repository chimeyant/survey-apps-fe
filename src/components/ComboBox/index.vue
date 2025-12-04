<template>
  <div
    class="w-full"
    :class="{ 'flex items-start space-x-3': labelPosition === 'inline' }"
  >
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      :class="labelClasses"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-red-500 ml-1"
      >*</span>
    </label>

    <!-- ComboBox Container Wrapper for inline mode -->
    <div :class="[
        'relative',
        { 'flex-1': labelPosition === 'inline' }
      ]">
      <!-- ComboBox Header -->
      <div
        :id="inputId"
        ref="comboboxRef"
        @click="toggleDropdown"
        @keydown="handleKeydown"
        :class="[
          'relative cursor-pointer px-3 py-2 border rounded-md shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-0 focus:ring-cyan-500 focus:border-teal-500 transition-colors duration-200',
          {
            'border-gray-300': !error,
            'border-red-500': error,
            'opacity-50 cursor-not-allowed': disabled
          }
        ]"
        :tabindex="disabled ? -1 : 0"
        role="combobox"
        :aria-expanded="isOpen"
        :aria-haspopup="true"
        :aria-labelledby="label ? `${inputId}-label` : undefined"
        :aria-describedby="error ? `${inputId}-error` : undefined"
      >
        <div class="flex justify-between items-center">
          <span :class="{ 'text-gray-400': !selectedText }">
            {{ selectedText || placeholder || 'Pilih Opsi' }}
          </span>
          <i :class="[
            'ri-arrow-down-s-line transition-transform duration-200',
            { 'rotate-180': isOpen }
          ]"></i>
        </div>
      </div>

      <!-- Dropdown List -->
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          :class="[
            'absolute bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-auto',
            dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
          ]"
          :style="{ minWidth: dropdownWidth + 'px' }"
          role="listbox"
        >
          <ul v-if="!loading && filteredOptions.length > 0">
            <li
              v-for="(option, index) in filteredOptions"
              :key="getOptionKey(option)"
              @click="selectOption(option)"
              :class="[
              'px-3 py-2 cursor-pointer text-sm transition-colors duration-150',
              {
                'bg-cyan-500 text-white': isSelected(option),
                'bg-gray-100': focusedIndex === index && !isSelected(option),
                'hover:bg-cyan-100': !isSelected(option)
              }
            ]"
              role="option"
              :aria-selected="isSelected(option)"
            >
              {{ getOptionLabel(option) }}
            </li>
          </ul>

          <!-- Loading state -->
          <div
            v-else-if="loading"
            class="px-3 py-2 text-center text-gray-500"
          >
            <i class="ri-loader-4-line animate-spin mr-2"></i>
            Loading...
          </div>

          <!-- Empty state -->
          <div
            v-else
            class="px-3 py-2 text-center text-gray-500"
          >
            No options available
          </div>
        </div>
      </transition>

      <!-- Error message -->
      <p
        v-if="error"
        :id="`${inputId}-error`"
        class="mt-1 text-sm text-red-600"
      >
        {{ error }}
      </p>

      <!-- Helper text -->
      <p
        v-else-if="helperText"
        class="mt-1 text-sm text-gray-500"
      >
        {{ helperText }}
      </p>

    </div> <!-- End ComboBox Container Wrapper -->
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";

export default {
  name: "UComboBox",
  props: {
    modelValue: {
      default: null,
    },
    items: {
      type: Array,
      default: () => [],
      validator: (items) => {
        if (!Array.isArray(items)) return false;
        return items.every(
          (item) =>
            typeof item === "object" &&
            item !== null &&
            ("value" in item || "id" in item) &&
            ("title" in item || "label" in item || "name" in item)
        );
      },
    },
    placeholder: {
      type: String,
      default: "Select an option",
    },
    label: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: "",
    },
    helperText: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    searchable: {
      type: Boolean,
      default: false,
    },
    // Custom key mappings for flexible object structures
    valueKey: {
      type: String,
      default: "value",
    },
    labelKey: {
      type: String,
      default: "title",
    },
    // Label position
    labelPosition: {
      type: String,
      default: "top",
      validator: (value) => ["top", "inline"].includes(value),
    },

    labelWidth: {
      type: String,
      default: "w-32",
    },
  },
  setup(props, { emit }) {
    const isOpen = ref(false);
    const focusedIndex = ref(-1);
    const comboboxRef = ref(null);
    const dropdownPosition = ref("bottom");
    const dropdownWidth = ref(0);
    const dropdownOptionHeight = 40;
    const dropdownMaxHeight = 240;
    const searchQuery = ref("");
    const inputId = `combobox-${Math.random().toString(36).substr(2, 9)}`;

    // Computed properties
    const selectedOption = computed(() => {
      if (!props.modelValue) return null;
      return (
        props.items.find((item) => getOptionValue(item) === props.modelValue) ||
        null
      );
    });

    const selectedText = computed(() => {
      if (!selectedOption.value) return "";
      return getOptionLabel(selectedOption.value);
    });

    const filteredOptions = computed(() => {
      if (!props.searchable || !searchQuery.value) {
        return props.items;
      }
      return props.items.filter((item) =>
        getOptionLabel(item)
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      );
    });

    // Label classes
    const labelClasses = computed(() => {
      const baseClasses = "text-sm font-medium text-gray-700";

      if (props.labelPosition === "inline") {
        return [baseClasses, props.labelWidth, "flex-shrink-0 pt-2"].join(" ");
      }

      return [baseClasses, "block mb-1"].join(" ");
    });

    // Helper functions
    const getOptionValue = (option) => {
      if (!option) return null;
      return option[props.valueKey] ?? option.value ?? option.id ?? option;
    };

    const getOptionLabel = (option) => {
      if (!option) return "";
      return (
        option[props.labelKey] ??
        option.title ??
        option.label ??
        option.name ??
        option.toString()
      );
    };

    const getOptionKey = (option) => {
      return getOptionValue(option) ?? Math.random().toString(36);
    };

    const isSelected = (option) => {
      if (!selectedOption.value) return false;
      return getOptionValue(option) === getOptionValue(selectedOption.value);
    };

    // Methods
    const toggleDropdown = () => {
      if (props.disabled) return;

      if (isOpen.value) {
        closeDropdown();
      } else {
        openDropdown();
      }
    };

    const adjustDropdownPosition = () => {
      if (!comboboxRef.value) {
        return;
      }

      const rect = comboboxRef.value.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const estimatedHeight = Math.min(
        dropdownMaxHeight,
        Math.max(filteredOptions.value.length, 1) * dropdownOptionHeight
      );

      dropdownPosition.value =
        spaceBelow < estimatedHeight && spaceAbove > spaceBelow
          ? "top"
          : "bottom";

      dropdownWidth.value = rect.width;
    };

    const openDropdown = () => {
      if (props.disabled) return;

      isOpen.value = true;
      focusedIndex.value = -1;
      searchQuery.value = "";
      emit("open");

      nextTick(() => {
        adjustDropdownPosition();
      });
    };

    const closeDropdown = () => {
      isOpen.value = false;
      focusedIndex.value = -1;
      searchQuery.value = "";
      emit("close");
    };

    const selectOption = (option) => {
      if (props.disabled) return;

      const value = getOptionValue(option);
      const previousValue = props.modelValue;

      emit("update:modelValue", value);

      // Emit change event with both new and old values
      emit("change", {
        value,
        option,
        previousValue,
        previousOption: selectedOption.value,
      });

      closeDropdown();
    };

    const clearSelection = () => {
      if (props.disabled) return;

      const previousValue = props.modelValue;
      emit("update:modelValue", null);
      emit("change", {
        value: null,
        option: null,
        previousValue,
        previousOption: selectedOption.value,
      });
    };

    const handleKeydown = (event) => {
      if (props.disabled) return;

      switch (event.key) {
        case "Enter":
        case " ":
          event.preventDefault();
          if (!isOpen.value) {
            openDropdown();
          } else if (focusedIndex.value >= 0) {
            selectOption(filteredOptions.value[focusedIndex.value]);
          }
          break;

        case "Escape":
          event.preventDefault();
          closeDropdown();
          break;

        case "ArrowDown":
          event.preventDefault();
          if (!isOpen.value) {
            openDropdown();
          } else {
            focusedIndex.value = Math.min(
              focusedIndex.value + 1,
              filteredOptions.value.length - 1
            );
          }
          break;

        case "ArrowUp":
          event.preventDefault();
          if (isOpen.value) {
            focusedIndex.value = Math.max(focusedIndex.value - 1, 0);
          }
          break;

        case "Tab":
          if (isOpen.value) {
            closeDropdown();
          }
          break;
      }
    };

    const handleClickOutside = (event) => {
      if (comboboxRef.value && !comboboxRef.value.contains(event.target)) {
        closeDropdown();
      }
    };

    const handleResize = () => {
      if (isOpen.value) {
        adjustDropdownPosition();
      }
    };

    // Lifecycle
    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
      window.addEventListener("resize", handleResize);
    });

    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    });

    // Watchers
    watch(
      () => props.items,
      () => {
        // Reset focused index when items change
        focusedIndex.value = -1;
      },
      { deep: true }
    );

    return {
      // Refs
      isOpen,
      focusedIndex,
      comboboxRef,
      searchQuery,
      inputId,

      // Computed
      selectedOption,
      selectedText,
      filteredOptions,
      dropdownPosition,
      labelClasses,

      // Methods
      toggleDropdown,
      openDropdown,
      closeDropdown,
      selectOption,
      clearSelection,
      handleKeydown,
      getOptionValue,
      getOptionLabel,
      getOptionKey,
      isSelected,
      adjustDropdownPosition,
    };
  },
};
</script>