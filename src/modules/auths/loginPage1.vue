<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex items-center justify-center">
    <!-- Decorative background (sama seperti home-page) -->
    <div
      class="fixed inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div class="absolute -top-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-cyan-500/10 blur-3xl" />
      <div class="absolute top-[60%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-3xl" />
      <div class="absolute top-[20%] left-[30%] w-[40%] h-[40%] rounded-full bg-teal-500/5 blur-2xl" />
    </div>

    <div class="relative z-10 w-full max-w-md mx-4">
      <!-- Login Card -->
      <div class="rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-2xl shadow-black/20 p-8">
        <!-- Logo and Title -->
        <div class="text-center mb-6">
          <div class="flex justify-center items-center mb-4">
            <div class="w-32 h-32 rounded-2xl flex items-center justify-center overflow-hidden">
              <img
                src="/sms-transparent.png"
                alt="Logo"
                class="w-full h-full object-contain p-2 bg-white rounded-2xl"
              >
            </div>
          </div>
          <h1 class="text-xl font-bold text-white tracking-tight mb-1">
            Masuk Admin
          </h1>
          <p class="text-sm text-slate-400">
            Masukkan email dan kata sandi Anda untuk melanjutkan
          </p>
        </div>

        <!-- Error Message -->
        <div
          v-show="errstatus"
          class="w-full border border-rose-500/50 bg-rose-500/10 rounded-xl p-3 mb-5 text-sm text-rose-400 flex items-center gap-2 transition-all duration-200"
          role="alert"
        >
          <i class="ri-error-warning-fill text-lg flex-shrink-0"></i>
          <span class="font-medium">Error:</span> {{ errmessage }}
        </div>

        <!-- Login Form -->
        <form
          @submit.prevent="postSignin"
          class="space-y-5"
        >
          <!-- Email Input -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i class="ri-mail-line text-slate-500 text-lg"></i>
            </div>
            <input
              type="email"
              v-model="email"
              class="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-800/80 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
              placeholder="Masukkan email Anda..."
              required
            >
          </div>

          <!-- Password Input -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i class="ri-lock-password-line text-slate-500 text-lg"></i>
            </div>
            <input
              :type="showpassword ? 'text' : 'password'"
              v-model="password"
              class="w-full h-12 pl-11 pr-12 rounded-xl bg-slate-800/80 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
              placeholder="Masukkan kata sandi"
              required
            >
            <button
              type="button"
              @click="setShowPassword"
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-cyan-400 transition-colors"
              aria-label="Toggle password visibility"
            >
              <i
                :class="showpassword ? 'ri-eye-off-line' : 'ri-eye-line'"
                class="text-lg"
              ></i>
            </button>
          </div>

          <!-- Forgot Password -->
          <div class="flex justify-end">
            <span class="text-sm text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors">
              Lupa kata sandi?
            </span>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            class="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <i class="ri-login-box-line text-xl"></i>
            <span class="tracking-wide">MASUK</span>
          </button>
        </form>

        <!-- Additional Info -->
        <div class="mt-6 pt-6 border-t border-slate-700/50 text-center">
          <p class="text-sm text-slate-400">
            Belum punya akun?
            <span class="text-cyan-400 hover:text-cyan-300 cursor-pointer font-medium transition-colors">
              Daftar di sini
            </span>
          </p>
        </div>
      </div>

      <!-- Back to home -->
      <p class="text-center mt-6">
        <a
          href="/"
          class="text-sm text-slate-500 hover:text-cyan-400 transition-colors"
        >
          <i class="ri-arrow-left-line align-middle mr-1"></i>
          Kembali ke beranda
        </a>
      </p>
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
      errstatus.value = false;
      errmessage.value = "";

      if (!email.value || email.value.trim() === "") {
        setError("Email tidak boleh kosong.");
        return;
      }

      if (!password.value || password.value.trim() === "") {
        setError("Kata sandi tidak boleh kosong.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        setError("Format email tidak valid.");
        return;
      }

      const payload = {
        email: email.value.trim(),
        password: password.value,
      };

      try {
        const result = await store.postSignin(payload, true);

        if (result) {
          router.push({ name: "dashboard" });
        } else {
          setError("Email atau kata sandi tidak benar.");
        }
      } catch (error) {
        setError("Terjadi kesalahan saat login.");
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
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
