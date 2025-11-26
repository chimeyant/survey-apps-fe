<template>
  <div>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          {{survey_info.name}}
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          {{ survey_info.description }}
        </p>
      </div>
      <!-- Survey Form -->
      <div class="bg-white rounded-lg shadow-xl p-8 min-h-[70vh]">
        <div class="grid grid-cols-12 md:grid-cols-12 gap-4">
          <template
            v-for="item in records"
            :key="item.id"
          >

            <div :class="item.width || 'col-span-12'">
              <UTextField
                v-if="item.question_type === 'text'"
                v-model="questions[item.id]"
                :label="item.question_text"
                :required="item.required"
              />
              <UTextArea
                v-else-if="item.question_type === 'textarea'"
                v-model="questions[item.id]"
                :label="item.question_text"
                :required="item.required"
              />
              <UComboBox
                v-else-if="item.question_type === 'select'"
                v-model="questions[item.id]"
                :label="item.question_text"
                :items="item.options || []"
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

              <!-- Add more component types as needed -->
              <div v-else>
                <span class="text-red-500">Unknown question type: {{ item.question_type }}</span>
              </div>
              <div class="my-2">
                <button
                  class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-sm text-sm border-l-red-800 border-l-4"
                  @click="postConfirmDelete(item.id)"
                >
                  <i class="ri-delete-bin-fill text-xs"></i>
                </button>
                <button
                  class="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded-pil text-sm border-l-orange-800 border-l-4 ml-2"
                  @click="editQuestion(item)"
                >
                  <i class="ri-edit-2-fill text-xs"></i>
                </button>
              </div>
            </div>

          </template>
          <div class="col-span-12">
            <UButton
              label="Kirim Survey"
              @click="sendSurvey"
            />
          </div>
        </div>
      </div>

      <!-- Form Dialog -->

      <UFormDialog
        title="Formulir Manajemen Pertanyaan"
        @onSave="postRecord"
        @onUpdate="postUpdate"
        width="w-[700px]"
      >
        <template v-slot:formdata>
          <!-- Name Field -->
          <div>
            <div class="mb-4">
              <UTextField
                v-model="record.question_number"
                label="Nomor Pertanyaan"
                placeholder="Masukkan nomor pertanyaan"
                required
                type="number"
              />
            </div>
            <div class="mb-4">
              <UTextArea
                v-model="record.question_text"
                label="Nama Pertanyaan"
                placeholder="Masukkan nama pertanyaan"
                required
              />
            </div>
            <div class="mb-4">
              <UComboBox
                v-model="record.question_type"
                :items="question_types"
                label="Tipe Pertanyaan"
                placeholder="Pilih tipe pertanyaan"
                required
              />
            </div>
            <div
              class="mb-4"
              v-if="record.question_type == 'select'"
            >
              <div class="flex flex-row justify-end items-end align-middle py-1 gap-x-1">
                <button
                  class="text-white bg-green-500 hover:bg-green-600 px-2 py-1 rounded-sm text-sm border-l-green-800 border-l-4"
                  @click="addOption"
                >
                  <i class="ri-add-line text-xs"></i>
                </button>
              </div>
              <table class="w-full border-collapse border border-gray-300">
                <thead class="text-sm font-thin bg-gray-200 h-[30px]">
                  <th>
                    Value
                  </th>
                  <th>
                    Label
                  </th>
                  <th class="text-center w-[100px]">
                    Action
                  </th>
                </thead>
                <tbody>
                  <tr
                    v-for="(option, index) in formOptions.records"
                    :key="index"
                  >
                    <td class="p-2">
                      <input
                        type="text"
                        class="w-full border border-gray-300 rounded-sm p-2 text-sm"
                        v-model="option.value"
                      >
                    </td>
                    <td>
                      <input
                        type="text"
                        class="w-full border border-gray-300 rounded-sm p-2 text-sm"
                        v-model="option.label"
                      >
                    </td>
                    <td class="text-center">
                      <button
                        class="text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-sm text-sm border-l-red-800 border-l-4"
                        @click="deleteOption(option.value)"
                      ><i class="ri-delete-bin-line text-xs"></i></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="mb-4">
              <UComboBox
                v-model="record.width"
                :items="widths"
                label="Lebar Komponen"
                placeholder="Pilih lebar kompenen"
              />
            </div>
            <div class="mb-4">
              <USwitch
                v-model="record.required"
                label="Wajib Diisi"
                placeholder="Pilih wajib diisi"
              />
            </div>

          </div>
        </template>
      </UFormDialog>
      <!-- Floating Add Buttons -->
      <div class="fixed bottom-12 right-10 flex flex-col gap-4 z-50">
        <button
          class="bg-cyan-600 hover:bg-cyan-700 text-white rounded-full shadow-lg w-10 h-10 flex items-center justify-center text-3xl transition"
          title="Tambah Pertanyaan"
          @click="addNew"
        >
          <i class="ri-add-line"></i>
        </button>
        <button
          class="bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg w-10 h-10 flex items-center justify-center text-3xl transition"
          title="Tambah Opsi"
        >
          <i class="ri-arrow-up-line"></i>
        </button>
      </div>

    </div>
  </div>

  <!-- Form Delete -->
  <UFormDelete @delete="postDelete" />
</template>

<script>
import { useAppStore } from "@/store/app";
import { computed, onBeforeUnmount, onMounted, ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
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
export default {
  components: {
    UComboBox,
    UCheckboxGroup,
    UButton,
    UFormDialog,
    UTextField,
    UTextArea,
    USwitch,
    UFileUpload,
    UMapCoordinatePicker,
    UFormDelete,
    UCheckbox,
  },
  setup() {
    const store = useAppStore();
    const router = useRouter();
    const route = useRoute();
    const device = computed(() => store.device);
    const theme = computed(() => store.getTheme);
    const types = computed(() => store.types);
    const page = computed(() => store.page);
    const form = computed(() => store.form);
    const colors = computed(() => store.colors);
    const table = computed(() => store.table);
    const list = computed(() => store.lists);
    const rules = computed(() => store.rules);
    const record = computed(() => store.record);
    const records = computed(() => store.records);
    const question = ref({});
    const questions = ref([]);
    const survey_info = ref({});

    const endpoint =
      "api/v1/survey/survey-topic-questions/" + route.params.survey_topic_id;

    const question_types = ref([
      {
        value: "text",
        label: "Text",
      },
      {
        value: "textarea",
        label: "Textarea",
      },
      {
        value: "select",
        label: "Select Option",
      },
      // {
      //   value: "radio",
      //   label: "Radio Option",
      // },
      {
        value: "checkbox",
        label: "Checkbox",
      },
      {
        value: "switch",
        label: "Swicth",
      },
      {
        value: "file",
        label: "File Upload",
      },
      {
        value: "image",
        label: "Image Upload",
      },
      // {
      //   value: "video",
      //   label: "Video Upload",
      // },
      // {
      //   value: "audio",
      //   label: "Audio Upload",
      // },
      {
        value: "number",
        label: "Number",
      },
      {
        value: "location",
        label: "Location",
      },
    ]);

    const widths = ref([
      {
        value: "col-span-12",
        label: "12 Column",
      },
      {
        value: "col-span-11",
        label: "11 Column",
      },
      {
        value: "col-span-10",
        label: "10 Column",
      },
      {
        value: "col-span-9",
        label: "9 Column",
      },
      {
        value: "col-span-8",
        label: "8 Column",
      },
      {
        value: "col-span-7",
        label: "7 Column",
      },
      {
        value: "col-span-6",
        label: "6 Column",
      },
      {
        value: "col-span-5",
        label: "5 Column",
      },
      {
        value: "col-span-4",
        label: "4 Column",
      },
      {
        value: "col-span-3",
        label: "3 Column",
      },
      {
        value: "col-span-2",
        label: "2 Column",
      },
      {
        value: "col-span-1",
        label: "1 Column",
      },
    ]);

    const formOptions = ref({
      show: false,
      add: false,
      edit: false,
      records: [],
      record: {},
    });

    const options = ref([]);

    const sort_orders = ref([
      {
        value: "asc",
        label: "Ascending (A-Z | 1-9)",
      },
      {
        value: "desc",
        label: "Descending (Z-A | 9-1)",
      },
    ]);

    const coordinates = reactive({
      latitude: null,
      longitude: null,
    });

    // Initial location (Tangerang coordinates)
    const initialLocation = ref({
      lat: -6.1783,
      lng: 106.6319,
    });

    const onLocationChange = (location) => {
      coordinates.latitude = location.latitude;
      coordinates.longitude = location.longitude;
    };

    const addNew = () => {
      store.setRecord({});
      store.setForm({
        add: true,
        edit: false,
      });
      formOptions.value.records = [];
      formOptions.value.record = {};
    };

    const closeForm = () => {
      store.setForm({
        add: false,
        edit: false,
      });
    };

    onBeforeUnmount(() => {
      closeForm();
    });

    const fetchRecords = async () => {
      const result = await store.fetchRecords(endpoint, {}, true);
      store.setRecords(result?.data.data ? result.data.data : []);
      table.value.totalItems = result?.data.meta.total;
    };

    const postRecord = async () => {
      record.value.question_number = parseInt(record.value.question_number);
      record.value.options = formOptions.value.records;
      console.log(record.value.options);
      const result = await store.postRecord(
        endpoint,
        record.value,
        "store",
        true
      );

      if (result?.data.status) {
        store.setSnackbar(
          result.data.message,
          colors.value.SUCCESS,
          types.value.SUCCESS
        );

        store.setForm({
          add: false,
          edit: false,
        });

        fetchRecords();
      }
    };

    const postUpdate = async () => {
      if (!record.value.id && !record.value.uuid) {
        store.setSnackbar(
          "Data pertanyaan tidak valid",
          colors.value.ERROR,
          types.value.ERROR
        );
        return;
      }

      record.value.question_number = parseInt(record.value.question_number);
      record.value.options = formOptions.value.records;

      console.log(record.value);

      const result = await store.postRecord(
        endpoint + "/" + (record.value.uuid || record.value.id),
        record.value,
        "update",
        true
      );

      if (result?.data.status) {
        store.setSnackbar(
          result.data.message,
          colors.value.SUCCESS,
          types.value.SUCCESS
        );

        store.setForm({
          add: false,
          edit: false,
        });

        fetchRecords();
      }
    };

    const postConfirmDelete = async (id) => {
      store.setForm({
        add: false,
        edit: false,
        delete: true,
      });
      question.value.id = id;
    };

    const postDelete = async () => {
      const result = await store.postRecord(
        endpoint + "/" + question.value.id,
        {},
        "delete",
        true
      );
      if (result?.data.status) {
        store.setSnackbar(
          result.data.message,
          colors.value.SUCCESS,
          types.value.SUCCESS
        );
        store.setForm({
          add: false,
          edit: false,
          delete: false,
        });
        store.removeRecord(result.data.data.id);
        store.setRecord({});
        fetchRecords();
      }
    };

    const addOption = async () => {
      console.log(formOptions.value.records);
      formOptions.value.records.push({
        value: "",
        label: "",
      });
    };

    const deleteOption = async (value) => {
      console.log(formOptions.value.records);
      formOptions.value.records = formOptions.value.records.filter(
        (option) => option.value !== value
      );

      console.log(formOptions.value.records);
    };

    const editQuestion = (item) => {
      if (!item) {
        return;
      }

      const cloned = {
        ...item,
        question_number: item.question_number,
      };

      store.setRecord(cloned);
      formOptions.value.records = Array.isArray(item.options)
        ? item.options.map((option) => ({ ...option }))
        : [];

      store.setForm({
        add: true,
        edit: true,
      });
    };

    const sendSurvey = async () => {
      console.log(questions.value);
    };

    const getSurveyInfo = async () => {
      const result = await store.showRecord(
        "api/v1/survey/survey-topics/" + route.params.survey_topic_id,
        true
      );

      survey_info.value = result?.data;
      console.log(survey_info.value);
    };

    onMounted(() => {
      store.setPage({
        title: "Manajemen Pertanyaan Survey",
        subtitle: "Berikut Daftar Pertanyaan Survey Pada Aplikasi",
        breadcrumbs: [
          {
            name: "",
            title: "Survey",
          },
          {
            name: "survey-topic-management",
            title: "Manajemen Topik",
          },
          {
            name: "survey-topic-question-management",
            title: "Manajemen Pertanyaan",
          },
        ],
        showtable: false,
      });

      getSurveyInfo();

      fetchRecords();

      // Try to get current location for initial map position
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            initialLocation.lat = position.coords.latitude;
            initialLocation.lng = position.coords.longitude;
          },
          (error) => {
            console.log("Could not get current location, using default");
          }
        );
      }
    });

    return {
      store,
      router,
      route,
      device,
      theme,
      types,
      page,
      form,
      records,
      record,
      addNew,
      closeForm,
      question_types,
      widths,
      sort_orders,
      options,
      postRecord,
      postUpdate,
      sendSurvey,
      question,
      questions,
      coordinates,
      initialLocation,
      onLocationChange,
      postConfirmDelete,
      postDelete,
      formOptions,
      addOption,
      deleteOption,
      survey_info,
      editQuestion,
    };
  },
};
</script>