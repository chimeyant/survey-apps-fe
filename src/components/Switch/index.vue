<template>
  <div class="flex items-center">
    <label
      for="swicth"
      class="relative inline-block w-12 h-6"
    >
      <input
        type="checkbox"
        class="sr-only hover:cursor-pointer"
        @click="toggleSwitch"
      >
      <span
        @click="toggleSwitch"
        class="block absolute inset-0 bg-gray-300 rounded-full transition-colors duration-200 ease-in-out hover:cursor-pointer"
        :class="{'bg-teal-700': isOn}"
      ></span>
      <span
        class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out hover:cursor-pointer"
        :class="isOn ? `translate-x-[100%]`: ''"
        @click="toggleSwitch"
      ></span>
      <!-- Label for the switch -->
    </label>
    <span class="ml-2 text-gray-700 text-sm">{{ label }}</span>
  </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "On",
    },
  },
  setup(props, { emit }) {
    const isOn = ref(false);
    const label = ref(props.label);

    //Watch model to change
    watch(
      () => props.modelValue,
      (newVal) => {
        isOn.value = newVal;
      }
    );

    watch(isOn, (newVal) => {
      emit("update:modelValue", newVal);
    });

    const toggleSwitch = () => {
      isOn.value = !isOn.value;
    };

    return {
      label,
      isOn,
      toggleSwitch,
    };
  },
};
</script>