<template>
  <div>
    <div class="min-w-full">
      <USkeletonTable
        :headers="headers"
        v-if="table.loading"
      />

    </div>
    <table
      class="min-w-full table-fixed border-collapse border border-gray-300"
      v-if="!table.loading"
    >
      <!-- Table Header -->
      <thead>
        <tr class="bg-gray-200 text-xs rounded-t-md h-[30px]">
          <th
            v-for="(header, index) in headers"
            :key="header.key || index"
            :style="thStyle(header)"
            :class="{
                'text-start': header.align === 'start',
                'text-center': header.align === 'center',
                'text-end': header.align==='end'
            }"
            class="relative select-none px-4 py-2 border border-gray-300 text-gray-700"
          >
            {{ header.title }}
            <div
              class="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-cyan-400/50 active:bg-cyan-500"
              aria-label="Resize column"
              @mousedown.prevent="onResizeStart($event, header)"
            />
          </th>
        </tr>
        <slot name="header" />
      </thead>
      <tbody>
        <slot name="body" />
      </tbody>
    </table>

  </div>
</template>

<script>
import { computed, ref, watch, onMounted, onUnmounted } from "vue";
import { useAppStore } from "@/store/app";
import USkeletonTable from "../SkeletonTable/index.vue";

export default {
  components: { USkeletonTable },
  props: {
    headers: {
      type: Array,
      default: [],
    },
    columnWidths: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["update:options", "update:columnWidths"],

  setup(props, { emit }) {
    const store = useAppStore();
    const table = computed(() => store.table);

    const localWidths = ref({ ...(props.columnWidths || {}) });
    watch(
      () => props.columnWidths,
      (v) => {
        if (v && typeof v === "object") localWidths.value = { ...v };
      },
      { deep: true }
    );

    const resizing = ref(null);
    const startX = ref(0);
    const startWidth = ref(0);

    const headers = computed(() => props.headers || []);

    const thStyle = (header) => {
      const key = header.key ?? header.title;
      const w = localWidths.value[key];
      if (w != null) return { width: `${w}px`, minWidth: `${w}px`, maxWidth: `${w}px` };
      const def = header.width || "auto";
      if (def === "auto") return {};
      return { width: def, minWidth: def };
    };

    const onResizeStart = (e, header) => {
      const key = header.key ?? header.title;
      const th = e.target?.closest("th");
      if (!th) return;
      resizing.value = key;
      startX.value = e.clientX;
      startWidth.value = th.offsetWidth;
    };

    const onMouseMove = (e) => {
      if (resizing.value == null) return;
      const dx = e.clientX - startX.value;
      const newW = Math.max(40, startWidth.value + dx);
      localWidths.value = { ...localWidths.value, [resizing.value]: newW };
      emit("update:columnWidths", { ...localWidths.value });
    };

    const onMouseUp = () => {
      if (resizing.value != null) {
        resizing.value = null;
      }
    };

    onMounted(() => {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
    onUnmounted(() => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    });

    watch(() => table.value?.footer, (newVal) => {
      if (!newVal) return;
      const params = {
        page: newVal.currentPage,
        itemsPerPage: newVal.itemsPerPage,
        keyword: newVal.keyword,
      };
      emit("update:options", params);
    }, { deep: true });

    return {
      table,
      headers,
      thStyle,
      onResizeStart,
    };
  },
};
</script>