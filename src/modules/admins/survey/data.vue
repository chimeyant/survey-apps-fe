<template>
    <div class="flex flex-col mt-4 w-full min-h-full animate-fadeIn ">
        <UFormDataTable
          title="Daftar Data Survey"
          @onRefresh="fetchRecords({})"
          @onAdd="addNew"
          v-model:keyword="keyWord"
          v-show="!form.page"
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
                      name="item.uuid"
                    >
                  </td>
                  <td class="px-4 py-2 border border-gray-300 ">{{ item.survey_topic }}</td>
                  <td class="px-4 py-2 border border-gray-300 ">
                    <div>
                      {{ item.surveyor_name }}
                      <br>
                      <span class="text-xs text-gray-500">
                        {{ item.phone }}
                      </span>
                    </div>
                  </td>
                  <td class="px-4 py-2 border border-gray-300 ">
                    {{ item.address }}
                    <br>
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
                          class="flex w-[200px] justify-start items-center hover:cursor-pointer hover:bg-gray-100 px-1 rounded-lg"
                          @click="showRecord(item.uuid)"
                        >
                          <button
                            class="flex justify-center items-center"
                            
                          >
                            <i class="ri-checkbox-line text-lg text-green-500 mr-1"></i><span class="text-gray-700">Verifikasi</span>
                          </button>
                        </div>
                        
                        
                        <div
                          v-if="page.actions.edit"
                          class="flex w-[140px] justify-start items-center hover:cursor-pointer hover:bg-gray-100 px-1 rounded-lg"
                          @click="showRecord(item.uuid)"
                        >
                          <button
                            class="flex justify-center items-center"
                            
                          >
                            <i class="ri-edit-circle-fill text-lg text-orange-500 mr-1"></i><span class="text-gray-700">Ubah Data</span>
                          </button>
                        </div>
                        <div
                          v-if="page.actions.delete"
                          class="flex w-[140px] justify-start items-center hover:cursor-pointer hover:bg-gray-100 px-1 rounded-lg"
                          @click="postConfirmDelete(item.uuid)"
                        >
                          <button
                            class="flex justify-center items-center"
                            
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
        v-if="form.page"
        class="flex flex-col h-full w-full animate-fadeIn"
      >
        <div class="lg:w-full h-[48px] bg-cyan-700 rounded-t-md ">
          <div class="flex justify-between items-center h-full w-full px-5">
            <div class="text-white">
              Formulir Detail | Verifikasi | PIC
            </div>
            <div class="flex gap-x-3">
              <div class="text-white text-2xl">
                <i class="ri-close-circle-fill" @click="closeVerifikasiPage"></i>
                <i class="ri-question-fill"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="min-h-[74vh] w-full bg-white shadow round-b-md border border-gray-100 shadow p-4 mb-10">
          <div class="text-sm font-bold text-gray-400 uppercase mb-2">Identitas Surveyor</div>
          <div>
            <table class="w-full text-gray-500">
              <tr>
                <td class="w-48">Nama</td>
                <td class="w-4 text-center">:</td>
                <td>{{ record.surveyor_name }}</td>
              </tr>
              <tr>
                <td class="w-48">Jabatan</td>
                <td class="w-4 text-center">:</td>
                <td>{{ record.surveyor_position }}</td>
              </tr>
              <tr>
                <td class="w-48">No. HP</td>
                <td class="w-4 text-center">:</td>
                <td>{{ record.phone }}</td>
              </tr>
            </table>
          </div>
          <div class="text-sm font-bold text-gray-400 uppercase mb-2 py-5">PIC PERANGKAT</div>
          <div>
            <table class="w-full text-gray-500">
              <tr>
                <td class="w-48">Nama</td>
                <td class="w-4 text-center">:</td>
                <td>{{ record.meta[0]['pic_perangkatname'] }}</td>
              </tr>
              <tr>
                <td class="w-48">No. HP</td>
                <td class="w-4 text-center">:</td>
                <td>{{ record.meta[0]['pic_perangkat_phone'] }}</td>
              </tr>
            </table>
          </div>
          <div class="text-sm font-bold text-gray-400 uppercase mb-2 py-5">PIC GANGGUAN</div>
          <div>
            <table class="w-full text-gray-500">
              <tr>
                <td class="w-48">Nama</td>
                <td class="w-4 text-center">:</td>
                <td>{{ record.meta[0]['pic_gangguan_name'] }}</td>
              </tr>
              
              <tr>
                <td class="w-48">No. HP</td>
                <td class="w-4 text-center">:</td>
                <td>{{ record.meta[0]['pic_gangguan_phone'] }}</td>
              </tr>
            </table>
          </div>
          <div class="text-sm font-bold text-gray-400 uppercase mt-5 mb-2">Hasil Survey</div>
          <div>
            <table class="w-full text-gray-500">
              <tr>
                <td class="w-48">Kategori</td>
                <td class="w-4 text-center">:</td>
                <td>{{ record.category_name }}</td>
              </tr>
              <tr>
                <td class="w-48">Nama Lokasi</td>
                <td class="w-4 text-center">:</td>
                <td>{{ record.location_name }}</td>
              </tr>
              <tr>
                <td class="w-48">Estimasi Pengguna Per Hari</td>
                <td class="w-4 text-center">:</td>
                <td>{{ record.estimated_user_per_day }}</td>
              </tr>
              <tr>
                <td class="w-48">Kecamatan</td>
                <td class="w-4 text-center">:</td>
                <td>{{ record.district_name }}</td>
              </tr>
              <tr>
                <td class="w-48">Kelurahan/Desa</td>
                <td class="w-4 text-center">:</td>
                <td>{{ record.village_name }}</td>
              </tr>
              <tr>
                <td class="w-48">Alamat</td>
                <td class="w-4 text-center">:</td>
                <td>{{ record.address }}</td>
              </tr>
            </table>
          </div>
          <div>
            <div class="text-sm font-bold text-gray-400 uppercase mt-5 mb-2">Lampiran</div>
            <div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white rounded shadow p-4 flex flex-col items-center">
                  <div class="w-20 h-20 flex items-center justify-center bg-gray-100 rounded mb-2">
                    <img v-if="record.attachment_1_url" :src="record.attachment_1_url" alt="Attachment 1" class="object-contain h-full w-full" />
                    <span v-else class="text-gray-400">Tidak ada file</span>
                  </div>
                  <div class="font-semibold text-sm mb-1">Lampiran 1</div>
                  <a v-if="record.attachment_1_url" :href="record.attachment_1_url" target="_blank" class="text-blue-500 text-xs underline">Lihat File</a>
                </div>
                <div class="bg-white rounded shadow p-4 flex flex-col items-center">
                  <div class="w-20 h-20 flex items-center justify-center bg-gray-100 rounded mb-2">
                    <img v-if="record.attachment_2_url" :src="record.attachment_2_url" alt="Attachment 2" class="object-contain h-full w-full" />
                    <span v-else class="text-gray-400">Tidak ada file</span>
                  </div>
                  <div class="font-semibold text-sm mb-1">Lampiran 2</div>
                  <a v-if="record.attachment_2_url" :href="record.attachment_2_url" target="_blank" class="text-blue-500 text-xs underline">Lihat File</a>
                </div>
                <div class="bg-white rounded shadow p-4 flex flex-col items-center">
                  <div class="w-20 h-20 flex items-center justify-center bg-gray-100 rounded mb-2">
                    <img v-if="record.attachment_3_url" :src="record.attachment_3_url" alt="Attachment 3" class="object-contain h-full w-full" />
                    <span v-else class="text-gray-400">Tidak ada file</span>
                  </div>
                  <div class="font-semibold text-sm mb-1">Lampiran 3</div>
                  <a v-if="record.attachment_3_url" :href="record.attachment_3_url" target="_blank" class="text-blue-500 text-xs underline">Lihat File</a>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="text-sm font-bold text-gray-400 uppercase mt-5 mb-2">MAP LOKASI</div>
            <UMap
              :latitude="record.latitude"
              :longitude="record.longitude"
              :markers="markers"
              :showDefaultMarker="false"
              :defaultMarker="defaultMarker"
            />
          </div>
        </div>
  
      </div>
  
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
    UMap,
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
      UMap
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
      const endpoint = "api/v1/survey/surveys";
  
      const winheight = window.innerHeight - 320;
      const headers = [
        { title: "#", key: "ids", align: "center", width: "45px" },
        { title: "Topik Survey", key: "name", align: "start", width: "300px" },
        { title: "Surveyor", key: "name", align: "center",width: "150px" },
        { title: "Lokasi", key: "name", align: "center",width: "300px" },
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
        store.setRecord(result);
        store.setForm({
          add: false,
          edit: false,
          page:true,
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
        router.push({ name: "survey-topic-document-management", params: { survey_topic_id: payload } });
      };

      const showCategoryPage = (payload) => {
        router.push({ name: "survey-topic-category-management", params: { survey_topic_id: payload } });
      };

      const showVerifikasiPage = async (payload) => {
        
        store.setForm({
          add: false,
          edit: false,
          page: true,
        });
      };

      const closeVerifikasiPage = () => {
        store.setForm({
          add: false,
          edit: false,
          page: false,
        });
      };

      
      onMounted(() => {
        store.setPage({
          title: "Manjemen Survey",
          subtitle: "Berikut Daftar Seluruh Survey Pada Aplikasi ",
          breadcrumbs: [
            {
              name: "",
              title: "Survey",
            },
            {
              name: "survey-data-management",
              title: "Manajemen Data Survey",
            }
          ],
          actions: {
            refresh: true,
            add: false,
            edit: false,
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
        showVerifikasiPage,
        closeVerifikasiPage,
      };
    },
  };
  </script>
  
  