<template>
  <div :class="`flex h-[30px] items-center mx-2 px-5 rounded-full gap-x-1 bg-white border border-gray-300 ` ">
    <!-- firsPage -->
    <button
      @click="changePage(1)"
      :disabled="currentPage === 1"
      :class="`w-[20px] h-[20px] bg-gray-500 rounded-full flex justify-center items-center hover:cursor-pointer hover:bg-gray-600 hover:scale-125`"
    >
      <i class="ri-rewind-start-fill text-white text-xs"></i>
    </button>

    <!-- Previous Page -->
    <button
      @click="changePage(currentPage - 1)"
      :disabled="currentPage ===1"
      :class="`w-[20px] h-[20px] bg-gray-500 rounded-full flex justify-center items-center mr-2 hover:cursor-pointer hover:bg-gray-600 hover:scale-125`"
    >
      <i class="ri-play-reverse-mini-fill text-white text-xs"></i>
    </button>

    <!-- Generate Page -->
    <button
      v-for="page in pages"
      :key="page"
      @click="changePage(page)"
      :class="
        page == currentPage ? `bg-gray-500 animate-pulse   w-[20px] h-[20px] bg-gray-500 rounded-sm   flex justify-center items-center text-xs text-white hover:cursor-pointer hover:bg-gray-600  rounded-sm w-[20px] h-[20px]` : `bg-gray-500 text-xs rounded-sm w-[20px] h-[20px]`"
    >
      {{ page }}
    </button>

    <!-- Next page -->
    <button
      @click="changePage(currentPage+1)"
      :disabled="currentPage === totalPages"
      :class="`w-[20px] h-[20px] bg-gray-500 rounded-full flex justify-center items-center ml-2 hover:cursor-pointer hover:bg-gray-600 hover:scale-125`"
    >
      <i class="ri-play-mini-fill text-white text-xs"></i>
    </button>

    <!-- Last Page -->
    <button
      @click="changePage(totalPages)"
      :disabled="currentPage===totalPages"
      :class="`w-[20px] h-[20px] bg-gray-500 rounded-full flex justify-center items-center hover:cursor-pointer hover:bg-gray-600 hover:scale-125`"
    >
      <i class="ri-forward-end-fill text-white text-xs"></i>
    </button>

  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useAppStore } from "@/store/app";

export default {
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const store = useAppStore();
    const themeColors = computed(() => store.getThemeColors);
    const currentPage = ref(props.currentPage);
    const totalPages = ref(props.totalPages);


    //wathing data
    watch(
      () => props.currentPage,
      (newVal) => {
        currentPage.value = newVal;
      }
    );

    watch(
      () => props.totalPages,
      (newVal) => {
        totalPages.value = newVal;
      }
    );

    // Computed property to generate a limited list of page numbers
    const pages = computed(() => {
      const maxVisiblePages = 5;
      const pagesArray = [];

      // Calculate the start and end of the visible pages
      let start = Math.max(
        1,
        props.currentPage - Math.floor(maxVisiblePages / 2)
      );
      let end = Math.min(props.totalPages, start + maxVisiblePages - 1);

      // Adjust if we are near the end
      if (end - start < maxVisiblePages - 1) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      // Fill in page numbers
      for (let i = start; i <= end; i++) {
        pagesArray.push(i);
      }

      // Add ellipsis if needed
      if (start > 1) pagesArray.unshift("...");
      if (end < props.totalPages) pagesArray.push("...");

      return pagesArray;
    });

    // Method to change the page and emit event
    const changePage = (page) => {
      if (page === "...") return; // Do nothing if the page is ellipsis
      if (page >= 1 && page <= props.totalPages) {
        emit("update:page", page);
      }
    };

    return {
      currentPage,
      totalPages,
      pages,
      changePage,
      themeColors,
    };
  },
};
</script>