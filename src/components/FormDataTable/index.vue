<template>
  <div
    v-show="!form.page"
    class="flex flex-col h-full w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
  >
    <!-- Toolbar -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-3 sm:px-5 sm:py-3.5 bg-gray-50 border-b border-gray-200">
      <!-- Left: title + search -->
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 min-w-0 flex-1">
        <h2 class="text-lg font-semibold text-gray-900 truncate shrink-0">
          {{ title }}
        </h2>
        <div
          v-if="page.actions.search"
          class="flex items-center min-w-0 max-w-sm"
        >
          <div class="relative w-full">
            <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            <input
              v-model="keyWord"
              type="text"
              placeholder="Cari..."
              class="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- Right: actions -->
      <div class="flex items-center gap-1 flex-shrink-0">
        <button
          v-if="page.actions.refresh"
          type="button"
          title="Segarkan"
          class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
          @click="actionRefresh"
        >
          <i class="ri-refresh-line text-lg"></i>
        </button>
        <button
          v-if="page.actions.search !== undefined"
          type="button"
          :title="page.actions.search ? 'Tutup pencarian' : 'Pencarian'"
          class="flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
          :class="page.actions.search ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'"
          :aria-pressed="page.actions.search"
          @click="toggleSearch"
        >
          <i class="ri-search-line text-lg"></i>
        </button>
        <button
          v-if="page.actions.add"
          type="button"
          title="Tambah"
          class="flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
          @click="actionAdd"
        >
          <i class="ri-add-circle-line text-lg"></i>
        </button>
        <button
          v-if="page.actions.print"
          type="button"
          title="Cetak"
          class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
          @click="actionPrint"
        >
          <i class="ri-printer-line text-lg"></i>
        </button>
        <button
          v-if="page.actions.export"
          type="button"
          title="Ekspor"
          class="flex h-9 w-9 items-center justify-center rounded-lg text-emerald-600 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-colors"
          @click="actionExport"
        >
          <i class="ri-file-excel-2-line text-lg"></i>
        </button>
        <button
          v-if="page.actions.bulkdelete"
          type="button"
          title="Hapus terpilih"
          class="flex h-9 w-9 items-center justify-center rounded-lg text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
          @click="actionBulkDelete"
        >
          <i class="ri-delete-bin-line text-lg"></i>
        </button>
        <button
          v-if="page.actions.close"
          type="button"
          title="Tutup"
          class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
          @click="actionClose"
        >
          <i class="ri-close-circle-line text-lg"></i>
        </button>
        <button
          v-if="page.actions.back"
          type="button"
          title="Kembali"
          class="flex h-9 w-9 items-center justify-center rounded-lg text-amber-600 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-colors"
          @click="actionBack"
        >
          <i class="ri-arrow-left-circle-line text-lg"></i>
        </button>
        <button
          v-if="page.actions.help"
          type="button"
          title="Bantuan"
          class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
          @click="actionHelp"
        >
          <i class="ri-question-line text-lg"></i>
        </button>
      </div>
    </div>

    <!-- Table slot -->
    <div class="flex-1 min-h-[50vh] overflow-auto p-4 sm:p-5">
      <slot name="data-table" />
    </div>
  </div>
</template>

<script>
import { useAppStore } from "@/store/app";
import { computed, ref, watch } from "vue";

export default {
  name: "UFormDataTable",
  props: {
    title: {
      type: String,
      default: "Daftar",
    },
    keyWord: {
      type: String,
      default: "",
    },
    show: {
      type: Boolean,
      default: true,
    },
  },
  emits: [
    "onRefresh",
    "onAdd",
    "onPrint",
    "onExport",
    "onBulkDelete",
    "onClose",
    "onBack",
    "onHelp",
    "update:keyWord",
  ],
  setup(props, { emit }) {
    const store = useAppStore();
    const page = computed(() => store.page);
    const form = computed(() => store.form);
    const title = ref(props.title);
    const keyWord = ref(props.keyWord ?? "");
    const show = ref(props.show);

    watch(
      () => props.title,
      (v) => { title.value = v; }
    );
    watch(
      () => props.show,
      (v) => { show.value = v; }
    );
    watch(
      () => page.value?.actions?.search,
      (isSearch) => {
        if (!isSearch) keyWord.value = "";
      }
    );
    watch(keyWord, (v) => {
      emit("update:keyWord", v);
    });

    const toggleSearch = () => {
      const current = page.value?.actions;
      if (current && typeof current.search === "boolean") {
        store.setPage({
          actions: { ...current, search: !current.search },
        });
      }
    };

    const actionRefresh = () => emit("onRefresh");
    const actionAdd = () => emit("onAdd");
    const actionPrint = () => emit("onPrint");
    const actionExport = () => emit("onExport");
    const actionBulkDelete = () => emit("onBulkDelete");
    const actionClose = () => emit("onClose");
    const actionBack = () => emit("onBack");
    const actionHelp = () => emit("onHelp");

    return {
      page,
      form,
      title,
      keyWord,
      show,
      toggleSearch,
      actionRefresh,
      actionAdd,
      actionPrint,
      actionExport,
      actionBulkDelete,
      actionClose,
      actionBack,
      actionHelp,
    };
  },
};
</script>
