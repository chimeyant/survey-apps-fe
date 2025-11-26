<template>
  <div class="w-full" :class="{ 'flex items-start space-x-3': labelPosition === 'inline' }">
    <!-- Label -->
    <label 
      v-if="label" 
      :for="groupId" 
      :class="labelClasses"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Checkbox Group Container Wrapper for inline mode -->
    <div :class="{ 'flex-1': labelPosition === 'inline' }">
      <div 
        :id="groupId"
        class="space-y-2"
        :class="containerClasses"
      >
        <div
          v-for="(option, index) in normalizedOptions"
          :key="getOptionKey(option, index)"
          class="flex items-center"
        >
          <input
            :id="`${groupId}-${index}`"
            type="checkbox"
            :value="getOptionValue(option)"
            :checked="isChecked(option)"
            :disabled="disabled || option.disabled"
            :readonly="readonly"
            :class="checkboxClasses"
            @change="handleCheckboxChange(option, $event)"
            @focus="handleFocus"
            @blur="handleBlur"
          />
          <label
            :for="`${groupId}-${index}`"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
            :class="{
              'cursor-not-allowed opacity-50': disabled || option.disabled,
            }"
          >
            {{ getOptionLabel(option) }}
          </label>
        </div>
      </div>

      <!-- Helper Text -->
      <p 
        v-if="helperText && !error" 
        :id="`${groupId}-helper`"
        class="mt-1 text-sm text-gray-500"
      >
        {{ helperText }}
      </p>

      <!-- Error Message -->
      <p 
        v-if="error" 
        :id="`${groupId}-error`"
        class="mt-1 text-sm text-red-600 flex items-center"
      >
        <i class="ri-error-warning-line mr-1"></i>
        {{ error }}
      </p>

      <!-- Success Message -->
      <p 
        v-if="success && !error" 
        :id="`${groupId}-success`"
        class="mt-1 text-sm text-green-600 flex items-center"
      >
        <i class="ri-check-line mr-1"></i>
        {{ success }}
      </p>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";

export default {
  name: "UCheckboxGroup",
  emits: [
    "update:modelValue",
    "change",
    "focus",
    "blur",
  ],
  props: {
    // Value - array of selected values
    modelValue: {
      type: Array,
      default: () => [],
    },

    // Options - array of option objects or strings
    options: {
      type: Array,
      default: () => [],
      validator: (options) => {
        if (!Array.isArray(options)) return false;
        return options.every(option => 
          typeof option === 'string' || 
          typeof option === 'object' && option !== null
        );
      },
    },

    // Basic props
    label: {
      type: String,
      default: "",
    },

    // Validation
    required: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: "",
    },

    success: {
      type: String,
      default: "",
    },

    helperText: {
      type: String,
      default: "",
    },

    // States
    disabled: {
      type: Boolean,
      default: false,
    },

    readonly: {
      type: Boolean,
      default: false,
    },

    // Size
    size: {
      type: String,
      default: "md",
      validator: (value) => ["sm", "md", "lg"].includes(value),
    },

    // Color variant
    color: {
      type: String,
      default: "cyan",
      validator: (value) => ["cyan", "blue", "green", "red", "yellow", "purple", "gray"].includes(value),
    },

    // Layout
    direction: {
      type: String,
      default: "vertical",
      validator: (value) => ["vertical", "horizontal"].includes(value),
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

    // Custom key mappings for flexible object structures
    valueKey: {
      type: String,
      default: "value",
    },
    labelKey: {
      type: String,
      default: "label",
    },

    // Custom classes
    customClass: {
      type: String,
      default: "",
    },
  },

  setup(props, { emit }) {
    // Refs
    const groupId = `checkbox-group-${Math.random().toString(36).substr(2, 9)}`;
    const isFocused = ref(false);

    // Normalize options to handle both string and object formats
    const normalizedOptions = computed(() => {
      return props.options.map(option => {
        if (typeof option === 'string') {
          return { value: option, label: option };
        }
        return option;
      });
    });

    // Container classes
    const containerClasses = computed(() => {
      const classes = [];
      
      if (props.direction === "horizontal") {
        classes.push("flex flex-wrap gap-4");
      }
      
      return [...classes, props.customClass].filter(Boolean).join(" ");
    });

    // Label classes
    const labelClasses = computed(() => {
      const baseClasses = "text-sm font-medium text-gray-700";

      if (props.labelPosition === "inline") {
        return [
          baseClasses,
          props.labelWidth,
          "flex-shrink-0 pt-1",
        ].join(" ");
      }

      return [baseClasses, "block mb-2"].join(" ");
    });

    // Size classes
    const sizeClasses = computed(() => {
      const sizes = {
        sm: "w-3 h-3",
        md: "w-4 h-4",
        lg: "w-5 h-5",
      };
      return sizes[props.size];
    });

    // Color classes
    const colorClasses = computed(() => {
      const colors = {
        cyan: "text-cyan-600 focus:ring-cyan-500 border-gray-300",
        blue: "text-blue-600 focus:ring-blue-500 border-gray-300",
        green: "text-green-600 focus:ring-green-500 border-gray-300",
        red: "text-red-600 focus:ring-red-500 border-gray-300",
        yellow: "text-yellow-600 focus:ring-yellow-500 border-gray-300",
        purple: "text-purple-600 focus:ring-purple-500 border-gray-300",
        gray: "text-gray-600 focus:ring-gray-500 border-gray-300",
      };
      return colors[props.color];
    });

    // Checkbox classes
    const checkboxClasses = computed(() => {
      const baseClasses = "rounded border focus:ring-2 focus:ring-offset-0 transition-colors duration-200 cursor-pointer";

      const stateClasses = [];

      // Error state
      if (props.error) {
        stateClasses.push("border-red-500 focus:ring-red-500");
      }
      // Success state
      else if (props.success) {
        stateClasses.push("border-green-500 focus:ring-green-500");
      }
      // Default state
      else {
        stateClasses.push(colorClasses.value);
      }

      // Disabled state
      if (props.disabled) {
        stateClasses.push("opacity-50 cursor-not-allowed bg-gray-100");
      }
      // Readonly state
      else if (props.readonly) {
        stateClasses.push("cursor-default");
      }

      return [
        baseClasses,
        sizeClasses.value,
        ...stateClasses,
      ].filter(Boolean).join(" ");
    });

    // Helper functions
    const getOptionValue = (option) => {
      if (!option) return null;
      return option[props.valueKey] ?? option.value ?? option.id ?? option;
    };

    const getOptionLabel = (option) => {
      if (!option) return "";
      return option[props.labelKey] ?? option.label ?? option.title ?? option.name ?? option.toString();
    };

    const getOptionKey = (option, index) => {
      return getOptionValue(option) ?? `option-${index}`;
    };

    const isChecked = (option) => {
      const value = getOptionValue(option);
      return Array.isArray(props.modelValue) && props.modelValue.includes(value);
    };

    // Methods
    const handleCheckboxChange = (option, event) => {
      const value = getOptionValue(option);
      const isChecked = event.target.checked;
      
      let newValue = [...(props.modelValue || [])];
      
      if (isChecked) {
        // Add value if not already in array
        if (!newValue.includes(value)) {
          newValue.push(value);
        }
      } else {
        // Remove value from array
        newValue = newValue.filter(v => v !== value);
      }

      emit("update:modelValue", newValue);
      emit("change", {
        value: newValue,
        option,
        checked: isChecked,
        event,
      });
    };

    const handleFocus = (event) => {
      isFocused.value = true;
      emit("focus", event);
    };

    const handleBlur = (event) => {
      isFocused.value = false;
      emit("blur", event);
    };

    return {
      // Refs
      groupId,
      isFocused,

      // Computed
      normalizedOptions,
      containerClasses,
      labelClasses,
      checkboxClasses,

      // Methods
      getOptionValue,
      getOptionLabel,
      getOptionKey,
      isChecked,
      handleCheckboxChange,
      handleFocus,
      handleBlur,
    };
  },
};
</script>


