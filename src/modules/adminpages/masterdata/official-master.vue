<template>
    <div class="flex flex-col mt-4 w-full min-h-full animate-fadeIn ">
      <!-- Desktop Device -->
      <div>
        <UFormDataTable
          title="Daftar Pejabat Dinas"
          
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
                    <td class="px-4 py-2 border border-gray-200">{{ item.position_master }}</td>
                    <td class="px-4 py-2 border border-gray-200">
                      <UDropdownOpsi>
                        <template v-slot:menu>
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
              Formulir Pejabat Dinas
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
        title="Formulir Pejabat Dinas"
        @onSave="postRecord"
        @onUpdate="postUpdate"
        width="w-[800px]"
      >
        <template v-slot:formdata>
          <div class="flex flex-col">

            <!-- Agency Master Field -->
            <div class="grid grid-cols-2 gap-x-3 mb-4">
              <u-combo-box
              v-model="record.agency_master_id"
              :items="agencyMaster"
              placeholder="Pilih Dinas"
              @change="getDivisionMaster"
            />
            <u-combo-box
              v-model="record.division_master_id"
              :items="divisionMaster"
              placeholder="Pilih Bidang"
            />
            </div>
           
            <div class="mb-4">
              <label
                for="position_master_id"
                class="block text-sm font-medium text-cyan-700"
              >Jabatan</label>
              <u-combo-box
              v-model="record.position_master_id"
              :items="positionMaster"
              placeholder="Pilih Jabatan"
            />
            </div>
            
          <!-- Nama Dinas -->
          <div class="mb-4">
            <label
              for="name"
              class="block text-sm font-medium text-cyan-700"
            >Nama</label>
            <input
              type="name"
              id="name"
              name="name"
              class="mt-1 block w-full px-3 py-2 border border-cyan-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              required
              v-model="record.name"
            >
          </div>
           <!-- NIP -->
           <div class="mb-4">
            <label
              for="nip"
              class="block text-sm font-medium text-cyan-700"
            >NIP</label>
            <input
              type="nip"
              id="nip"
              name="nip"
              class="mt-1 block w-full px-3 py-2 border border-cyan-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              required
              v-model="record.nip"
            >
          </div>

           <!-- NIP -->
           <div class="mb-4">
            <label
              for="nik"
              class="block text-sm font-medium text-cyan-700"
            >NIK</label>
            <input
              type="nik"
              id="nik"
              name="nik"
              class="mt-1 block w-full px-3 py-2 border border-cyan-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              required
              v-model="record.nik"
            >
          </div>

           <!-- NIP -->
           <div class="mb-4">
            <label
              for="nik"
              class="block text-sm font-medium text-cyan-700"
            >Telp</label>
            <input
              type="telp"
              id="telp"
              name="telp"
              class="mt-1 block w-full px-3 py-2 border border-cyan-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              required
              v-model="record.phone"
            >
            
          </div>
          <div class="mb-4">
              <label
                for="position_master_id"
                class="block text-sm font-medium text-cyan-700"
              >Status Pegawai</label>
              <u-combo-box
              v-model="record.employee_status"
              :items="employeeStatus"
              placeholder="Pilih Status Pegawai"
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
    UPhoneInput,
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
      UPhoneInput
    },
    setup() {
      const store = useAppStore();
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
      const endpoint = "api/v1/master-data/official-master";
  
      const winheight = window.innerHeight - 320;
      const headers = [
        { title: "#", key: "ids", align: "center", width: "45px" },
        { title: "Nama", key: "name", align: "start" },
        { title: "Jabatan", key: "position_master", align: "start" },
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
      const keyWord = ref('');
      const agencyMaster = ref([]);
      const divisionMaster = ref([]);
      const positionMaster = ref([]);
      const employeeStatus = ref([
        {
          title: "Definitif",
          value: "definitif"
        },
        {
          title: "PLT",
          value: "plt"
        }
      ]);
  
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
          keyword: payload ? payload.keyword : null,
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
        console.log("keyWord:", keyWord.value);
        table.value.footer.keyword = keyWord.value;
        console.log("table.value.footer.keyword:", table.value.footer.keyword);
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

      const getPositionMaster = async () => {
        const endpoint = "api/v1/combo/position-master";
        const result = await store.getCombo(endpoint, true);
        positionMaster.value =result;
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
              name: "master-data-official-master",
              title: "Daftar Pejabat Dinas",
            },
          ],
          dataUrl: "",
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
        getPositionMaster();
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
        positionMaster,
        employeeStatus,
      };
    },
  };
  </script>