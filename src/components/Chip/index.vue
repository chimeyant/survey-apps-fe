<template>
  <span
    :class="[
      'inline-flex items-center px-3 py-1 rounded-full font-medium text-xs transition-all duration-200',
      chipBg,
      chipText,
      chipBorder,
      { 'opacity-70': disabled }
    ]"
    :style="customStyle"
  >
    <slot>
      {{ label }}
    </slot>
    <button
      v-if="closable"
      @click="handleClose"
      class="ml-2 focus:outline-none"
      :aria-label="'Close chip'"
      tabindex="0"
      type="button"
    >
      <i class="ri-close-line text-xs"></i>
    </button>
  </span>
</template>

<script>
import { computed } from "vue";

const COLOR_MAP = {
  success: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border border-green-300"
  },
  info: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border border-blue-300"
  },
  warning: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border border-yellow-300"
  },
  error: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border border-red-300"
  },
  default: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border border-gray-300"
  }
};

export default {
  name: "UChip",
  props: {
    label: {
      type: String,
      default: "Chip"
    },
    color: {
      type: String,
      default: "default" // success, info, warning, error, default
    },
    closable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    customStyle: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["close"],
  setup(props, { emit }) {
    const chipBg = computed(() => COLOR_MAP[props.color]?.bg || COLOR_MAP.default.bg);
    const chipText = computed(() => COLOR_MAP[props.color]?.text || COLOR_MAP.default.text);
    const chipBorder = computed(() => COLOR_MAP[props.color]?.border || COLOR_MAP.default.border);

    const handleClose = (e) => {
      if (!props.disabled) emit("close", e);
    };

    return {
      chipBg,
      chipText,
      chipBorder,
      handleClose
    };
  }
};
</script>