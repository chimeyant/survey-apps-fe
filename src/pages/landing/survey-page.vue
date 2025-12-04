<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          {{ surveyTopic.name }}
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          {{ surveyTopic.description }}
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-xl p-8">
        <form class="space-y-8">
          <div class="grid grid-cols-12 md:grid-cols-12 gap-4">
            <template
              v-for="item in surveyTopicQuestions"
              :key="item.id"
            >

              <div :class="item.width || 'col-span-12'">

                <!-- Text Field -->
                <UTextField
                  v-if="item.question_type === 'text'"
                  v-model="questions[item.id]"
                  :label="item.question_text"
                  :required="item.required"
                />

                <!-- Text Area -->
                <UTextArea
                  v-else-if="item.question_type === 'textarea'"
                  v-model="questions[item.id]"
                  :label="item.question_text"
                  :required="item.required"
                />

                <!-- Combo Box -->
                <UComboBox
                  v-else-if="item.question_type === 'select'"
                  v-model="questions[item.id]"
                  :label="item.question_text"
                  :items="item.options"
                  placeholder="Pilih Opsi"
                  :required="item.required"
                />

                <URadioGroup
                  v-else-if="item.question_type === 'radio'"
                  v-model="questions[item.id]"
                  :label="item.question_text"
                  :options="item.options || []"
                  :required="item.required"
                />
                <UCheckbox
                  v-else-if="item.question_type === 'checkbox'"
                  v-model="questions[item.id]"
                  :label="item.question_text"
                  :required="item.required"
                />
                <UTextField
                  v-else-if="item.question_type === 'number'"
                  v-model="questions[item.id]"
                  :label="item.question_text"
                  type="number"
                  :required="item.required"
                />
                <UTextField
                  v-else-if="item.question_type === 'date'"
                  v-model="questions[item.id]"
                  :label="item.question_text"
                  type="date"
                  :required="item.required"
                />
                <UTextField
                  v-else-if="item.question_type === 'time'"
                  v-model="questions[item.id]"
                  :label="item.question_text"
                  type="time"
                  :required="item.required"
                />
                <UFileUpload
                  v-else-if="item.question_type === 'file'"
                  v-model="questions[item.id]"
                  :label="item.question_text"
                  :required="item.required"
                  folder="documents"
                />
                <USwitch
                  v-else-if="item.question_type === 'switch'"
                  v-model="questions[item.id]"
                  :label="item.question_text"
                  :required="item.required"
                />

                <div v-else-if="item.question_type === 'location'">
                  <label class="block text-sm font-medium text-gray-700 mb-3">
                    {{ item.question_text }} <span
                      v-if="item.required"
                      class="text-red-500"
                    >*</span>
                  </label>
                  <div class="border border-gray-300 rounded-lg p-4 bg-gray-50">
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

              </div>
            </template>
          </div>
          <!-- Submit Button -->
          <div class="flex justify-end pt-6">
            <UButton
              type="submit"
              :loading="isSubmitting"
              class="px-12 py-3 text-lg blok"
            >
              Kirim Survei
            </UButton>
          </div>
        </form>
      </div>
      <!-- Tips Section -->
      <div class="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-blue-900 mb-3">
          💡 Tips Mengisi Survei
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
          <div>
            <p class="font-medium mb-2">📍 Lokasi GPS:</p>
            <ul class="space-y-1">
              <li>• Gunakan tombol "Lokasi Saat Ini" untuk akurasi terbaik</li>
              <li>• Klik langsung di peta untuk memilih lokasi</li>
              <li>• Drag marker untuk memindahkan posisi</li>
            </ul>
          </div>
          <div>
            <p class="font-medium mb-2">🏠 Informasi Alamat:</p>
            <ul class="space-y-1">
              <li>• Isi alamat lengkap dengan detail</li>
              <li>• Pilih wilayah administratif yang tepat</li>
              <li>• Pastikan nomor telepon aktif</li>
            </ul>
          </div>
          <div>
            <p class="font-medium mb-2">📸 Foto Dokumentasi:</p>
            <ul class="space-y-1">
              <li>• Ambil foto langsung dari kamera untuk kualitas terbaik</li>
              <li>• Pilih dari galeri jika sudah ada foto</li>
              <li>• Drag & drop foto untuk upload yang mudah</li>
              <li>• Maksimal 5 foto, 5MB per foto</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from "@/store/app";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import {
  UButton,
  UComboBox,
  UFormDialog,
  UTextField,
  UTextArea,
  USwitch,
  UFileUpload,
  UMapCoordinatePicker,
  UFormDelete,
  UCheckboxGroup,
  UCheckbox,
} from "@/components";

const store = useAppStore();
const route = useRoute();
const surveyTopic = ref({});
const surveyTopicQuestions = ref([]);
const questions = ref([]);
const surveyTopicId = route.params.survey_topic_id;

const fetchSurveyTopic = async () => {
  const response = await store.showRecord(
    `api/v1/survey/topic/${surveyTopicId}`,
    {},
    true
  );
  surveyTopic.value = response.data;
};

const fetchSurveyTopicQuestions = async () => {
  const response = await store.showRecord(
    `api/v1/survey/get-survey/${route.params.survey_topic_id}`,
    {},
    true
  );
  surveyTopicQuestions.value = response;
};

onMounted(() => {
  fetchSurveyTopic();
  fetchSurveyTopicQuestions();
});
</script>