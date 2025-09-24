<template>
  <div class="container-fluid ">
    <div class="w-full h-[200px] flex justify-center items-center">
        <u-form-custome-page title="Ganti Kata Sandi" height="h-full" weight="w-[500px]">
            <template v-slot:body>
              <div class="py-10 px-5">
                <form action="
                ">
                
  
                 <!-- Password Input -->
                 <div class="py-2">
                  <div class="relative ">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="ri-lock-password-line text-cyan-500"></i>
                    </div>
                    <input
                      :type="showpassword ? 'text' : 'password'"
                      v-model="password"
                      class="w-full pl-10 pr-12 py-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 bg-cyan-50/30"
                      placeholder="Masukan Kata Sandi Baru"
                      required
                    >
                    <button
                      type="button"
                      @click="setShowPassword"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <i
                        :class="showpassword ? 'ri-eye-off-line' : 'ri-eye-line'"
                        class="text-cyan-500 hover:text-cyan-700 transition-colors duration-200"
                      ></i>
                    </button>
                  </div>
                </div>
  
                 <!-- Password Input -->
                 <div class="py-2">
                  <div class="relative ">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="ri-lock-password-line text-cyan-500"></i>
                    </div>
                    <input
                      :type="showpassword2 ? 'text' : 'password'"
                      v-model="confirm_password"
                      class="w-full pl-10 pr-12 py-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 bg-cyan-50/30"
                      placeholder="Verifikasi kata sandi"
                      required
                    >
                    <button
                      type="button"
                      @click="setShowPassword2"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <i
                        :class="showpassword ? 'ri-eye-off-line' : 'ri-eye-line'"
                        class="text-cyan-500 hover:text-cyan-700 transition-colors duration-200"
                      ></i>
                    </button>
                  </div>
                </div>
  
                <div class="flex justify-end mt-4">
                  <UButton
                    label="Simpan"
                    @click="postChangePassword"
                    rounded="md"
                    size="md"
                    iconLeft="ri-save-line"
                    variant="primary"
                    
                  />
                </div>
              </form>
                
              </div>
            </template>
        </u-form-custome-page>
    </div>
  </div>
</template>

<script>
import { useAppStore } from "@/store/app";
import { computed, onMounted, ref } from "vue";
import {UFormPage,UFormCustomePage,UButton} from "@/components/";


export default {
  name: "ChangePassword",
  components: {
    UFormPage,
    UFormCustomePage,
    UButton
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
    const showpassword = ref(false);
    const showpassword2 = ref(false);
    const password = ref('');
    const confirm_password = ref('');

    const setShowPassword = () => {
      showpassword.value = !showpassword.value;
    };
    const setShowPassword2 = () => {
      showpassword2.value = !showpassword2.value;
    };

    const postChangePassword = async () => {
      const payload = {
        password: password.value,
        confirm_password: confirm_password.value,
      }

      const result = await store.postRecord("api/v1/auth/change-password", payload,"store",true);

      if (result?.data.status) {
        store.setSnackbar(result.data.message, colors.value.SUCCESS);
      } else {
        store.setSnackbar(result.data.message, colors.value.ERROR);
      }
    };

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

    return {
      showpassword,
      showpassword2,
      password,
      confirm_password,
      setShowPassword,
      setShowPassword2,
      postChangePassword,
    };


  },
};
</script>

<style scoped>

</style>