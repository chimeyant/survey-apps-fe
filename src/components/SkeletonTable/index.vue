<template>
  <div class="overflow-x-auto w-full">
    <table class="min-w-full bg-white">
      <!-- Table Header -->
      <thead class="w-full">
        <tr>
          <th
            v-for="header in headers"
            :style="{
                '--width-custom': header.width
            }"
            :class="{
                'text-start': header.align === 'start',
                'text-center': header.align === 'center',
                'text-end': header.align==='end'
            }"
            class="w-custom px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >{{ header.title }}</th>

        </tr>
      </thead>

      <!-- Table Body (Skeleton Rows) -->
      <tbody>
        <!-- Skeleton Row -->
        <tr
          v-for="i in 5"
          :key="i"
        >
          <td
            class="px-6 py-4 border-b"
            v-for="header in headers"
          >
            <div class="animate-pulse">
              <div class="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </td>

        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    headers: {
      type: Array,
      default: [],
    },
  },
  setup(props, { emit }) {
    const headers = ref(props.headers);
    return {
      headers,
    };
  },
};
</script>