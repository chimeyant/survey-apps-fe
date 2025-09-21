<template>
  <div class="w-full" :class="{ 'flex items-start space-x-3': labelPosition === 'inline' }">
    <!-- Label -->
    <label 
      v-if="label" 
      :for="inputId" 
      :class="labelClasses"
    >
      {{ label }}
      <span v-if="isRequired" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Input Container Wrapper for inline mode -->
    <div :class="{ 'flex-1': labelPosition === 'inline' }">
      
      <!-- Input Container -->
    <div class="relative">
      <!-- Left Icon -->
      <div 
        v-if="iconLeft" 
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <i :class="[iconLeft, iconLeftClasses]"></i>
      </div>

      <!-- Input Field -->
      <input
        :id="inputId"
        ref="inputRef"
        v-model="inputValue"
        :type="computedType"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :minlength="minlength"
        :min="min"
        :max="max"
        :step="step"
        :autocomplete="autocomplete"
        :class="inputClasses"
        :aria-describedby="ariaDescribedBy"
        :aria-invalid="!!error"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        @keyup="handleKeyup"
      />

      <!-- Right Icons Container -->
      <div 
        v-if="hasRightContent" 
        class="absolute inset-y-0 right-0 flex items-center"
      >
        <!-- Clear Button -->
        <button
          v-if="clearable && inputValue && !disabled && !readonly"
          type="button"
          @click="clearInput"
          class="p-1 mr-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          :tabindex="disabled ? -1 : 0"
        >
          <i class="ri-close-line text-sm"></i>
        </button>

        <!-- Password Toggle -->
        <button
          v-if="type === 'password'"
          type="button"
          @click="togglePasswordVisibility"
          class="p-1 mr-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          :tabindex="disabled ? -1 : 0"
        >
          <i :class="showPassword ? 'ri-eye-off-line' : 'ri-eye-line'" class="text-sm"></i>
        </button>

        <!-- Loading Spinner -->
        <div v-if="loading" class="p-1 mr-1">
          <i class="ri-loader-4-line animate-spin text-gray-400 text-sm"></i>
        </div>

        <!-- Right Icon -->
        <div 
          v-if="iconRight && !loading" 
          class="p-1 mr-3 pointer-events-none"
        >
          <i :class="[iconRight, iconRightClasses]"></i>
        </div>
      </div>
    </div>

    <!-- Character Counter -->
    <div 
      v-if="showCounter && maxlength" 
      class="flex justify-end mt-1"
    >
      <span 
        class="text-xs"
        :class="counterClasses"
      >
        {{ characterCount }}/{{ maxlength }}
      </span>
    </div>

    <!-- Helper Text -->
    <p 
      v-if="helperText && !error" 
      :id="`${inputId}-helper`"
      class="mt-1 text-sm text-gray-500"
    >
      {{ helperText }}
    </p>

    <!-- Error Message -->
    <p 
      v-if="error" 
      :id="`${inputId}-error`"
      class="mt-1 text-sm text-red-600 flex items-center"
    >
      <i class="ri-error-warning-line mr-1"></i>
      {{ error }}
    </p>

    <!-- Success Message -->
    <p 
      v-if="success && !error" 
      :id="`${inputId}-success`"
      class="mt-1 text-sm text-green-600 flex items-center"
    >
      <i class="ri-check-line mr-1"></i>
      {{ success }}
    </p>
    
    </div> <!-- End Input Container Wrapper -->
  </div>
</template>

<script>
import { ref, computed, watch, nextTick } from "vue";

export default {
  name: "UTextField",
  emits: [
    "update:modelValue", 
    "change", 
    "input", 
    "focus", 
    "blur", 
    "keydown", 
    "keyup", 
    "clear"
  ],
  props: {
    // Value
    modelValue: {
      type: [String, Number],
      default: "",
    },

    // Basic props
    type: {
      type: String,
      default: "text",
      validator: (value) => [
        "text", "email", "password", "number", "tel", "url", 
        "search", "date", "time", "datetime-local", "month", "week"
      ].includes(value),
    },
    
    label: {
      type: String,
      default: "",
    },
    
    placeholder: {
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
    
    loading: {
      type: Boolean,
      default: false,
    },

    // Constraints
    maxlength: {
      type: [String, Number],
      default: null,
    },
    
    minlength: {
      type: [String, Number],
      default: null,
    },
    
    min: {
      type: [String, Number],
      default: null,
    },
    
    max: {
      type: [String, Number],
      default: null,
    },
    
    step: {
      type: [String, Number],
      default: null,
    },

    // Features
    clearable: {
      type: Boolean,
      default: false,
    },
    
    showCounter: {
      type: Boolean,
      default: false,
    },

    // Icons
    iconLeft: {
      type: String,
      default: "",
    },
    
    iconRight: {
      type: String,
      default: "",
    },

    // Size
    size: {
      type: String,
      default: "md",
      validator: (value) => ["sm", "md", "lg"].includes(value),
    },

    // Variant
    variant: {
      type: String,
      default: "default",
      validator: (value) => ["default", "filled", "outlined"].includes(value),
    },

    // HTML attributes
    autocomplete: {
      type: String,
      default: "off",
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

    // Custom classes
    customClass: {
      type: String,
      default: "",
    },
  },

  setup(props, { emit }) {
    // Refs
    const inputRef = ref(null);
    const showPassword = ref(false);
    const inputId = `textfield-${Math.random().toString(36).substr(2, 9)}`;
    const isFocused = ref(false);
    const isRequired = ref(props.required);

    // Computed
    const inputValue = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    const computedType = computed(() => {
      if (props.type === "password") {
        return showPassword.value ? "text" : "password";
      }
      return props.type;
    });

    const characterCount = computed(() => {
      return String(inputValue.value || "").length;
    });

    const hasRightContent = computed(() => {
      return props.clearable || 
             props.type === "password" || 
             props.loading || 
             props.iconRight;
    });

    const ariaDescribedBy = computed(() => {
      const ids = [];
      if (props.helperText && !props.error) ids.push(`${inputId}-helper`);
      if (props.error) ids.push(`${inputId}-error`);
      if (props.success && !props.error) ids.push(`${inputId}-success`);
      return ids.length > 0 ? ids.join(" ") : undefined;
    });

    // Label classes
    const labelClasses = computed(() => {
      const baseClasses = "text-sm font-medium text-gray-700";
      
      if (props.labelPosition === "inline") {
        return [
          baseClasses,
          props.labelWidth,
          "flex-shrink-0 pt-2"
        ].join(" ");
      }
      
      return [baseClasses, "block mb-1"].join(" ");
    });

    // Size classes
    const sizeClasses = computed(() => {
      const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-3 py-2 text-sm", 
        lg: "px-4 py-3 text-base",
      };
      return sizes[props.size];
    });

    // Variant classes
    const variantClasses = computed(() => {
      const variants = {
        default: "border border-gray-300 bg-white",
        filled: "border border-gray-300 bg-gray-50",
        outlined: "border-2 border-gray-300 bg-transparent",
      };
      return variants[props.variant];
    });

    // Input classes
    const inputClasses = computed(() => {
      const baseClasses = "block w-full rounded-md shadow-sm focus:outline-none focus:ring-0 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200";
      
      const stateClasses = [];
      
      // Error state
      if (props.error) {
        stateClasses.push("border-red-500 focus:ring-red-500 focus:border-red-500");
      }
      // Success state
      else if (props.success) {
        stateClasses.push("border-green-500 focus:ring-green-500 focus:border-green-500");
      }
      // Default state
      else {
        stateClasses.push("border-gray-300 focus:ring-cyan-500 focus:border-cyan-500");
      }

      // Disabled state
      if (props.disabled) {
        stateClasses.push("bg-gray-50 text-gray-500 cursor-not-allowed opacity-50");
      }
      // Readonly state
      else if (props.readonly) {
        stateClasses.push("bg-gray-50 cursor-default");
      }

      // Icon padding
      const paddingClasses = [];
      if (props.iconLeft) {
        paddingClasses.push("pl-10");
      }
      if (hasRightContent.value) {
        paddingClasses.push("pr-10");
      }

      return [
        baseClasses,
        sizeClasses.value,
        variantClasses.value,
        ...stateClasses,
        ...paddingClasses,
        props.customClass,
      ].filter(Boolean).join(" ");
    });

    // Icon classes
    const iconLeftClasses = computed(() => {
      return props.error 
        ? "text-red-400" 
        : props.success 
          ? "text-green-400" 
          : "text-gray-400";
    });

    const iconRightClasses = computed(() => {
      return props.error 
        ? "text-red-400" 
        : props.success 
          ? "text-green-400" 
          : "text-gray-400";
    });

    // Counter classes
    const counterClasses = computed(() => {
      const isNearLimit = characterCount.value >= (props.maxlength * 0.8);
      const isOverLimit = characterCount.value > props.maxlength;
      
      if (isOverLimit) return "text-red-600 font-medium";
      if (isNearLimit) return "text-yellow-600";
      return "text-gray-500";
    });

    // Methods
    const handleInput = (event) => {
      const value = event.target.value;
      emit("input", value);
      emit("update:modelValue", value);
    };

    const handleChange = (event) => {
      emit("change", {
        value: event.target.value,
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

    const handleKeydown = (event) => {
      emit("keydown", event);
    };

    const handleKeyup = (event) => {
      emit("keyup", event);
    };

    const clearInput = () => {
      inputValue.value = "";
      emit("clear");
      nextTick(() => {
        inputRef.value?.focus();
      });
    };

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const focus = () => {
      inputRef.value?.focus();
    };

    const blur = () => {
      inputRef.value?.blur();
    };

    const select = () => {
      inputRef.value?.select();
    };

    return {
      // Refs
      inputRef,
      inputId,
      isFocused,
      showPassword,
      
      // Computed
      inputValue,
      computedType,
      characterCount,
      hasRightContent,
      ariaDescribedBy,
      labelClasses,
      inputClasses,
      iconLeftClasses,
      iconRightClasses,
      counterClasses,
      
      // Methods
      handleInput,
      handleChange,
      handleFocus,
      handleBlur,
      handleKeydown,
      handleKeyup,
      clearInput,
      togglePasswordVisibility,
      focus,
      blur,
      select,
      isRequired,
    };
  },
};
</script>
