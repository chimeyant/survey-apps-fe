<template>
  <div class="container-fluid ">
    <div class="w-full h-[200px]">
        <u-form-custome-page title="Ganti Kata Sandi" height="h-[300px]">
            <template v-slot:body>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. At eligendi, odio numquam obcaecati doloribus quod nobis quos voluptas! Debitis magnam quam enim commodi nostrum obcaecati repudiandae expedita velit ad cupiditate.
            </template>
        </u-form-custome-page>
    </div>
  </div>
</template>

<script>
import { useAppStore } from "@/store/app";
import { computed, onMounted } from "vue";
import {UFormPage,UFormCustomePage} from "@/components/";


export default {
  name: "ChangePassword",
  components: {
    UFormPage,
    UFormCustomePage,
  },
  setup() {
    const store = useAppStore();
    const device = computed(() => store.device);
    const theme = computed(() => store.getTheme);
    const types = computed(() => store.types);
    const page = computed(() => store.page);
    const form = computed(() => store.form);
    const colors = computed(() => store.colors);
    const table = computed(() => store.table);

    onMounted(() => {
        store.setPage({
        title: "Ganti Kata Sandi",
        subtitle: "Formulir Penggantian Kata Sandi",
        breadcrumbs: [
          {
            name: "",
            title: "Utilities",
          },
          {
            name: "change-password",
            title: "Ganti Kata Sandi",
          },
        ],
        dataUrl: "api/v1/utility/file-managements",
        actions: {
          refresh: true,
          add: false,
          edit: false,
          delete: true,
          bulkdelete: false,
          export: false,
          print: false,
          help: false,
          close: false,
        },
        showtable: false,
      });
    });
  },




  
};
</script>

<style scoped>

</style>