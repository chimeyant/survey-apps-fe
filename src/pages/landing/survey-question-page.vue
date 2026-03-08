<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased py-12 px-4 sm:px-6 lg:px-8">
    <!-- Decorative background -->
    <div
      class="fixed inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div class="absolute -top-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-cyan-500/10 blur-3xl" />
      <div class="absolute top-[60%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-3xl" />
      <div class="absolute top-[20%] left-[30%] w-[40%] h-[40%] rounded-full bg-teal-500/5 blur-2xl" />
    </div>

    <div class="relative z-10 max-w-5xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">
          {{ surveyInfo.name }}
        </h1>
        <p class="text-xl text-slate-400 max-w-2xl mx-auto">
          {{ surveyInfo.description }}
        </p>
      </div>

      <!-- Survey Form -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 min-h-[70vh]">
        <form
          @submit.prevent="submitSurvey"
          class="space-y-6"
        >
          <!-- Survey Session ID (di dalam card) -->
          <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-200">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 border border-gray-200">
              <span class="text-gray-600 text-sm font-medium">ID Survei:</span>
              <span class="text-gray-900 font-mono font-semibold tracking-wide">{{ surveySessionId }}</span>
              <button
                type="button"
                @click="copySurveyId"
                class="p-1 rounded-lg text-gray-500 hover:text-cyan-600 hover:bg-gray-200 transition-colors"
                title="Salin ID"
              >
                <i class="ri-file-copy-line text-lg"></i>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-12 md:grid-cols-12 gap-4">
            <template
              v-for="item in records"
              :key="getQuestionKey(item)"
            >
              <div :class="isMobile ? 'col-span-12' : item.width  || 'col-span-12'">
                <UTextField
                  v-if="item.question_type === 'text'"
                  v-model="questions[getQuestionKey(item)]"
                  :label="item.question_text"
                  :required="item.required"
                  :error="validationErrors[getQuestionKey(item)]"
                />
                <UTextArea
                  v-else-if="item.question_type === 'textarea'"
                  v-model="questions[getQuestionKey(item)]"
                  :label="item.question_text"
                  :required="item.required"
                  :error="validationErrors[getQuestionKey(item)]"
                />
                <UComboBox
                  v-else-if="item.question_type === 'select'"
                  v-model="questions[getQuestionKey(item)]"
                  :label="item.question_text"
                  :items="normalizeOptions(item.options)"
                  value-key="value"
                  label-key="title"
                  placeholder="Pilih Opsi"
                  :required="item.required"
                  :error="validationErrors[getQuestionKey(item)]"
                />
                <UComboBox
                  v-else-if="item.question_type === 'radio'"
                  v-model="questions[getQuestionKey(item)]"
                  :label="item.question_text"
                  :items="normalizeOptions(item.options)"
                  value-key="value"
                  label-key="title"
                  placeholder="Pilih salah satu"
                  :required="item.required"
                  :error="validationErrors[getQuestionKey(item)]"
                />
                <UCheckbox
                  v-else-if="item.question_type === 'checkbox'"
                  v-model="questions[getQuestionKey(item)]"
                  :label="item.question_text"
                  :required="item.required"
                />
                <UTextField
                  v-else-if="item.question_type === 'number'"
                  v-model="questions[getQuestionKey(item)]"
                  :label="item.question_text"
                  type="number"
                  :required="item.required"
                  :error="validationErrors[getQuestionKey(item)]"
                />
                <UTextField
                  v-else-if="item.question_type === 'date'"
                  v-model="questions[getQuestionKey(item)]"
                  :label="item.question_text"
                  type="date"
                  :required="item.required"
                  :error="validationErrors[getQuestionKey(item)]"
                />
                <UTextField
                  v-else-if="item.question_type === 'time'"
                  v-model="questions[getQuestionKey(item)]"
                  :label="item.question_text"
                  type="time"
                  :required="item.required"
                  :error="validationErrors[getQuestionKey(item)]"
                />
                <UFileUpload
                  v-else-if="item.question_type === 'file'"
                  v-model="questions[getQuestionKey(item)]"
                  :label="item.question_text"
                  :required="item.required"
                  folder="documents"
                  :error="validationErrors[getQuestionKey(item)]"
                />
                <USwitch
                  v-else-if="item.question_type === 'switch'"
                  v-model="questions[getQuestionKey(item)]"
                  :label="item.question_text"
                  :required="item.required"
                />
                <div v-else-if="item.question_type === 'location'">
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    {{ item.question_text }}
                    <span
                      v-if="item.required"
                      class="text-red-500"
                    >*</span>
                  </label>
                  <div :class="[
                      'rounded-xl p-4 border-2 transition-colors',
                      validationErrors[getQuestionKey(item)]
                        ? 'border-red-500 bg-red-50/50'
                        : 'border-gray-300 bg-gray-50'
                    ]">
                    <UMapCoordinatePicker
                      v-model="coordinates"
                      @update:modelValue="onLocationChange"
                      :initial-location="initialLocation"
                    />
                  </div>
                  <p
                    v-if="validationErrors[getQuestionKey(item)]"
                    class="text-sm text-red-600 mt-2"
                  >
                    {{ validationErrors[getQuestionKey(item)] }}
                  </p>
                  <p
                    v-else
                    class="text-sm text-gray-600 mt-2"
                  >
                    💡 Klik di peta atau gunakan tombol "Lokasi Saat Ini" untuk mendapatkan koordinat GPS
                  </p>
                </div>
                <div v-else-if="item.question_type === 'lokasi' || item.question_type === 'location-address'">
                  <ULokasi
                    v-model="questions[getQuestionKey(item)]"
                    :label-kecamatan="item.question_text"
                    :required="item.required"
                    :errors="{
                      district_code: validationErrors[getQuestionKey(item)] || '',
                      village_code: validationErrors[getQuestionKey(item)] || ''
                    }"
                  />
                </div>
                <div
                  v-else
                  class="text-red-500 text-sm"
                >
                  Tipe pertanyaan tidak dikenali: {{ item.question_type }}
                </div>
              </div>
            </template>

            <div class="col-span-12 flex justify-end pt-6">
              <UButton
                type="submit"
                :loading="isSubmitting"
                class="px-12 py-3 text-lg bg-gradient-to-r from-cyan-500 to-indigo-500 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-white"
                @click.prevent="submitSurvey"
              >
                Kirim Survei
              </UButton>
            </div>
          </div>
        </form>
      </div>

      <!-- Tips -->
      <div class="mt-8 bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <h3 class="text-lg font-semibold text-cyan-400 mb-3">
          💡 Tips Mengisi Survei
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-400">
          <div>
            <p class="font-medium text-slate-300 mb-2">📍 Lokasi GPS:</p>
            <ul class="space-y-1 text-slate-400">
              <li>• Gunakan tombol "Lokasi Saat Ini" untuk akurasi terbaik</li>
              <li>• Klik di peta untuk memilih lokasi</li>
            </ul>
          </div>
          <div>
            <p class="font-medium text-slate-300 mb-2">🏠 Lokasi Alamat:</p>
            <ul class="space-y-1 text-slate-400">
              <li>• Pilih Kecamatan terlebih dahulu</li>
              <li>• Lalu pilih Desa/Kelurahan</li>
            </ul>
          </div>
          <div>
            <p class="font-medium text-slate-300 mb-2">📋 Data:</p>
            <ul class="space-y-1 text-slate-400">
              <li>• Isi semua field yang bertanda *</li>
              <li>• Periksa kembali sebelum kirim</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAppStore } from "@/store/app";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, watch } from "vue";
import {
  UButton,
  UComboBox,
  UTextField,
  UTextArea,
  USwitch,
  UFileUpload,
  UMapCoordinatePicker,
  UCheckbox,
} from "@/components";
import ULokasi from "@/components/Lokasi/index.vue";
import { useMobile } from "@/composables/useMobile";

export default {
  name: "SurveyQuestionPage",
  components: {
    UButton,
    UComboBox,
    UTextField,
    UTextArea,
    USwitch,
    UFileUpload,
    UMapCoordinatePicker,
    UCheckbox,
    ULokasi,
  },
  setup() {
    const store = useAppStore();
    const route = useRoute();
    const router = useRouter();
    const { isMobile } = useMobile();

    const surveyInfo = ref({ name: "", description: "" });
    const records = ref([]);
    const questions = ref({});
    const isSubmitting = ref(false);
    const validationErrors = ref({});

    const coordinates = ref({
      latitude: null,
      longitude: null,
    });
    const initialLocation = ref({
      lat: -6.1783,
      lng: 106.6319,
    });

    const surveyTopicId = route.params.survey_topic_id;

    /** ID unik sesi survei (berbeda tiap reload) */
    const surveySessionId = ref("");

    function generateSurveySessionId() {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substr(2, 5);
      return `SRV-${timestamp.toUpperCase()}-${random.toUpperCase()}`;
    }

    function copySurveyId() {
      if (!surveySessionId.value) return;
      navigator.clipboard.writeText(surveySessionId.value).then(() => {
        store.setSnackbar?.(
          "ID survei disalin",
          store.colors?.SUCCESS ?? "success",
          store.types?.SUCCESS ?? "success"
        );
      });
    }

    /** Kunci pertanyaan (API bisa pakai id atau Id) */
    const getQuestionKey = (item) => item?.id ?? item?.Id;

    /** Mobile: selalu col-span-12. Non-mobile (md+): hanya mengikuti item.width (mis. col-span-6). */
    const getItemWidthClass = (item) => {
      const w = item?.width;
      if (!w || w === "col-span-12") return "col-span-12";
      // Mobile: full width. Desktop (md+): hanya item.width (md:col-span-X).
      return `col-span-12 md:${w}`;
    };

    // Normalize options untuk ComboBox/Radio (value & title)
    function normalizeOptions(opts) {
      if (!opts || !Array.isArray(opts)) return [];
      return opts.map((o) => ({
        value: o.value ?? o.id ?? o.code,
        title: o.title ?? o.label ?? o.name ?? String(o.value ?? o.id ?? ""),
      }));
    }

    const onLocationChange = (location) => {
      if (location) {
        coordinates.value.latitude = location.latitude;
        coordinates.value.longitude = location.longitude;
        // Sinkronkan ke questions agar jawaban tipe location terisi
        const locationQuestion = records.value.find(
          (r) => r.question_type === "location"
        );
        if (locationQuestion) {
          const key = getQuestionKey(locationQuestion);
          questions.value[key] = {
            latitude: location.latitude,
            longitude: location.longitude,
          };
        }
      }
    };

    // Inisialisasi nilai lokasi (Kecamatan & Desa) saat records dimuat
    watch(
      records,
      (recs) => {
        if (!recs || !Array.isArray(recs)) return;
        recs.forEach((r) => {
          const key = getQuestionKey(r);
          if (
            (r.question_type === "lokasi" ||
              r.question_type === "location-address") &&
            (questions.value[key] === undefined ||
              typeof questions.value[key] !== "object")
          ) {
            questions.value[key] = { district_code: "", village_code: "" };
          }
          // Inisialisasi pertanyaan tipe location (GPS) ke questions
          if (
            r.question_type === "location" &&
            (questions.value[key] === undefined ||
              typeof questions.value[key] !== "object")
          ) {
            questions.value[key] = {
              latitude: coordinates.value.latitude ?? null,
              longitude: coordinates.value.longitude ?? null,
            };
          }
        });
      },
      { immediate: true, deep: true }
    );

    const fetchSurveyTopic = async () => {
      try {
        const response = await store.showRecord(
          `api/v1/survey/topic/${surveyTopicId}`,
          {},
          true
        );
        if (response && response.data) {
          surveyInfo.value = {
            name: response.data.name ?? response.data.title ?? "",
            description: response.data.description ?? "",
          };
        }
      } catch (e) {
        console.error("Error fetch survey topic:", e);
      }
    };

    const fetchQuestions = async () => {
      try {
        const result = await store.showRecord(
          `api/v1/survey/get-survey/${surveyTopicId}`,
          {},
          true
        );
        // get-survey bisa return array langsung atau { data: [...] }
        const list = Array.isArray(result)
          ? result
          : result?.data ?? result?.questions ?? [];
        records.value = list;
      } catch (e) {
        console.error("Error fetch questions:", e);
        records.value = [];
      }
    };

    const validate = () => {
      const err = {};
      records.value.forEach((r) => {
        if (!r.required) return;
        const key = getQuestionKey(r);
        const val = questions.value[key];
        if (val === undefined || val === null || val === "") {
          err[key] = "Wajib diisi";
          return;
        }
        if (
          (r.question_type === "lokasi" ||
            r.question_type === "location-address") &&
          typeof val === "object"
        ) {
          if (!val.district_code) err[key] = "Kecamatan wajib dipilih";
          else if (!val.village_code) err[key] = "Desa/Kelurahan wajib dipilih";
        }
      });
      return err;
    };

    /** Build payload dinamis: array jawaban per pertanyaan untuk survey_topic_question_answers */
    const buildAnswers = () => {
      const list = records.value;
      const out = [];
      for (const item of list) {
        const questionId = getQuestionKey(item);
        if (questionId == null || questionId === undefined) continue;
        const val = questions.value[questionId];
        if (val === undefined || val === null) continue;
        const isObject =
          typeof val === "object" && val !== null && !Array.isArray(val);
        const answerText = isObject ? "" : String(val ?? "");
        const answerJson = isObject ? val : null;
        out.push({
          survey_topic_question_id: questionId,
          question_type: item.question_type,
          question_text: item.question_text ?? "",
          question_required: !!item.required,
          question_options: item.options ?? [],
          answer_text: answerText,
          answer_json: answerJson,
        });
      }
      // Tipe location: koordinat sebagai jawaban pertanyaan location
      const locationQuestion = list.find((q) => q.question_type === "location");
      if (
        locationQuestion &&
        (coordinates.value.latitude != null ||
          coordinates.value.longitude != null)
      ) {
        const locId = getQuestionKey(locationQuestion);
        const existing = out.find((a) => a.survey_topic_question_id === locId);
        const locPayload = {
          latitude: coordinates.value.latitude,
          longitude: coordinates.value.longitude,
        };
        if (existing) {
          existing.answer_text = "";
          existing.answer_json = locPayload;
          existing.question_type = locationQuestion.question_type;
          existing.question_text = locationQuestion.question_text ?? "";
          existing.question_required = !!locationQuestion.required;
          existing.question_options = locationQuestion.options ?? [];
        } else {
          out.push({
            survey_topic_question_id: locId,
            question_type: locationQuestion.question_type,
            question_text: locationQuestion.question_text ?? "",
            question_required: !!locationQuestion.required,
            question_options: locationQuestion.options ?? [],
            answer_text: "",
            answer_json: locPayload,
          });
        }
      }
      return out;
    };

    const submitSurvey = async () => {
      console.log("submitSurvey", records.value);
      console.log("surveyTopicId", surveyTopicId);
      console.log("surveySessionId", surveySessionId.value);
      console.log("questions", questions.value);

      if (!questions.value || questions.value.length === 0) {
        store.setSnackbar(
          "Tidak ada pertanyaan.",
          store.colors?.ERROR ?? "error",
          store.types?.ERROR ?? "error"
        );
        return;
      }
      if (!surveyTopicId) {
        store.setSnackbar(
          "ID topik survei tidak valid.",
          store.colors?.ERROR ?? "error",
          store.types?.ERROR ?? "error"
        );
        return;
      }

      const errors = validate();
      if (Object.keys(errors).length > 0) {
        validationErrors.value = errors;
        store.setSnackbar(
          "Lengkapi semua field wajib (*)",
          store.colors?.ERROR ?? "error",
          store.types?.ERROR ?? "error"
        );
        return;
      }
      validationErrors.value = {};

      const answers = buildAnswers();
      if (answers.length === 0) {
        store.setSnackbar(
          "Isi minimal satu jawaban.",
          store.colors?.ERROR ?? "error",
          store.types?.ERROR ?? "error"
        );
        return;
      }

      console.log("answers", answers);

      isSubmitting.value = true;
      try {
        const payload = {
          survey_topic_id: surveyTopicId,
          survey_session_id: surveySessionId.value,
          answers,
        };
        const response = await store.postRecord(
          "/api/v1/survey/submit-question-answers",
          payload,
          "store",
          true
        );

        if (response?.data?.status) {
          validationErrors.value = {};
          store.setSnackbar(
            response.data?.message ?? "Survey berhasil dikirim",
            store.colors?.SUCCESS ?? "success",
            store.types?.SUCCESS ?? "success"
          );
          router.push({
            name: "sending-success",
            query: {
              survey_id: surveyTopicId,
              survey_session_id: surveySessionId.value,
            },
          });
        } else {
          const msg =
            response?.data?.message ??
            response?.data?.errors ??
            "Gagal mengirim survey";
          store.setSnackbar(
            typeof msg === "string" ? msg : JSON.stringify(msg),
            store.colors?.ERROR ?? "error",
            store.types?.ERROR ?? "error"
          );
        }
      } catch (error) {
        console.error("Error submit survey:", error);
        store.setSnackbar(
          "Terjadi kesalahan. Silakan coba lagi.",
          store.colors?.ERROR ?? "error",
          store.types?.ERROR ?? "error"
        );
      } finally {
        isSubmitting.value = false;
      }
    };

    onMounted(() => {
      surveySessionId.value = generateSurveySessionId();
      fetchSurveyTopic();
      fetchQuestions();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            initialLocation.value.lat = pos.coords.latitude;
            initialLocation.value.lng = pos.coords.longitude;
          },
          () => {}
        );
      }
    });

    return {
      surveyInfo,
      records,
      questions,
      isSubmitting,
      validationErrors,
      surveySessionId,
      copySurveyId,
      coordinates,
      initialLocation,
      onLocationChange,
      normalizeOptions,
      getQuestionKey,
      getItemWidthClass,
      submitSurvey,
      isMobile,
    };
  },
};
</script>
