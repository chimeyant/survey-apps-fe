<template>
    <div>
        <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 relative">
            <div class="text-center mb-12">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">
                    Survey Pendataan Penduduk Termiskin Tahun 2025
                </h1>
                <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                    Bantu kami mengumpulkan data di wilayah Anda untuk meningkatkan pelayanan di Kabupaten Tangerang - Template Formulir Survey
                </p>
            </div>
            <!-- Survey Form -->
            <div class="bg-white rounded-lg shadow-xl p-8 min-h-[70vh]">
                <div class="grid grid-cols-12 md:grid-cols-12 gap-4">
                    <div class="col-span-6 md:col-span-6">
                        <UComboBox
                            :items="surveyTopics"
                            placeholder="Pilih topik survey"
                        />
                    </div>
                    <div class="col-span-6 md:col-span-6">
                        <UComboBox
                            v-model="record.question_text"
                            :items="surveyTopicCategories"
                            placeholder="Pilih kategori lokasi"
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
            <div class="mb-4">
                <UComboBox
                    v-model="record.width"
                    :items="widths"
                    label="Lebar Komponen"
                    placeholder="Pilih lebar kompenen"
                />
            </div>
            <div class="mb-4">
                <UComboBox
                    v-model="record.sort_order"
                    :items="sort_orders"
                    label="Urutan Pertanyaan"
                    placeholder="Pilih urutan pertanyaan"
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
</template>

<script>
import { useAppStore } from "@/store/app";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { UButton,UComboBox, UFormDialog,UTextField,UTextArea,USwitch } from "@/components";
export default {

    components: {
        UComboBox,
        UButton,
        UFormDialog,
        UTextField,
        UTextArea,
        USwitch,
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

        const endpoint = "api/v1/survey/survey-topic-questions/" + route.params.surveyTopicUuid;

        const question_types = ref([
            {
                value: "text",
                label: "Text",
            },
            {
                value:"textarea",
                label: "Textarea",
            },
            {
                value: "radio",
                label: "Radio",
            },
            {
                value: "checkbox",
                label: "Checkbox",
            },
            {
                value: "dropdown",
                label: "Dropdown",
            },
            {
                value: "number",
                label: "Number",
            },
            {
                value: "date",
                label: "Date",
            },
            {
                value: "time",
                label: "Time",
            },
            {
                value:"fileupload",
                label: "File Upload",
            },
            {
                value: "photoupload",
                label: "Photo Upload",
            },
            {
                value: "mapcoordinate",
                label: "Map Coordinate | Location",
            },           
        ]);

        const widths= ref([
            {
                value: "cols-1",
                label: "1 Column",
            },
            {
                value: "cols-2",
                label: "2 Column",
            },
            {
                value: "cols-3",
                label: "3 Column",
            },
            {
                value: "cols-4",
                label: "4 Column",
            },
            {
                value: "cols-5",
                label: "5 Column",
            },
            {
                value: "cols-6",
                label: "6 Column",
            },
            {
                value: "cols-7",
                label: "7 Column",
            },
            {
                value: "cols-8",
                label: "8 Column",
            },
            {
                value: "cols-9",
                label: "9 Column",
            },
            {
                value: "cols-10",
                label: "10 Column",
            },
            {
                value: "cols-11",
                label: "11 Column",
            },
            {
                value: "cols-12",
                label: "12 Column",
            }
        ])

        const options =ref([])

        const sort_orders = ref([
            {
                value: "asc",
                label: "Ascending (A-Z | 1-9)",
            },
            {
                value: "desc",
                label: "Descending (Z-A | 9-1)",
            },
        ])

        const addNew = () => {
            store.setRecord({});
            store.setForm({
            add: true,
            edit: false,
        });
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

        const postRecord = async () => {
            console.log(record.value);
            const result = await store.postRecord(endpoint, record.value, "store", true);
            
            store.setRecord(result.data);
            store.setForm({
                add: false,
                edit: false,
            });
            records.value.push(result.data.data);
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

        };
    },
};
</script>