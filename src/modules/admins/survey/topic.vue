<template>
  <div class="flex flex-col mt-4 w-full min-h-full animate-fadeIn ">
    <UFormDataTable
      title="Daftar Topik"
      @onRefresh="fetchRecords({})"
      @onAdd="addNew"
      v-model:keyword="keyWord"
    >
      <template v-slot:data-table>
        <!-- U Data Table -->
        <UDataTable
          :headers="headers"
          @update:options="fetchRecords"
        >
          <template v-slot:body>
            <tr
              class="hover:bg-gray-100 text-sm"
              v-for="item in records"
            >
              <td class="px-4 py-2 border border-gray-300">
                <input
                  type="checkbox"
                  class="bg-yellow-500 text-red-700"
                >
              </td>
              <td class="px-4 py-2 border border-gray-300 ">{{ item.name }}</td>
              <td class="px-4 py-2 border border-gray-300 text-center">
                <span>
                  {{ item.start_date }} s/d {{ item.end_date }}
                </span>
              </td>
              <td class="px-4 py-2 border border-gray-300 text-center">
                <span
                  v-show="item.is_token"
                  class="font-bold text-green-500"
                >{{ item.token }}</span>
                <span
                  v-show="!item.is_token"
                  class="font-bold text-red-500"
                >Tidak Aktif</span>
              </td>
              <td class="px-4 py-2 border border-gray-300 text-center">
                <UChip
                  label="Download QR Code"
                  color="info"
                />
              </td>
              <td class="px-4 py-2 border border-gray-300 text-center">
                <UChip
                  :label="item.status ? 'Aktif' : 'Tidak Aktif'"
                  :color="item.status ? 'success' : 'error'"
                />
              </td>
              <td class="px-4 py-2 border border-gray-300 text-center">
                <UDropdownOpsi>
                  <template v-slot:menu>
                    <div
                      v-if="false"
                      class="flex w-[200px] justify-start items-center hover:cursor-pointer hover:bg-gray-100 px-1 rounded-lg"
                    >
                      <button
                        class="flex justify-center items-center"
                        @click="showCategoryPage(item.uuid)"
                      >
                        <i class="ri-puzzle-line text-lg text-green-500 mr-1"></i><span class="text-gray-700">Atur Kategori</span>
                      </button>
                    </div>
                    <div
                      v-if="false"
                      class="flex w-[200px] justify-start items-center hover:cursor-pointer hover:bg-gray-100 px-1 rounded-lg"
                    >
                      <button
                        class="flex justify-center items-center"
                        @click="showDocumentPage(item.uuid)"
                      >
                        <i class="ri-attachment-fill text-lg text-blue-500 mr-1"></i><span class="text-gray-700">Dokumen Persyaratan</span>
                      </button>
                    </div>
                    <div
                      v-if="page.actions.edit"
                      class="flex w-[200px] justify-start items-center hover:cursor-pointer hover:bg-gray-100 px-1 rounded-lg"
                    >
                      <button
                        class="flex justify-center items-center"
                        @click="showTopicQuestionPage(item.uuid)"
                      >
                        <i class="ri-article-line text-lg text-purple-500 mr-1"></i><span class="text-gray-700">Template Formulir Survey</span>
                      </button>
                    </div>
                    <div
                      v-if="page.actions.edit"
                      class="flex w-[140px] justify-start items-center hover:cursor-pointer hover:bg-gray-100 px-1 rounded-lg"
                    >
                      <button
                        class="flex justify-center items-center"
                        @click="showRecord(item.uuid)"
                      >
                        <i class="ri-edit-circle-fill text-lg text-orange-500 mr-1"></i><span class="text-gray-700">Ubah Data</span>
                      </button>
                    </div>
                    <div
                      v-if="page.actions.delete"
                      class="flex w-[140px] justify-start items-center hover:cursor-pointer hover:bg-gray-100 px-1 rounded-lg"
                    >
                      <button
                        class="flex justify-center items-center"
                        @click="postConfirmDelete(item.uuid)"
                      >
                        <i class="ri-delete-bin-2-fill text-lg text-red-500 mr-1"></i><span class="text-gray-700">Hapus Data</span>
                      </button>
                    </div>
                  </template>
                </UDropdownOpsi>
              </td>
            </tr>
          </template>
        </UDataTable>
      </template>
    </UFormDataTable>

    <!-- Form Slider -->
    <div
      v-if="false"
      class="flex flex-col h-full w-full animate-fadeIn"
    >
      <div class="lg:w-full h-[48px] bg-teal-700 rounded-t-md ">
        <div class="flex justify-between items-center h-full w-full px-5">
          <div class="text-white">
            Formulir Manajemen Pengguna
          </div>
          <div class="flex gap-x-3">
            <div class="text-white text-2xl">
              <i class="ri-close-circle-fill"></i>
              <i class="ri-question-fill"></i>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Form Dialog -->

    <UFormDialog
      title="Formulir Manajemen Topik"
      @onSave="postRecord"
      @onUpdate="postUpdate"
    >
      <template v-slot:formdata>
        <!-- Name Field -->
        <div>
          <div class="mb-4">
            <UTextField
              label="Topik"
              v-model="record.name"
              required
            />
          </div>
          <div class="mb-4">
            <UTextArea
              label="Penjelasan Singkat"
              v-model="record.description"
              required
            />
          </div>
          <div class="grid grid-cols-2 gap-x-1">
            <div class="mb-4">
              <UTextField
                label="Dari Tanggal"
                v-model="record.start_date"
                required
                type="date"
              />
            </div>
            <div class="mb-4">
              <UTextField
                label="Sampai Tanggal"
                v-model="record.end_date"
                required
                type="date"
              />
            </div>
            <div class="mb-4">
              <UTextField
                label="Jam Mulai"
                v-model="record.start_time"
                type="time"
              />
            </div>
            <div class="mb-4">
              <UTextField
                label="Jam Selesai"
                v-model="record.end_time"
                type="time"
              />
            </div>
          </div>
          <div class="mb-4">
            <USwitch
              label="Aktifkan Token"
              v-model="record.is_token"
            />
          </div>

          <div class="mb-4">
            <USwitch
              label="Aktif"
              v-model="record.status"
            />
          </div>
        </div>
      </template>
    </UFormDialog>

    <!-- Form Delete -->
    <UFormDelete @delete="postDelete" />
  </div>
</template>
  
  <script>
import { useAppStore } from "@/store/app";
import { useRouter } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";
import {
  UComboBox,
  USwitch,
  UDataTable,
  UDropdownOpsi,
  UFormDelete,
  UFormDialog,
  UFormDataTable,
  UFileUpload,
  UTextField,
  UTextArea,
  UChip,
} from "@/components";
import { debounce } from "lodash";

export default {
  components: {
    UComboBox,
    USwitch,
    UDataTable,
    UDropdownOpsi,
    UFormDelete,
    UFormDialog,
    UFormDataTable,
    UFileUpload,
    UTextField,
    UTextArea,
    UChip,
  },
  setup() {
    const store = useAppStore();
    const router = useRouter();
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
    const endpoint = "api/v1/survey/survey-topics";

    const winheight = window.innerHeight - 320;
    const headers = [
      { title: "#", key: "ids", align: "center", width: "45px" },
      { title: "Topik", key: "name", align: "start", width: "300px" },
      { title: "Waktu", key: "name", align: "center", width: "150px" },
      { title: "Token", key: "name", align: "center", width: "150px" },
      { title: "Link Formulir", key: "name", align: "center", width: "200px" },
      { title: "Status", key: "status", align: "center", width: "150px" },
      {
        title: "Aksi",
        key: "id",
        align: "center",
        width: "50px",
        sortable: false,
      },
    ];

    /**
     * Variable Page
     */
    const isChecked = ref(false);
    const isOpen = ref(false);
    const selectedOption = ref(null);
    const keyWord = ref(null);

    /**
     * Function Page
     */
    const addNew = () => {
      store.setRecord({});
      store.setForm({
        add: true,
        edit: false,
      });
    };

    /**
     * Fetc Records Data From Service
     * @param payload
     */
    const fetchRecords = async (payload) => {
      const params = {
        page: payload ? payload.page : 1,
        itemsPerPage: payload.itemsPerPage ? payload.itemsPerPage : 10,
        keyWord: payload ? payload.keyWord : null,
      };

      const result = await store.fetchRecords(endpoint, params, true);

      store.setRecords(result?.data.data ? result.data.data : []);
      table.value.totalItems = result?.data.meta.total;
    };

    /**
     * Post data record to store data
     */
    const postRecord = async () => {
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
        records.value.push(result.data.data);
      }
    };

    /**
     * Show data record for preparing edit data
     * @param payload
     */
    const showRecord = async (payload) => {
      const result = await store.showRecord(endpoint + "/" + payload, true);
      store.setRecord(result.data);
      store.setForm({
        add: true,
        edit: true,
      });
    };

    /**
     * Post Update Data To Server
     */
    const postUpdate = async () => {
      const result = await store.postRecord(
        endpoint + "/" + record.value.uuid,
        record.value,
        "update",
        true
      );

      if (result?.data.status) {
        store.setSnackbar(result.data.message, colors.value.SUCCESS);
        store.setForm({
          add: false,
          edit: false,
        });
        store.changeRecord(result.data.data);
      }
    };

    /**
     * Confirmation Delete Process
     * @param payload
     */
    const postConfirmDelete = (payload) => {
      store.setRecord({
        uuid: payload,
      });
      store.setForm({
        add: false,
        edit: false,
        delete: true,
      });
    };

    /**
     * Post Delete Record
     * @param payload
     */
    const postDelete = async () => {
      const result = await store.postRecord(
        endpoint + "/" + record.value.uuid,
        {},
        "delete",
        true
      );

      if (result?.data.status) {
        store.setSnackbar(result.data.message);
        store.setForm({
          add: false,
          edit: false,
          delete: false,
        });
        store.removeRecord(result.data.data.uuid);
        store.setRecord({});
      }
    };

    const postConfirmBulkDelete = () => {};

    const openHelper = () => {
      store.setForm({
        help: true,
      });
    };

    const load = async ({ done }) => {
      const params = {
        page: list.value.page,
        itemsPerPage: list.value.itemsPerPage,
      };

      fetchMobileView(params);

      setTimeout(() => {
        if (list.value.page < list.value.lastPage) {
          fetchMobileView(params);
        } else {
          done("empty");
        }
      }, 1000);
    };

    const fetchMobileView = async function (params) {
      const endpoint = "api/v1/master-data/districts";
      const result = await store.fetchRecords(endpoint, params);
      result.data.data.forEach((element) => {
        records.value.push(element);
      });

      store.setList({
        page: result.data.meta.current_page + 1,
        lastPage: result.data.meta.last_page,
      });
    };

    const toggleDropDown = () => {
      isOpen.value = !isOpen.value;
    };

    const selectOption = (option) => {
      selectedOption.value = option;
      isOpen.value = false;
    };

    watch(keyWord, () => {
      onSearch();
    });

    const onSearch = debounce(() => {
      table.value.footer.keyWord = keyWord.value;
    }, 1000);

    //custom page function
    const showDocumentPage = (payload) => {
      router.push({
        name: "survey-topic-document-management",
        params: { survey_topic_id: payload },
      });
    };

    const showCategoryPage = (payload) => {
      router.push({
        name: "survey-topic-category-management",
        params: { survey_topic_id: payload },
      });
    };

    const showTopicQuestionPage = (payload) => {
      router.push({
        name: "survey-topic-question-management",
        params: { survey_topic_id: payload },
      });
    };

    onMounted(() => {
      store.setPage({
        title: "Manjemen Desa | Kelurahan",
        subtitle: "Berikut Daftar Seluruh Desa | Kelurahan Pada Aplikasi ",
        breadcrumbs: [
          {
            name: "",
            title: "Survey",
          },
          {
            name: "master-data-village-management",
            title: "Manajemen Topik",
          },
        ],
        actions: {
          refresh: true,
          add: true,
          edit: true,
          delete: true,
          bulkdelete: false,
          export: false,
          print: false,
          help: false,
          close: false,
        },
        showtable: true,
      });
      fetchRecords({});
    });

    return {
      device,
      theme,
      page,
      form,
      rules,
      colors,
      headers,
      records,
      record,
      fetchRecords,
      table,
      keyWord,
      list,
      winheight,
      addNew,
      postRecord,
      postUpdate,
      showRecord,
      postConfirmDelete,
      postDelete,
      postConfirmBulkDelete,
      openHelper,
      load,
      isChecked,
      isOpen,
      selectOption,
      toggleDropDown,
      selectedOption,
      showDocumentPage,
      showCategoryPage,
      showTopicQuestionPage,
    };
  },
};
</script>
  
  