<template>
  <div class="flex items-center">
    <label
      :for="checkboxId"
      class="relative inline-flex items-center cursor-pointer"
      :class="{ 'cursor-not-allowed opacity-50': disabled }"
    >
      <input
        :id="checkboxId"
        ref="checkboxRef"
        type="checkbox"
        :checked="isChecked"
        :disabled="disabled"
        :readonly="readonly"
        :class="checkboxClasses"
        @change="handleChange"
      />
      <span
        v-if="label"
        class="ml-2 text-sm text-gray-700"
        :class="{ 'text-gray-500': disabled }"
      >
        {{ label }}
        <span
          v-if="required"
          class="text-red-500 ml-1"
        >*</span>
      </span>
    </label>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";

export default {
  name: "UCheckbox",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "md",
      validator: (value) => ["sm", "md", "lg"].includes(value),
    },
    color: {
      type: String,
      default: "cyan",
      validator: (value) =>
        ["cyan", "blue", "green", "red", "yellow", "purple", "gray"].includes(
          value
        ),
    },
  },
  setup(props, { emit }) {
    const checkboxRef = ref(null);
    const checkboxId = `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const isChecked = ref(props.modelValue);

    // Watch model to change
    watch(
      () => props.modelValue,
      (newVal) => {
        isChecked.value = newVal;
      },
      { immediate: true }
    );

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
      const baseClasses =
        "rounded border focus:ring-2 focus:ring-offset-0 transition-colors duration-200 cursor-pointer";

      const stateClasses = [];

      // Default state
      stateClasses.push(colorClasses.value);

      // Disabled state
      if (props.disabled) {
        stateClasses.push("opacity-50 cursor-not-allowed bg-gray-100");
      }
      // Readonly state
      else if (props.readonly) {
        stateClasses.push("cursor-default");
      }

      return [baseClasses, sizeClasses.value, ...stateClasses]
        .filter(Boolean)
        .join(" ");
    });

    const handleChange = (event) => {
      if (!props.disabled && !props.readonly) {
        isChecked.value = event.target.checked;
        emit("update:modelValue", event.target.checked);
      }
    };

    return {
      checkboxRef,
      checkboxId,
      isChecked,
      checkboxClasses,
      handleChange,
    };
  },
};
</script>

