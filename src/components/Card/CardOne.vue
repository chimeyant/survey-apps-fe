<template>
  <div>
    <div class="p-5 bg-white border border-gray-200 rounded shadow-sm">
      <div class="flex items-center space-x-4">
        <div>
          <div class="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-100 text-fuchsia-400">
            <!-- Dynamic icon component -->
            <component
              :is="iconComponent"
              v-if="iconComponent"
              class="w-8 h-8 flex items-center justify-center"
            />
            <!-- Icon from string (for simple icons) -->
            <i
              v-else-if="icon"
              :class="icon"
              class="w-8 h-8 flex items-center justify-center text-2xl"
            ></i>
            <!-- Default fallback icon -->
            <span v-else>
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.3333 9.33334H28M28 9.33334V20M28 9.33334L17.3333 20L12 14.6667L4 22.6667"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </span>
          </div>
        </div>
        <div>
          <div class="text-gray-400">{{ title }}</div>
          <div class="text-2xl font-bold text-gray-900">{{ value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "Your Title"
    },
    value: {
      type: Number,
      default: 0
    },
    icon: {
      type: String,
      default: null
    },
    iconComponent: {
      type: [String, Object, Function],
      default: null
    }
  },
  setup() {},
};
</script>
