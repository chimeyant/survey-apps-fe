<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-700 via-cyan-900 to-cyan-950 animate-fadeIn transition-all duration-100">
    <div class="max-w-md w-full mx-4">
      <!-- Login Card -->
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <!-- Logo and Title -->
        <div class="text-center mb-5">
          <div class="flex justify-center items-center mb-2">
            <div class="w-[200px] h-[200px]">
              <img
                src="/sms.png"
                alt="LOGO SIMPELIN"
                class="w-full h-full object-contain"
              >
            </div>
            <div class="text-cyan font-bold  italic tracking-wide ml-2"></div>
          </div>
          <div class="text-sm text-cyan-600 mb-6">
            Silahkan masukan email dan kata sandi Anda untuk melanjutkan
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-show="errstatus"
          class="w-full border-l-red-500 border-l-4 p-3 mb-6 text-sm text-cyan-900 bg-red-50 rounded-md transition-all duration-200"
          role="alert"
        >
          <i class="ri-error-warning-fill red  px-2 text-xl"></i> 
          <span class="font-medium">Error..! </span> {{ errmessage }}.
        </div>

        <!-- Login Form -->
        <form @submit.prevent="postSignin" class="space-y-6">
          <!-- Email Input -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="ri-mail-line text-cyan-500"></i>
            </div>
            <input
              type="email"
              v-model="email"
              class="w-full pl-10 pr-4 py-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 bg-cyan-50/30"
              placeholder="Masukan Email Anda..."
              required
            >
          </div>

          <!-- Password Input -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="ri-lock-password-line text-cyan-500"></i>
            </div>
            <input
              :type="showpassword ? 'text' : 'password'"
              v-model="password"
              class="w-full pl-10 pr-12 py-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 bg-cyan-50/30"
              placeholder="Masukan Kata Sandi Anda"
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

          <!-- Forgot Password -->
          <div class="flex justify-end">
            <span class="text-sm text-cyan-600 hover:text-cyan-800 hover:cursor-pointer transition-colors duration-200">
              Lupa kata sandi?
            </span>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            class="w-full bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:from-cyan-600 hover:to-cyan-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 shadow-cyan-200/40 shadow-md"
          >
            <span class="tracking-wider">MASUK</span>
          </button>
        </form>

        <!-- Additional Info -->
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600">
            Belum punya akun? 
            <span class="text-cyan-600 hover:text-cyan-800 hover:cursor-pointer font-medium">
              Daftar disini
            </span>
          </p>
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

    const email = ref("");
    const password = ref("");
    const errstatus = ref(false);
    const errmessage = ref("");
    const showpassword = ref(false);

    const postSignin = async () => {
      // Reset error state
      errstatus.value = false;
      errmessage.value = "";

      // Validation
      if (!email.value || email.value.trim() === "") {
        setError("Email tidak boleh kosong...!");
        return;
      }

      if (!password.value || password.value.trim() === "") {
        setError("Kata Sandi tidak boleh kosong...!");
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        setError("Format email tidak valid...!");
        return;
      }

      const payload = {
        email: email.value.trim(),
        password: password.value,
      };

      try {
        const result = await store.postSignin(payload,true);
        
        if (result) {
          router.push({ name: "dashboard" });
        } else {
          setError("Email atau kata sandi tidak benar...!");
        }
      } catch (error) {
        setError("Terjadi kesalahan saat login...!");
      }
    };

    const setShowPassword = () => {
      showpassword.value = !showpassword.value;
    };

    const setError = (message) => {
      errstatus.value = true;
      errmessage.value = message;

      setTimeout(() => {
        errstatus.value = false;
        errmessage.value = "";
      }, 5000);
    };
    
    const loginWithSSO = () => {
      window.location.href = "https://pintu-umah.bantenprov.go.id/";
    };

    return {
      email,
      password,
      showpassword,
      postSignin,
      loginWithSSO,
      setShowPassword,
      errstatus,
      errmessage,
    };
  },
};
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 