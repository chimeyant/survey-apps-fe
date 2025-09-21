<template>
  <component
    :is="tag"
    :type="tag === 'button' ? type : undefined"
    :href="tag === 'a' ? href : undefined"
    :to="tag === 'router-link' ? to : undefined"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <!-- Loading Spinner -->
    <i 
      v-if="loading" 
      class="ri-loader-4-line animate-spin mr-2"
      :class="{ 'mr-0': !hasContent }"
    ></i>
    
    <!-- Left Icon -->
    <i 
      v-else-if="iconLeft && !loading" 
      :class="[iconLeft, { 'mr-2': hasContent }]"
    ></i>
    
    <!-- Button Content -->
    <span v-if="hasContent" :class="{ 'opacity-0': loading && !hasContent }">
      <slot>{{ label }}</slot>
    </span>
    
    <!-- Right Icon -->
    <i 
      v-if="iconRight && !loading" 
      :class="[iconRight, { 'ml-2': hasContent }]"
    ></i>
    
    <!-- Badge -->
    <span 
      v-if="badge && !loading" 
      :class="badgeClasses"
    >
      {{ badge }}
    </span>
  </component>
</template>

<script>
import { computed, useSlots } from "vue";

export default {
  name: "UButton",
  emits: ["click", "focus", "blur"],
  props: {
    // Content
    label: {
      type: String,
      default: "",
    },
    
    // Button behavior
    type: {
      type: String,
      default: "button",
      validator: (value) => ["button", "submit", "reset"].includes(value),
    },
    
    // HTML tag
    tag: {
      type: String,
      default: "button",
      validator: (value) => ["button", "a", "router-link"].includes(value),
    },
    
    // Link props
    href: {
      type: String,
      default: "",
    },
    
    to: {
      type: [String, Object],
      default: null,
    },
    
    // Appearance
    variant: {
      type: String,
      default: "primary",
      validator: (value) => [
        "primary", "secondary", "success", "danger", "warning", 
        "info", "light", "dark", "outline-primary", "outline-secondary",
        "outline-success", "outline-danger", "outline-warning", 
        "outline-info", "outline-light", "outline-dark", "ghost", "link"
      ].includes(value),
    },
    
    size: {
      type: String,
      default: "md",
      validator: (value) => ["xs", "sm", "md", "lg", "xl"].includes(value),
    },
    
    // States
    disabled: {
      type: Boolean,
      default: false,
    },
    
    loading: {
      type: Boolean,
      default: false,
    },
    
    active: {
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
    
    // Badge
    badge: {
      type: [String, Number],
      default: null,
    },
    
    // Layout
    block: {
      type: Boolean,
      default: false,
    },
    
    rounded: {
      type: String,
      default: "md",
      validator: (value) => ["none", "sm", "md", "lg", "full"].includes(value),
    },
    
    // Custom classes
    customClass: {
      type: String,
      default: "",
    },
  },
  
  setup(props, { emit }) {
    const slots = useSlots();
    
    // Check if button has content
    const hasContent = computed(() => {
      return !!(props.label || slots.default);
    });
    
    // Base classes
    const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 select-none";
    
    // Size classes
    const sizeClasses = computed(() => {
      const sizes = {
        xs: "px-2 py-1 text-xs",
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
        xl: "px-8 py-4 text-lg",
      };
      return sizes[props.size];
    });
    
    // Rounded classes
    const roundedClasses = computed(() => {
      const rounded = {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      };
      return rounded[props.rounded];
    });
    
    // Variant classes
    const variantClasses = computed(() => {
      const variants = {
        // Solid variants
        primary: "border-l-4 border-l-green-700 bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 border border-transparent",
        secondary: "border-l-4 border-l-gray-700 bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500 border border-transparent",
        success: "border-l-4 border-l-green-700 bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 border border-transparent",
        danger: "border-l-4 border-l-red-700 bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 border border-transparent",
        warning: "border-l-4 border-l-yellow-700 bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 border border-transparent",
        info: "border-l-4 border-l-blue-700 bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 border border-transparent",
        light: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300",
        dark: "bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-500 border border-transparent",
        
        // Outline variants
        "outline-primary": "bg-transparent text-cyan-500 hover:bg-cyan-50 hover:text-cyan-600 focus:ring-cyan-500 border border-cyan-500",
        "outline-secondary": "bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-600 focus:ring-gray-500 border border-gray-500",
        "outline-success": "bg-transparent text-green-500 hover:bg-green-50 hover:text-green-600 focus:ring-green-500 border border-green-500",
        "outline-danger": "bg-transparent text-red-500 hover:bg-red-50 hover:text-red-600 focus:ring-red-500 border border-red-500",
        "outline-warning": "bg-transparent text-yellow-500 hover:bg-yellow-50 hover:text-yellow-600 focus:ring-yellow-500 border border-yellow-500",
        "outline-info": "bg-transparent text-blue-500 hover:bg-blue-50 hover:text-blue-600 focus:ring-blue-500 border border-blue-500",
        "outline-light": "bg-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-700 focus:ring-gray-500 border border-gray-300",
        "outline-dark": "bg-transparent text-gray-800 hover:bg-gray-50 hover:text-gray-900 focus:ring-gray-500 border border-gray-800",
        
        // Special variants
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:ring-gray-500 border border-transparent",
        link: "bg-transparent text-cyan-500 hover:text-cyan-600 hover:underline focus:ring-cyan-500 border-0 p-0",
      };
      return variants[props.variant];
    });
    
    // State classes
    const stateClasses = computed(() => {
      let classes = [];
      
      if (props.disabled || props.loading) {
        classes.push("opacity-50 cursor-not-allowed");
      } else {
        classes.push("cursor-pointer");
      }
      
      if (props.active) {
        classes.push("ring-2 ring-offset-2");
        // Add active ring color based on variant
        if (props.variant.includes("primary")) classes.push("ring-cyan-500");
        else if (props.variant.includes("success")) classes.push("ring-green-500");
        else if (props.variant.includes("danger")) classes.push("ring-red-500");
        else classes.push("ring-gray-500");
      }
      
      if (props.block) {
        classes.push("w-full");
      }
      
      return classes.join(" ");
    });
    
    // Badge classes
    const badgeClasses = computed(() => {
      return "ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white bg-opacity-20 text-current";
    });
    
    // Combined button classes
    const buttonClasses = computed(() => {
      return [
        baseClasses,
        sizeClasses.value,
        roundedClasses.value,
        variantClasses.value,
        stateClasses.value,
        props.customClass,
      ].filter(Boolean).join(" ");
    });
    
    // Event handlers
    const handleClick = (event) => {
      if (props.disabled || props.loading) {
        event.preventDefault();
        return;
      }
      emit("click", event);
    };
    
    const handleFocus = (event) => {
      emit("focus", event);
    };
    
    const handleBlur = (event) => {
      emit("blur", event);
    };
    
    return {
      hasContent,
      buttonClasses,
      badgeClasses,
      handleClick,
      handleFocus,
      handleBlur,
    };
  },
};
</script>
