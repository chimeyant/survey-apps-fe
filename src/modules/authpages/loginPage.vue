<template>
  <div class="flex flex-col w-screen h-screen bg-gradient-to-b from-orange-400 to-orange-900 animate-fadeIn transition-all duration-100">
    <div class="flex w-full h-full justify-center items-center">
      <div class="grid grid-cols-1 lg:grid-cols-2 w-full h-full lg:h-auto  lg:w-[60%] ">
        <div class="relative hidden sm:block">
          <div class="lg:flex w-full h-full bg-teal-900   rounded-l-lg overflow-hidden ">
            <img
              :src="pathImg"
              alt=""
              srcset=""
              :key="pathImg"
              class="animate-fadeInLeft duration-300 w-full h-full object-top"
            >

          </div>

        </div>
        <div class="flex w-full h-full p-5 bg-white rounded-r-lg round-l-lg lg:rounded-l-none justify-center mb-[50px]">
          <div class="flex flex-col items-center w-full">
            <div class="flex justify-center ">
              <div class="w-[48px] h-[48px] px-2">
                <img
                  src="/logo.png"
                  alt=""
                  srcset=""
                >
              </div>
              <div class="text-teal-600 font-bold text-2xl italic tracking-wide"> Ants OKE Template</div>
            </div>
            <div class="text-sm text-teal-400 mb-[60px]">Template Application From Ant</div>
            <div
              v-show="errstatus"
              class="w-full border-l-red-900 border-l-8 p-2 mb-4 text-sm text-red-700 bg-red-100 rounded-md transition-all duration-200"
              role="alert"
            >

              <i class="ri-error-warning-fill px-2 text-xl"></i> <span class="font-medium">Error..! </span> {{ errmessage }}.
            </div>
            <div class="border border-teal-500 w-full py-1 px-4 rounded-md flex gap-2 my-2 ">
              <input
                type="text"
                class="w-full focus:outline-none text-sm"
                placeholder="Masukan Email atau Pengguna Anda...!"
                v-model="email"
              >
              <i class="ri-id-card-line text-xl text-teal-500"></i>

            </div>
            <div class="border border-teal-500 w-full py-1 px-4 rounded-md flex gap-2 my-2 ">
              <input
                :type="showpassword ? `text`: `password`"
                class="w-full focus:outline-none text-sm"
                placeholder="Masukan Kata Sandi Anda"
                v-model="password"
              >
              <i
                :class="showpassword ?`ri-lock-unlock-line` :`ri-lock-password-line`"
                class=" text-xl text-teal-500 hover:cursor-pointer"
                @click="setShowPassword"
              ></i>
            </div>
            <div class="flex justify-start w-full px-5 py-y mb-[50px]">
              <span class="text-[8pt] text-gray-400 hover:cursor-pointer hover:text-teal-500">Lupa kata sandi?</span>
            </div>
            <div class="flex w-full justify-center">
              <button
                @click="postSignin"
                class="w-full bg-teal-700 px-4 py-2 text-white rounded-lg hover:bg-teal-500 transition-all duration-200 tracking-[5px] "
              >LOGIN</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useAppStore } from "@/store/app";
import { useRouter } from "vue-router";
export default {
  setup() {
    const store = useAppStore();
    const router = useRouter();

    const email = ref(null);
    const password = ref(null);
    const errstatus = ref(false);
    const errmessage = ref(null);
    const showpassword = ref(false);

    const emailRules = [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ];

    const requiredRules = [(v) => !!v || "This field is required"];

    const postSignin = async () => {
      const payload = {
        email: email.value,
        password: password.value,
      };

      if (email.value == "" || email.value == null) {
        setError("Email tidak boleh kosong...!");
      }

      if (password.value == "" || password.value == null) {
        setError("Kata Sandi tidak boleh kosong...!");
      }

      const result = await store.postSignin(payload);

      if (result) {
        router.push({ name: "dashboard" });
      } else {
        setError("Pengguna dan kata sandi tidak benar..!");
      }
    };

    const setShowPassword = () => {
      if (showpassword.value) {
        showpassword.value = false;
      } else {
        showpassword.value = true;
      }
    };

    const setError = (message) => {
      errstatus.value = true;
      errmessage.value = message;

      setTimeout(() => {
        errstatus.value = false;
        errmessage.value = null;
      }, 5000);
    };

    const imgNum = ref(1);
    const pathImg = ref("/auth/images/komitmen.png");

    const alternateImg = () => {
      if (imgNum.value == 1) {
        pathImg.value = "/auth/images/layanan.png";
        imgNum.value = 2;
      } else {
        pathImg.value = "/auth/images/komitmen.png";
        imgNum.value = 1;
      }
    };

    onMounted(() => {
      setInterval(() => {
        alternateImg();
      }, 5000);
    });

    return {
      pathImg,
      email,
      password,
      emailRules,
      requiredRules,
      showpassword,
      postSignin,
      setShowPassword,
      errstatus,
      errmessage,
    };
  },
};
</script>