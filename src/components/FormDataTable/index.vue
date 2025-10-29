<template>
  <div
    class="flex flex-col h-full w-full  animate-fadeIn px-2"
    v-show="!form.page"
  >
    <div class="lg:w-full h-[45px] bg-gradient-to-r from-cyan-700 to-cyan-500  relative overflow-hidden rounded-t-md ">
      <div class="flex justify-between items-center h-full w-full px-5">
        <div class="flex w-full h-full justify-start items-center py-2">
          <div
            class="text-gray-700 animate-fadeIn duration-300 "
            v-if="!page.actions.search"
          >
            <span class="text-white">
              {{ title }}
            </span>
          </div>
          <div
            class="flex w-[300px] h-[35px] bg-white rounded-full overflow-hidden px-4 animate-fadeIn border border-cyan-300 text-sm border-3"
            v-if="page.actions.search"
          >
            <input
              type="text"
              placeholder="Pencarian"
              class="focus:outline-none text-gray-700 w-full"
              v-model="keyWord"
            >
          </div>
        </div>
        <div :class="`flex gap-x-3 bg-white px-2 rounded-full`">
          <div :class="`text-${themeColors.primary}-600 text-2xl`">
            <i
              class="ri-refresh-fill hover:cursor-pointer"
              :class="`hover:text-${themeColors.primary}-700 text-green-500`"
              @click="actionRefresh"
            ></i>
            <i
              class="ri-search-2-line hover:cursor-pointer"
              :class="`hover:text-${themeColors.primary}-700 text-purple-500`"
              @click="page.actions.search = !page.actions.search"
            ></i>
            <i
              v-if="page.actions.add"
              class="ri-add-circle-fill hover:cursor-pointer"
              :class="`hover:text-${themeColors.primary}-700 text-blue-500`"
              @click="actionAdd"
            ></i>
            <i
              v-if="page.actions.print"
              @click="actionPrint"
              class="ri-printer-fill hover:cursor-pointer"
              :class="`hover:text-${themeColors.primary}-700`"
            ></i>
            <i
              v-if="page.actions.export"
              @click="actionExport"
              class="ri-file-excel-fill hover:cursor-pointer"
              :class="`hover:text-${themeColors.primary}-700`"
            ></i>
            <i
              v-if="page.actions.bulkdelete"
              @click="actionBulkDelete"
              class="ri-delete-bin-3-fill hover:cursor-pointer"
              :class="`hover:text-${themeColors.primary}-700`"
            ></i>
            <i
              v-if="page.actions.close"
              @click="actionClose"
              class="ri-close-circle-fill hover:cursor-pointer"
              :class="`hover:text-${themeColors.primary}-700`"
            ></i>
            <i
              v-if="page.actions.back"
              @click="actionBack"
              class="ri-arrow-left-circle-fill hover:cursor-pointer"
              :class="`hover:text-${themeColors.primary}-700 text-orange-500`"
            ></i>
            <i
              v-if="page.actions.help"
              @click="actionHelp"
              class="ri-question-fill hover:cursor-pointer"
              :class="`hover:text-${themeColors.primary}-700`"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <div class="min-h-[65vh] w-full bg-gradient-to-b from-white-100 to-white shadow-lg round-b-md">
      <div class=" mx-5 my-5  overflow-scroll min-h-[65vh] ">
        <slot name="data-table" />
      </div>
    </div>
  </div>

</template>

<script>
import { useAppStore } from "@/store/app";
import { computed, ref, watch } from "vue";
export default {
  props: {
    title: {
      type: String,
      default: "Your Title Here",
    },
    keyWord: {
      type: String,
      default: null,
    },
    show: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const store = useAppStore();
    const themeColors = computed(() => store.getThemeColors);
    const page = computed(() => store.page);
    const title = ref(props.title);
    const keyWord = ref(props.keyWord);
    const show = ref(props.show);
    const form = computed(() => store.form);

    watch(
      () => props.show,
      (newVal) => {
        show.value = newVal;
      }
    );

    watch(
      () => page.value.actions.search,
      (newVal) => {
        if (!newVal) {
          keyWord.value = null;
        }
      }
    );

    const actionRefresh = () => {
      emit("onRefresh");
    };

    const actionAdd = () => {
      emit("onAdd");
    };

    const actionPrint = () => {
      emit("onPrint");
    };

    const actionExport = () => {
      emit("onExport");
    };

    const actionBulkDelete = () => {
      emit("onBulkDelete");
    };

    const actionClose = () => {
      emit("onClose");
    };

    const actionHelp = () => {
      emit("onHelp");
    };

    const actionBack = () => {
      emit("onBack");
    };

    // Listen Ketword
    watch(keyWord, (newVal) => {
      emit("update:keyWord", newVal);
    });

    return {
      page,
      form,
      title,
      keyWord,
      actionRefresh,
      actionAdd,
      actionPrint,
      actionExport,
      actionBulkDelete,
      actionClose,
      actionBack,
      actionHelp,
      themeColors,
    };
  },
};
</script>