<template>
    <div class="flex flex-col mt-4 w-full min-h-full animate-fadeIn ">
      <!-- Desktop Device -->
      <div>
        <UFormDataTable
          title="Daftar Master Kategori Pelayanan"
          @onRefresh="fetchRecords({})"
          @onAdd="addNew"
          v-model:keyword="keyWord"
        >
          <template v-slot:data-table>
            <!-- U Data Table -->
            <div class="hidden sm:block">
              <UDataTable
                :headers="headers"
                @update:options="fetchRecords"
              >
                <template v-slot:body>
                  <tr
                    class="hover:bg-gray-50 text-sm"
                    v-for="(item,index) in records"
                  >
                    <td class="px-4 py-2 border border-grey-200 text-right">
                      {{ index = index+1 }}
                    </td>
                    <td class="px-4 py-2 border border-gray-200">{{ item.name }}</td>
                    <td class="px-4 py-2 border border-gray-200">{{ item.agency_master }}</td>
                    <td class="px-4 py-2 border border-gray-200">{{ item.description }}</td>
                    <td class="px-4 py-2 border border-gray-200">
                      <UDropdownOpsi>
                        <template v-slot:menu>
                          <div
                            class="flex w-[200px] justify-start items-center hover:cursor-pointer hover:bg-cyan-50 px-1 rounded-lg"
                          >
                            <button
                              class="flex justify-center items-center"
                              @click="openServiceCategoryDocumentMaster(item.uuid)"
                            >
                              <i class="ri-file-fill text-lg text-cyan-500 mr-1"></i><span class="text-cyan-700">Dokumen Persyaratan</span>
                            </button>
                          </div>
                          <div
                            v-if="page.actions.edit"
                            class="flex w-[140px] justify-start items-center hover:cursor-pointer hover:bg-cyan-50 px-1 rounded-lg"
                          >
                            <button
                              class="flex justify-center items-center"
                              @click="showRecord(item.uuid)"
                            >
                              <i class="ri-edit-circle-fill text-lg text-cyan-500 mr-1"></i><span class="text-cyan-700">Ubah Data</span>
                            </button>
                          </div>
                          <div
                            v-if="page.actions.delete"
                            class="flex w-[140px] justify-start items-center hover:cursor-pointer hover:bg-cyan-50 px-1 rounded-lg"
                          >
                            <button
                              class="flex justify-center items-center"
                              @click="postConfirmDelete(item.uuid)"
                            >
                              <i class="ri-delete-bin-2-fill text-lg text-red-500 mr-1"></i><span class="text-cyan-700">Hapus Data</span>
                            </button>
                          </div>
                        </template>
                      </UDropdownOpsi>
                    </td>
                  </tr>
                </template>
              </UDataTable>
            </div>
            <div class="lg:hidden">
              <u-data-mobile>
                <template v-slot:data>
                  <li
                    v-for="(item,index) in records"
                    class="bg-cyan-50 flex items-center justify-between p-4 rounded shadow hover:bg-cyan-100 sm:flex-col"
                  >
                    <span class="text-cyan-700">{{ item.file_name }}</span>
                    <UDropdownOpsi>
                      <template v-slot:menu>
                        <div
                          v-if="page.actions.edit"
                          class="flex w-[140px] justify-start items-center hover:cursor-pointer hover:bg-cyan-50 px-1 rounded-lg"
                        >
                          <button
                            class="flex justify-center items-center"
                            @click="showRecord(item.id)"
                          >
                            <i class="ri-edit-circle-fill text-lg text-cyan-500 mr-1"></i><span class="text-cyan-700">Ubah Data</span>
                          </button>
                        </div>
                        <div
                          v-if="page.actions.delete"
                          class="flex w-[140px] justify-start items-center hover:cursor-pointer hover:bg-cyan-50 px-1 rounded-lg"
                        >
                          <button
                            class="flex justify-center items-center"
                            @click="postConfirmDelete(item.uuid)"
                          >
                            <i class="ri-delete-bin-2-fill text-lg text-red-500 mr-1"></i><span class="text-cyan-700">Hapus Data</span>
                          </button>
                        </div>
                      </template>
                    </UDropdownOpsi>
                  </li>
  
                </template>
              </u-data-mobile>
            </div>
          </template>
        </UFormDataTable>
      </div>
  
      <!-- Form Slider -->
      <div
        v-if="false"
        class="flex flex-col h-full w-full animate-fadeIn"
      >
        <div class="lg:w-full h-[48px] bg-cyan-700 rounded-t-md ">
          <div class="flex justify-between items-center h-full w-full px-5">
            <div class="text-white">
              Formulir Manajemen Kategori Pelayanan
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
        title="Formulir Manajemen Kategori Pelayanan"
        @onSave="postRecord"
        @onUpdate="postUpdate"
      >
        <template v-slot:formdata>
          <div class="flex flex-col">

            <!-- Agency Master Field -->
            <div class="mb-4">
              <label
                for="agency_master"
                class="block text-sm font-medium text-cyan-700"
              >Dinas</label>
              <u-combo-box
              v-model="record.agency_master_id"
              :items="agencyMaster"
              placeholder="Pilih Dinas"
              @change="getDivisionMaster"
            />
            </div>
            <div class="mb-4">
              <label
                for="division_master_id"
                class="block text-sm font-medium text-cyan-700"
              >Bidang</label>
              <u-combo-box
              v-model="record.division_master_id"
              :items="divisionMaster"
              placeholder="Pilih Bidang"
            />
            </div>
            
          <!-- Nama Dinas -->
          <div class="mb-4">
            <label
              for="name"
              class="block text-sm font-medium text-cyan-700"
            >Nama Layanan</label>
            <input
              type="name"
              id="name"
              name="name"
              class="mt-1 block w-full px-3 py-2 border border-cyan-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              required
              v-model="record.name"
            >
          </div>
          <div class="mb-4">
            <label
              for="alias"
              class="block text-sm font-medium text-cyan-700"
            >Penjelasan Singkat</label>
            <input
              type="text"
              id="singkat"
              name="singkat"
              class="mt-1 block w-full px-3 py-2 border border-cyan-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              required
              v-model="record.description"
            >
          </div>
          </div>
        </template>
      </UFormDialog>

  
      <!-- Form Delete -->
      <UFormDelete @delete="postDelete" />
    </div>
  </template>
    
    <script>
  import { useRouter } from "vue-router";
  import { useAppStore } from "@/store/app";
  import { computed, onMounted, ref, watch } from "vue";
  import {
    UComboBox,
    USwitch,
    UDataTable,
    UDataMobile,
    UDropdownOpsi,
    UFormDelete,
    UFormDialog,
    UFormDataTable,
    UFileUpload,
  } from "@/components";
  import { debounce } from "lodash";
  
  export default {
    components: {
      UComboBox,
      USwitch,
      UDataTable,
      UDataMobile,
      UDropdownOpsi,
      UFormDelete,
      UFormDialog,
      UFormDataTable,
      UFileUpload,
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
      const endpoint = "api/v1/master-data/service-category-master";
  
      const winheight = window.innerHeight - 320;
      const headers = [
        { title: "#", key: "ids", align: "center", width: "45px" },
        { title: "Bidang", key: "name", align: "start" },
        { title: "Dinas", key: "agency_master", align: "start" },
        { title: "Pelayan", key: "alias", align: "start" },
        {
          title: "AKSI",
          key: "uuid",
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
      const agencyMaster = ref([]);
      const divisionMaster = ref([]);
  
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
          search: payload ? payload.search : null,
        };
  
        const result = await store.fetchRecords(endpoint, params, true);
  
        store.setRecords(result?.data.data ? result.data.data : []);
        table.value.totalItems = result?.data.meta.total;
      };
  
      /**
       * Post data record to store data
       */
      const postRecord = async () => {
        const result = await store.postRecord(endpoint, record.value,"store", true);
  
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
          "delete"
        );
  
        if (result?.data.status) {
          store.setSnackbar(result.data.message);
          store.setForm({
            add: false,
            edit: false,
            delete: false,
          });
          store.removeRecord(result.data.data.id);
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
        const endpoint = "api/v1/utility/users";
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
        table.value.footer.search = keyWord.value;
      }, 1000);

      //custome function
      const getAgencyMaster = async () => {
        const endpoint = "api/v1/combo/agency-master";
        const result = await store.getCombo(endpoint, true);
        agencyMaster.value =result;
      };

      const getDivisionMaster = async () => {
        const endpoint = "api/v1/combo/division-master/"+ record.value.agency_master_id;
        const result = await store.getCombo(endpoint, true);
        divisionMaster.value =result;
      };

      const openServiceCategoryDocumentMaster = async (uuid) => {
        router.push({
          name:"master-data-service-category-document-master",
          params: {
            service_category_master_uuid: uuid,
          },
        })
      };

  
      onMounted(() => {
        store.setPage({
          title: "Master Kategory",
          subtitle: "Berikut Daftar Kategory Yang Tersedia Aplikasi ",
          breadcrumbs: [
            {
              name: "",
              title: "Master Data",
            },
            {
              name: "master-data-service-category-master",
              title: "Master Kategory",
            },
          ],
          dataUrl: "api/v1/master-data/service-category-master",
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
        getAgencyMaster();
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
        agencyMaster,
        getDivisionMaster,
        divisionMaster,
        openServiceCategoryDocumentMaster
      };
    },
  };
  </script>