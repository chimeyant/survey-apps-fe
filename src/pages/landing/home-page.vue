<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
    <!-- Decorative background -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div class="absolute -top-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-cyan-500/10 blur-3xl" />
      <div class="absolute top-[60%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-3xl" />
      <div class="absolute top-[20%] left-[30%] w-[40%] h-[40%] rounded-full bg-teal-500/5 blur-2xl" />
    </div>

    <!-- Header -->
    <header class="relative z-10 border-b border-slate-800/50">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 md:h-20">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <i class="ri-survey-line text-white text-xl"></i>
            </div>
            <div>
              <span class="font-bold text-lg text-white tracking-tight">Survey</span>
              <span class="hidden sm:inline-block text-slate-400 text-sm ml-1 font-normal">Partisipasi Publik</span>
            </div>
          </div>
          <a
            href="/auth/login"
            class="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
          >
            Masuk Admin
          </a>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <main class="relative z-10">
      <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-20">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-6">
            Suara Anda
            <span class="block mt-1 bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Membangun Pelayanan Lebih Baik</span>
          </h1>
          <p class="text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed">
            Isi survey secara mudah dan aman. Masukkan kode survey atau tempel link yang Anda terima, lalu selesaikan dalam beberapa menit.
          </p>

          <!-- Survey code / link input -->
          <div class="max-w-xl mx-auto">
            <div class="flex flex-col sm:flex-row gap-3">
              <div class="flex-1 relative">
                <i class="ri-link absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg"></i>
                <input
                  v-model="surveyInput"
                  type="text"
                  placeholder="Tempel link survey atau masukkan kode"
                  class="w-full h-14 pl-12 pr-4 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                  @keydown.enter="goToSurvey"
                />
              </div>
              <button
                type="button"
                @click="goToSurvey"
                :disabled="!surveyInputTrim"
                class="h-14 px-8 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                <i class="ri-arrow-right-line text-xl"></i>
                Mulai Isi Survey
              </button>
            </div>
            <p v-if="inputError" class="mt-2 text-sm text-rose-400 flex items-center justify-center gap-1">
              <i class="ri-error-warning-line"></i>
              {{ inputError }}
            </p>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-slate-800/50">
        <h2 class="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
          Mengapa Mengisi Survey?
        </h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6 hover:border-cyan-500/30 transition-colors">
            <div class="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4">
              <i class="ri-megaphone-line text-2xl text-cyan-400"></i>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Suara Didengar</h3>
            <p class="text-slate-400 text-sm leading-relaxed">Masukan Anda digunakan untuk perbaikan pelayanan dan kebijakan.</p>
          </div>
          <div class="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6 hover:border-indigo-500/30 transition-colors">
            <div class="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4">
              <i class="ri-time-line text-2xl text-indigo-400"></i>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Cepat & Praktis</h3>
            <p class="text-slate-400 text-sm leading-relaxed">Isi kapan saja dari perangkat Anda, hanya beberapa menit.</p>
          </div>
          <div class="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6 hover:border-teal-500/30 transition-colors">
            <div class="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center mb-4">
              <i class="ri-shield-check-line text-2xl text-teal-400"></i>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Aman & Privasi</h3>
            <p class="text-slate-400 text-sm leading-relaxed">Data dijaga kerahasiaannya dan hanya untuk keperluan evaluasi.</p>
          </div>
          <div class="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6 hover:border-violet-500/30 transition-colors">
            <div class="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4">
              <i class="ri-line-chart-line text-2xl text-violet-400"></i>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Dampak Nyata</h3>
            <p class="text-slate-400 text-sm leading-relaxed">Hasil survey mendorong peningkatan kualitas pelayanan publik.</p>
          </div>
        </div>
      </section>

      <!-- How it works -->
      <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-slate-800/50">
        <h2 class="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
          Cara Mengisi Survey
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-cyan-400 font-bold text-xl">1</div>
            <h3 class="text-lg font-semibold text-white mb-2">Masukkan Kode atau Link</h3>
            <p class="text-slate-400 text-sm">Tempel link survey yang Anda terima atau masukkan kode survey di atas.</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-cyan-400 font-bold text-xl">2</div>
            <h3 class="text-lg font-semibold text-white mb-2">Jawab Pertanyaan</h3>
            <p class="text-slate-400 text-sm">Isi formulir dengan jujur. Beberapa pertanyaan bisa dilengkapi dengan lokasi atau lampiran.</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-cyan-400 font-bold text-xl">3</div>
            <h3 class="text-lg font-semibold text-white mb-2">Kirim</h3>
            <p class="text-slate-400 text-sm">Klik kirim. Anda akan mendapat konfirmasi dan terima kasih atas partisipasinya.</p>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="relative z-10 border-t border-slate-800/50 mt-auto">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center">
              <i class="ri-survey-line text-white text-sm"></i>
            </div>
            <span class="text-slate-400 text-sm">Sistem Survey Partisipasi Publik</span>
          </div>
          <div class="flex items-center gap-6 text-sm text-slate-500">
            <a href="/auth/login" class="hover:text-cyan-400 transition-colors">Admin</a>
          </div>
        </div>
        <p class="text-center md:text-left text-slate-600 text-xs mt-4">
          © {{ new Date().getFullYear() }} Survey. Partisipasi Anda membantu peningkatan pelayanan.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/store/app";

const router = useRouter();
const store = useAppStore();
const surveyInput = ref("");
const inputError = ref("");

const surveyInputTrim = computed(() => (surveyInput.value || "").trim());

/** Extract survey topic UUID from pasted URL or return trimmed input as-is if it looks like UUID */
function extractSurveyId(input) {
  const raw = (input || "").trim();
  if (!raw) return null;
  // Match path like /survey/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx or /survey/uuid-here
  const match = raw.match(/\/survey\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  // If it's a full URL with same origin or path
  try {
    const url = new URL(raw);
    const path = url.pathname;
    const surveyMatch = path.match(/\/survey\/([a-zA-Z0-9_-]+)/);
    if (surveyMatch) return surveyMatch[1];
  } catch (_) {}
  // Otherwise treat as raw code/uuid (allow letters, numbers, dash, underscore)
  if (/^[a-zA-Z0-9_-]+$/.test(raw)) return raw;
  return null;
}

function goToSurvey() {
  inputError.value = "";
  const id = extractSurveyId(surveyInput.value);
  if (!id) {
    inputError.value = "Masukkan kode survey atau tempel link survey yang valid.";
    return;
  }
  router.push({ path: `/survey/${id}` });
}
</script>
