<template>
  <!-- Form Dialog Delete -->
  <div
    id="dialog"
    :class="form.delete ? ``:`hidden`"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center animate-fadeIn"
  >
    <!-- Dialog Box -->
    <div class="bg-white rounded-lg shadow-lg max-w-md w-full  overflow-hidden">
      <!-- Header -->
      <div class="flex justify-between items-center mb-2 h-[48px] bg-red-700 px-4 border-b-red-900 border-b-4 animation">
        <h3 class="text-smfont-semibold text-white animate-pulse">Konfirmasi Penghapusan Data</h3>
        <i class="ri-close-circle-fill text-white hover:cursor-pointer" @click="closeForm"></i>
      </div>
      <!-- Form -->
      <div class="p-5">
        <form id="formDialogDelet">
          <div class="text-sm text-gray-800 py-2">
            Apakah Anda yakin ingin menghapus data ini?
          </div>
          <div class="font-bold text-sm mb-2">
            Peringatan
          </div>
          <div class="flex text-sm gap-x-1  ">
            <i class="ri-circle-fill"></i><span>Penghapusan data ini bersifat permanen dan tidak dapat dibatalkan.</span>
          </div>
          <div class="flex text-sm gap-x-1  ">
            <i class="ri-circle-fill"></i><span>Semua informasi terkait data yang dihapus akan hilang selamanya.</span>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end mt-5">
            <button
              type="button"
              @click="closeForm"
              class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1 rounded-sm mr-2 w-20 text-sm border-l-gray-500 border-l-4"
            >Tidak</button>
            <button
              @click="postDelete"
              type="button"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-1 w-20 rounded-sm text-sm border-l-red-800 border-l-4"
            >Ya</button>

          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useAppStore } from "@/store/app";
export default {
  setup(props, { emit }) {
    const store = useAppStore();
    const form = computed(() => store.form);

    const closeForm = () => {
      store.setForm({
        add: false,
        edit: false,
        delete: false,
      });
    };

    const postDelete = () => {
      emit("delete");
    };

    return {
      form,
      closeForm,
      postDelete,
    };
  },
};
</script>