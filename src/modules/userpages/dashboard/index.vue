<template>
    <div>
      <div class="flex justify-between">
        <div class="">
          <span class=" font-bold text-gray-600">Wellcome Back, </span><span>Perangkat Daerah {{ user.name }}</span>
        </div>
        <div class="flex justify-items-end w-60 h-10">
          <u-combo-box
            class="min"
            :items="tahuns"
          />
        </div>
      </div>
      <!-- Card Area
      <div class="grid grid-cols-12 gap-2 mt-10">
        <div class="col-span-12 lg:col-span-3">
          <card-one />
        </div>
        <div class="col-span-12 lg:col-span-3">
          <card-one />
        </div>
        <div class="col-span-12 lg:col-span-3">
          <card-one />
        </div>
        <div class="col-span-12 lg:col-span-3">
          <card-one />
        </div>
        <div class="col-span-12 lg:col-span-3">
          <card-two />
        </div>
        <div class="col-span-12 lg:col-span-3">
          <card-two />
        </div>
        <div class="col-span-12 lg:col-span-3">
          <card-two />
        </div>
        <div class="col-span-12 lg:col-span-3">
          <card-two />
        </div>
        <div class="col-span-12 lg:col-span-3">
          <card-three />
        </div>
        <div class="col-span-12 lg:col-span-3">
          <card-three />
        </div>
        <div class="col-span-12 lg:col-span-3">
          <card-three />
        </div>
        <div class="col-span-12 lg:col-span-3">
          <card-three />
        </div>
  
      </div> -->
  
      <div class="grid grid-cols-12  mt-10">
        <!-- Char Area -->
        
        
        <div class="col-span-12">
          <card-four />
        </div>
        
      </div>
    </div>
  </template>
  
  <script>
  import { useAppStore } from "@/store/app";
  import { computed, onMounted, ref } from "vue";
  import {
    UComboBox,
    BarChart,
    PieChart,
    AreaChart,
    CardOne,
    CardTwo,
    CardThree,
    CardFour,
    UMap,
  } from "../../../components";
  
  export default {
    components: {
      BarChart,
      UComboBox,
      PieChart,
      AreaChart,
      CardOne,
      CardTwo,
      CardThree,
      CardFour,
      UMap,
    },
    setup() {
      const store = useAppStore();
      const page = computed(() => store.page);
      const user = computed(() => store.user);
      const tahuns = ref([
        {
          title: 2025,
          value: 2025,
        },
      ]);
  
      onMounted(() => {
        store.setPage({
          title: "Dashboard",
          subtitle: "Berikut Daftar Seluruh Pengguna Aplikasi ",
          breadcrumbs: [
            {
              name: "dashboard",
              title: "Dashboard",
            },
          ],
          dataUrl: "api/v1/utility/users",
          actions: {
            refresh: false,
            add: false,
            edit: false,
            delete: false,
            bulkdelete: false,
            export: true,
            print: false,
            help: false,
            close: false,
          },
          showtable: false,
        });
      });
  
      return {
        user,
        tahuns,
        
      };
    },
  };
  </script>