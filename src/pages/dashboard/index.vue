<template>
    <dashboard />
  </template>
  
  <script>
  import { useAppStore } from "@/store/app";
  import { computed, onMounted, ref } from "vue";
  import dashboard from "@/modules/dashboard/dashboard.vue";
  export default {
    components: {
      dashboard,
    },
    setup() {
      const store = useAppStore();
      const theme = computed(() => store.theme);
      onMounted(() => {});
    },
  };
  </script>
  
    
  