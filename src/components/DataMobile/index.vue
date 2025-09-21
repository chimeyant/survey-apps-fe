<template>
  <div>
    <div class="min-w-full">
      <USkeletonTable
        :headers="headers"
        v-if="table.loading"
      />

    </div>
    <div class="max-w-lg mx-auto">

      <!-- List items -->
      <ul class="space-1-4">
        <slot name="data">

        </slot>

      </ul>
    </div>

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
        keyWord: newVal.keyWord,
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