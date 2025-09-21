<template>
  <div>
    <div class="min-w-full">
      <USkeletonTable
        :headers="headers"
        v-if="table.loading"
      />

    </div>
    <table
      class="min-w-full table-auto border-collapse border border-gray-300"
      v-if="!table.loading"
    >
      <!-- Table Header -->

      <thead>
        <tr class="bg-gray-200 text-xs rounded-t-md h-[30px]">
          <th
            :style="{
                '--width-custom': header.width
            }"
            :class="{
                'text-start': header.align === 'start',
                'text-center': header.align === 'center',
                'text-end': header.align==='end'
            }"
            class="w-custom px-4 py-2 border border-gray-300 text-gray-700  "
            v-for="(header, index) in headers"
            :key="index"
          >
            {{ header.title }}
          </th>
        </tr>
        <slot name="header" />
      </thead>
      <!-- Table Body -->
      <tbody>
        <slot name="body" />
      </tbody>
    </table>

  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useAppStore } from "@/store/app";
import USkeletonTable from "../SkeletonTable/index.vue";

export default {
  components: { USkeletonTable },
  props: {
    headers: {
      type: Array,
      default: [],
    },
  },

  setup(props, { emit }) {
    const store = useAppStore();
    const table = computed(() => store.table);

    watch(table.value.footer, (newVal) => {
      const params = {
        page: newVal.currentPage,
        itemsPerPage: newVal.itemsPerPage,
        keyword: newVal.keyword,
      };

      emit("update:options", params);
    });

    const headers = ref(props.headers);
    return {
      table,
      headers,
    };
  },
};
</script>