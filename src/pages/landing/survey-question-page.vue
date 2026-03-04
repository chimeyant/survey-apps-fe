<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased py-12 px-4 sm:px-6 lg:px-8">
    <!-- Decorative background -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
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
          <div class="grid grid-cols-12 md:grid-cols-12 gap-4">
            <template
              v-for="item in records"
              :key="getQuestionKey(item)"
            >
              <div :class="item.width || 'col-span-12'">
                <UTextField
                  v-if="item.question_type === 'text'"
                  v-model="questions[getQuestionKey(item)]"
                  :label="item.question_text"
                  :required="item.required"
                />
                <UTextArea
                  v-else-if="item.question_type === 'textarea'"
                  v-model="questions[getQuestionKey(item)]"
                  :label="item.question_text"
                  :required="item.required"
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
                />
                <UTextField
                  v-else-if="item.question_type === 'date'"
                  v-model="questions[getQuestionKey(item)]"
                  :label="item.question_text"
                  type="date"
                  :required="item.required"
                />
                <UTextField
                  v-else-if="item.question_type === 'time'"
                  v-model="questions[getQuestionKey(item)]"
                  :label="item.question_text"
                  type="time"
                  :required="item.required"
                />
                <UFileUpload
                  v-else-if="item.question_type === 'file'"
                  v-model="questions[getQuestionKey(item)]"
                  :label="item.question_text"
                  :required="item.required"
                  folder="documents"
                />
                <USwitch
                  v-else-if="item.question_type === 'switch'"
                  v-model="questions[getQuestionKey(item)]"
                  :label="item.question_text"
                  :required="item.required"
                />
                <div v-else-if="item.question_type === 'location'">
                  <label class="block text-sm font-medium text-gray-700 mb-3">
                    {{ item.question_text }}
                    <span
                      v-if="item.required"
                      class="text-red-500"
                    >*</span>
                  </label>
                  <div class="border border-gray-300 rounded-xl p-4 bg-gray-50">
                    <UMapCoordinatePicker
                      v-model="coordinates"
                      @update:modelValue="onLocationChange"
                      :initial-location="initialLocation"
                    />
                  </div>
                  <p class="text-sm text-gray-500 mt-2">
                    💡 Klik di peta atau gunakan tombol "Lokasi Saat Ini" untuk mendapatkan koordinat GPS
                  </p>
                </div>
                <div v-else-if="item.question_type === 'lokasi' || item.question_type === 'location-address'">
                  <ULokasi
                    v-model="questions[getQuestionKey(item)]"
                    :label-kecamatan="item.question_text"
                    :required="item.required"
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

    const surveyInfo = ref({ name: "", description: "" });
    const records = ref([]);
    const questions = ref({});
    const isSubmitting = ref(false);

    const coordinates = ref({
      latitude: null,
      longitude: null,
    });
    const initialLocation = ref({
      lat: -6.1783,
      lng: 106.6319,
    });

    const surveyTopicId = route.params.survey_topic_id;

    /** Kunci pertanyaan (API bisa pakai id atau Id) */
    const getQuestionKey = (item) => item?.id ?? item?.Id;

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
          else if (!val.village_code)
            err[key] = "Desa/Kelurahan wajib dipilih";
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
        } else {
          out.push({
            survey_topic_question_id: locId,
            answer_text: "",
            answer_json: locPayload,
          });
        }
      }
      return out;
    };

    const submitSurvey = async () => {
      if (!records.value || records.value.length === 0) {
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
        store.setSnackbar(
          "Lengkapi semua field wajib (*)",
          store.colors?.ERROR ?? "error",
          store.types?.ERROR ?? "error"
        );
        return;
      }
      const answers = buildAnswers();
      if (answers.length === 0) {
        store.setSnackbar(
          "Isi minimal satu jawaban.",
          store.colors?.ERROR ?? "error",
          store.types?.ERROR ?? "error"
        );
        return;
      }

      isSubmitting.value = true;
      try {
        const payload = {
          survey_topic_id: surveyTopicId,
          answers,
        };
        const response = await store.postRecord(
          "/api/v1/survey/submit-question-answers",
          payload,
          "store",
          true
        );

        if (response?.data?.status) {
          store.setSnackbar(
            response.data?.message ?? "Survey berhasil dikirim",
            store.colors?.SUCCESS ?? "success",
            store.types?.SUCCESS ?? "success"
          );
          router.push({
            name: "sending-success",
            query: { survey_id: surveyTopicId },
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
      coordinates,
      initialLocation,
      onLocationChange,
      normalizeOptions,
      getQuestionKey,
      submitSurvey,
    };
  },
};
</script>
