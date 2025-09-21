<template>
  <div
    class="flex flex-col h-full w-full animate-fadeIn"
    v-show="form.page"
    
  >
    <div class="lg:w-full h-[48px] bg-cyan-700 rounded-t-md border-b-cyan-900 border-b-4">
      <div class="flex justify-between items-center h-full w-full px-5">
        <div class="flex w-full h-full justify-start items-center py-2">
          <div
            class="text-white"
            v-if="!page.actions.search"
          >
            {{ title }}
          </div>
          <div
            class="flex w-auto h-full bg-white rounded-full overflow-hidden px-4 animate-fadeIn"
            v-if="page.actions.search"
          >
            <input
              type="text"
              placeholder="Pencarian"
              class="focus:outline-none"
              v-model="keyWord"
            >
          </div>
        </div>
        <div class="flex gap-x-3 bg-white px-2 rounded-full ">
          <div class="text-cyan-600 text-2xl">

            <i
              @click="actionClose"
              class="ri-close-circle-fill hover:cursor-pointer hover:text-cyan-700"
            ></i>

            <i
              @click="actionRefresh"
              class="ri-refresh-fill hover:cursor-pointer hover:text-cyan-700"
            ></i>

            <i
              @click="actionHelp"
              class="ri-question-fill hover:cursor-pointer hover:text-cyan-700"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <div class="min-h-[74vh] w-full bg-white shadow round-b-md">
      <div class="mx-auto overflow-scroll min-h-[70vh] ">
        <slot name="body" />
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
    keyword: {
      type: Object,
      default: null,
    },
  },
  setup(props, { emit }) {
    const store = useAppStore();

    const page = computed(() => store.page);
    const title = ref(props.title);
    const keyWord = ref(props.keyword);
    const form = computed(() => store.form);

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
      emit("update:keyword", newVal);
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
    };
  },
};
</script>