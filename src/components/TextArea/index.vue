<template>
  <div class="w-full" :class="{ 'flex items-start space-x-3': labelPosition === 'inline' }">
    <!-- Label -->
    <label 
      v-if="label" 
      :for="textareaId" 
      :class="labelClasses"
    >
      {{ label }}
      <span v-if="isRequired" class="text-red-500 ml-1">*</span>
    </label>

    <!-- TextArea Container Wrapper for inline mode -->
    <div :class="{ 'flex-1': labelPosition === 'inline' }">

    <!-- TextArea Container -->
    <div class="relative">
      <!-- TextArea Field -->
      <textarea
        :id="textareaId"
        ref="textareaRef"
        v-model="textareaValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :minlength="minlength"
        :rows="computedRows"
        :class="textareaClasses"
        :aria-describedby="ariaDescribedBy"
        :aria-invalid="!!error"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        @keyup="handleKeyup"
      ></textarea>

      <!-- Right Icons Container -->
      <div 
        v-if="hasRightContent" 
        class="absolute top-2 right-2 flex flex-col space-y-1"
      >
        <!-- Clear Button -->
        <button
          v-if="clearable && textareaValue && !disabled && !readonly"
          type="button"
          @click="clearInput"
          class="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 bg-white rounded-sm shadow-sm"
          :tabindex="disabled ? -1 : 0"
          title="Clear text"
        >
          <i class="ri-close-line text-sm"></i>
        </button>

        <!-- Loading Spinner -->
        <div v-if="loading" class="p-1 bg-white rounded-sm shadow-sm">
          <i class="ri-loader-4-line animate-spin text-gray-400 text-sm"></i>
        </div>

        <!-- Auto-resize toggle -->
        <button
          v-if="resizable"
          type="button"
          @click="toggleAutoResize"
          class="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 bg-white rounded-sm shadow-sm"
          :class="{ 'text-cyan-500': autoResize }"
          :tabindex="disabled ? -1 : 0"
          :title="autoResize ? 'Disable auto-resize' : 'Enable auto-resize'"
        >
          <i class="ri-expand-up-down-line text-sm"></i>
        </button>
      </div>

      <!-- Resize Handle -->
      <div 
        v-if="!autoResize && resizable && !disabled"
        class="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-50 hover:opacity-100"
      >
        <i class="ri-drag-move-2-line text-gray-400 text-xs"></i>
      </div>
    </div>

    <!-- Character Counter -->
    <div 
      v-if="showCounter && (maxlength || showWordCount)" 
      class="flex justify-between items-center mt-1"
    >
      <!-- Word count -->
      <span v-if="showWordCount" class="text-xs text-gray-500">
        {{ wordCount }} {{ wordCount === 1 ? 'word' : 'words' }}
      </span>
      <div v-else></div>
      
      <!-- Character count -->
      <span 
        v-if="maxlength"
        class="text-xs"
        :class="counterClasses"
      >
        {{ characterCount }}/{{ maxlength }}
      </span>
    </div>

    <!-- Helper Text -->
    <p 
      v-if="helperText && !error" 
      :id="`${textareaId}-helper`"
      class="mt-1 text-sm text-gray-500"
    >
      {{ helperText }}
    </p>

    <!-- Error Message -->
    <p 
      v-if="error" 
      :id="`${textareaId}-error`"
      class="mt-1 text-sm text-red-600 flex items-center"
    >
      <i class="ri-error-warning-line mr-1"></i>
      {{ error }}
    </p>

    <!-- Success Message -->
    <p 
      v-if="success && !error" 
      :id="`${textareaId}-success`"
      class="mt-1 text-sm text-green-600 flex items-center"
    >
      <i class="ri-check-line mr-1"></i>
      {{ success }}
    </p>
    
    </div> <!-- End TextArea Container Wrapper -->
  </div>
</template>

<script>
import { ref, computed, watch, nextTick } from "vue";

export default {
  name: "UTextArea",
  emits: [
    "update:modelValue", 
    "change", 
    "input", 
    "focus", 
    "blur", 
    "keydown", 
    "keyup", 
    "clear",
    "resize"
  ],
  props: {
    // Value
    modelValue: {
      type: [String, Number],
      default: "",
    },

    // Basic props
    label: {
      type: String,
      default: "",
    },
    
    placeholder: {
      type: String,
      default: "",
    },

    // TextArea specific
    rows: {
      type: [String, Number],
      default: 4,
    },

    minRows: {
      type: [String, Number],
      default: 2,
    },

    maxRows: {
      type: [String, Number],
      default: 10,
    },

    autoResize: {
      type: Boolean,
      default: false,
    },

    resizable: {
      type: Boolean,
      default: true,
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

    // Features
    clearable: {
      type: Boolean,
      default: false,
    },
    
    showCounter: {
      type: Boolean,
      default: false,
    },

    showWordCount: {
      type: Boolean,
      default: false,
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
    const textareaRef = ref(null);
    const textareaId = `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const isFocused = ref(false);
    const isRequired = ref(props.required);
    const autoResizeEnabled = ref(props.autoResize);

    // Computed
    const textareaValue = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    const characterCount = computed(() => {
      return String(textareaValue.value || "").length;
    });

    const wordCount = computed(() => {
      const text = String(textareaValue.value || "").trim();
      if (!text) return 0;
      return text.split(/\s+/).length;
    });

    const computedRows = computed(() => {
      if (autoResizeEnabled.value) {
        const lines = String(textareaValue.value || "").split('\n').length;
        const minRows = Math.max(Number(props.minRows), 1);
        const maxRows = Math.max(Number(props.maxRows), minRows);
        return Math.min(Math.max(lines, minRows), maxRows);
      }
      return Number(props.rows);
    });

    const hasRightContent = computed(() => {
      return props.clearable || props.loading || props.resizable;
    });

    const ariaDescribedBy = computed(() => {
      const ids = [];
      if (props.helperText && !props.error) ids.push(`${textareaId}-helper`);
      if (props.error) ids.push(`${textareaId}-error`);
      if (props.success && !props.error) ids.push(`${textareaId}-success`);
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

    // TextArea classes
    const textareaClasses = computed(() => {
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

      // Resize classes
      const resizeClasses = [];
      if (autoResizeEnabled.value) {
        resizeClasses.push("resize-none");
      } else if (props.resizable) {
        resizeClasses.push("resize-y");
      } else {
        resizeClasses.push("resize-none");
      }

      // Right padding for icons
      const paddingClasses = [];
      if (hasRightContent.value) {
        paddingClasses.push("pr-12");
      }

      return [
        baseClasses,
        sizeClasses.value,
        variantClasses.value,
        ...stateClasses,
        ...resizeClasses,
        ...paddingClasses,
        props.customClass,
      ].filter(Boolean).join(" ");
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
      
      // Auto-resize if enabled
      if (autoResizeEnabled.value) {
        nextTick(() => {
          adjustHeight();
        });
      }
    };

    const handleChange = (event) => {
      emit("change", {
        value: event.target.value,
        event,
        wordCount: wordCount.value,
        characterCount: characterCount.value,
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
      
      // Handle Tab key for indentation
      if (event.key === 'Tab' && !event.shiftKey && !props.disabled && !props.readonly) {
        event.preventDefault();
        const start = event.target.selectionStart;
        const end = event.target.selectionEnd;
        const value = event.target.value;
        const newValue = value.substring(0, start) + '\t' + value.substring(end);
        
        textareaValue.value = newValue;
        
        nextTick(() => {
          event.target.selectionStart = event.target.selectionEnd = start + 1;
        });
      }
    };

    const handleKeyup = (event) => {
      emit("keyup", event);
    };

    const clearInput = () => {
      textareaValue.value = "";
      emit("clear");
      nextTick(() => {
        textareaRef.value?.focus();
        if (autoResizeEnabled.value) {
          adjustHeight();
        }
      });
    };

    const toggleAutoResize = () => {
      autoResizeEnabled.value = !autoResizeEnabled.value;
      emit("resize", { autoResize: autoResizeEnabled.value });
      
      if (autoResizeEnabled.value) {
        nextTick(() => {
          adjustHeight();
        });
      }
    };

    const adjustHeight = () => {
      if (!textareaRef.value || !autoResizeEnabled.value) return;
      
      const textarea = textareaRef.value;
      textarea.style.height = 'auto';
      
      const minHeight = Number(props.minRows) * 20; // Approximate line height
      const maxHeight = Number(props.maxRows) * 20;
      const scrollHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
      
      textarea.style.height = scrollHeight + 'px';
    };

    const focus = () => {
      textareaRef.value?.focus();
    };

    const blur = () => {
      textareaRef.value?.blur();
    };

    const select = () => {
      textareaRef.value?.select();
    };

    const insertText = (text) => {
      if (!textareaRef.value || props.disabled || props.readonly) return;
      
      const textarea = textareaRef.value;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentValue = textareaValue.value || "";
      
      const newValue = currentValue.substring(0, start) + text + currentValue.substring(end);
      textareaValue.value = newValue;
      
      nextTick(() => {
        const newPosition = start + text.length;
        textarea.selectionStart = textarea.selectionEnd = newPosition;
        textarea.focus();
        
        if (autoResizeEnabled.value) {
          adjustHeight();
        }
      });
    };

    // Watch for auto-resize changes
    watch(() => textareaValue.value, () => {
      if (autoResizeEnabled.value) {
        nextTick(() => {
          adjustHeight();
        });
      }
    });

    // Watch for required prop changes
    watch(() => props.required, (newVal) => {
      isRequired.value = newVal;
    });

    return {
      // Refs
      textareaRef,
      textareaId,
      isFocused,
      isRequired,
      autoResizeEnabled,
      
      // Computed
      textareaValue,
      characterCount,
      wordCount,
      computedRows,
      hasRightContent,
      ariaDescribedBy,
      labelClasses,
      textareaClasses,
      counterClasses,
      
      // Methods
      handleInput,
      handleChange,
      handleFocus,
      handleBlur,
      handleKeydown,
      handleKeyup,
      clearInput,
      toggleAutoResize,
      adjustHeight,
      focus,
      blur,
      select,
      insertText,
    };
  },
};
</script>
