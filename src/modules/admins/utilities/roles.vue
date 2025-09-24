<template>
    <div class="flex flex-col mt-4 w-full min-h-full animate-fadeIn ">
      <UFormDataTable
        title="Daftar Role dan Hak Akses"
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
                <td class="px-4 py-2 border border-gray-300">{{ item.name }}</td>
                <td class="px-4 py-2 border border-gray-300 text-center">
                  <div class="flex justify-center w-full">
                    <div
                      :class="{
                      'bg-green-700': item.is_view ? 'green' :'' ,
                      'bg-red-700': !item.is_view ? 'red':'' ,
                    }"
                      class="
                      h-[16px]
                      w-[16px]
                      rounded-full"
                    ></div>
  
                  </div>
                </td>
                <td class="px-4 py-2 border border-gray-300 text-center">
                  <div class="flex justify-center w-full">
                    <div
                      :class="{
                      'bg-green-700': item.is_create ? 'green' :'' ,
                      'bg-red-700': !item.is_create ? 'red':'' ,
                    }"
                      class="
                      h-[16px]
                      w-[16px]
                      rounded-full"
                    ></div>
  
                  </div>
                </td>
                <td class="px-4 py-2 border border-gray-300 text-center">
                  <div class="flex justify-center w-full">
                    <div
                      :class="{
                      'bg-green-700': item.is_update ? 'green' :'' ,
                      'bg-red-700': !item.is_update ? 'red':'' ,
                    }"
                      class="
                      h-[16px]
                      w-[16px]
                      rounded-full"
                    ></div>
  
                  </div>
                </td>
                <td class="px-4 py-2 border border-gray-300 text-center">
                  <div class="flex justify-center w-full">
                    <div
                      :class="{
                      'bg-green-700': item.is_delete ? 'green' :'' ,
                      'bg-red-700': !item.is_delete ? 'red':'' ,
                    }"
                      class="
                      h-[16px]
                      w-[16px]
                      rounded-full"
                    ></div>
  
                  </div>
                </td>
                <td class="px-4 py-2 border border-gray-300 text-center">
                  <div class="flex justify-center w-full">
                    <div
                      :class="{
                      'bg-green-700': item.is_export ? 'green' :'' ,
                      'bg-red-700': !item.is_export ? 'red':'' ,
                    }"
                      class="
                      h-[16px]
                      w-[16px]
                      rounded-full"
                    ></div>
  
                  </div>
                </td>
                <td class="px-4 py-2 border border-gray-300 text-center">
                  <div class="flex justify-center w-full">
                    <div
                      :class="{
                      'bg-green-700': item.is_import ? 'green' :'' ,
                      'bg-red-700': !item.is_import ? 'red':'' ,
                    }"
                      class="
                      h-[16px]
                      w-[16px]
                      rounded-full"
                    ></div>
  
                  </div>
                </td>
                <td class="px-4 py-2 border border-gray-300 text-center">
                  <div class="flex justify-center w-full">
                    <div
                      :class="{
                      'bg-green-700': item.is_print ? 'green' :'' ,
                      'bg-red-700': !item.is_print ? 'red':'' ,
                    }"
                      class="
                      h-[16px]
                      w-[16px]
                      rounded-full"
                    ></div>
  
                  </div>
                </td>
                <td class="px-4 py-2 border border-gray-300 text-center">
                  <div class="flex justify-center w-full">
                    <div
                      :class="{
                      'bg-green-700': item.is_download ? 'green' :'' ,
                      'bg-red-700': !item.is_download ? 'red':'' ,
                    }"
                      class="
                      h-[16px]
                      w-[16px]
                      rounded-full"
                    ></div>
  
                  </div>
                </td>
                <td class="px-4 py-2 border border-gray-300 text-center">
                  <div class="flex justify-center w-full">
                    <div
                      :class="{
                      'bg-green-700': item.status ? 'green' :'' ,
                      'bg-red-700': !item.status ? 'red':'' ,
                    }"
                      class="
                      h-[16px]
                      w-[16px]
                      rounded-full"
                    ></div>
  
                  </div>
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  <UDropdownOpsi>
                    <template v-slot:menu>
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
        title="Formulir Manajemen Role dan Hak Akses"
        @onSave="postRecord"
        @onUpdate="postUpdate"
      >
        <template v-slot:formdata>
          <!-- Name Field -->
          <div>
  
            <div class="mb-4">
              <UTextField
                v-model="record.name"
                label="Nama Role"
                required=true
              />
            </div>
            <div class="mb-4">
                <UTextArea
                    v-model="record.description"
                    label="Deskripsi"
                />
            </div>
            <div class="grid grid-cols-2 gap-x-1 gap-y-1 mb-4">
                <div class="w-1/2">
                    <USwitch
                        label="View"
                        v-model="record.is_view"
                    />
                </div>
                <div class="w-1/2">
                    <USwitch
                        label="Create"
                        v-model="record.is_create"
                    />
                </div>
                <div class="w-1/2">
                    <USwitch
                        label="Update"
                        v-model="record.is_update"
                    />
                </div>
                <div class="w-1/2">
                    <USwitch
                        label="Delete"
                        v-model="record.is_delete"
                    />
                </div>
                <div class="w-1/2">
                    <USwitch
                        label="Export"
                        v-model="record.is_export"
                    />
                </div>
                <div class="w-1/2">
                    <USwitch
                        label="Import"
                        v-model="record.is_import"
                    />
                </div>
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
    UTextArea,
    UTextField,
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
      UTextArea,
      UTextField
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
      const endpoint = "api/v1/utilities/roles";
  
      const winheight = window.innerHeight - 320;
      const headers = [
        { title: "#", key: "ids", align: "center", width: "45px" },
        { title: "ROLE", key: "name", align: "start" },
        { title: "VIEW", key: "is_view", align: "center", width: "75px" },
        { title: "CREATE", key: "is_create", align: "center", width: "75px" },
        { title: "UPDATE", key: "is_update", align: "center", width: "75px" },
        { title: "DELETE", key: "is_delete", align: "center", width: "75px" },
        { title: "EXPORT", key: "is_export", align: "center", width: "75px" },
        { title: "IMPORT", key: "is_import", align: "center", width: "75px" },
        { title: "PRINT", key: "is_print", align: "center", width: "75px" },
        { title: "DOWNLOAD", key: "is_download", align: "center", width: "75px" },
        { title: "STATUS", key: "status", align: "center", width: "75px" },
        {
          title: "AKSI",
          key: "id",
          align: "center",
          width: "50px",
          sortable: false,
        },
      ];
      const authents = [
        { title: "Administrator", value: 1 },
        { title: "User", value: 2 },
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
        if (record.value.status) {
          record.value.status = "active";
        } else {
          record.value.status = "inactive";
        }

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
        if (result.data.status=="active") {
          result.data.status = true;
        } else {
          result.data.status = false;
        }
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
        if (record.value.status) {
          record.value.status = "active";
        } else {
          record.value.status = "inactive";
        }
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
        table.value.footer.keyWord = keyWord.value;
      }, 1000);
  
      onMounted(() => {
        store.setPage({
          title: "Manjemen Roles dan Hak Akses",
          subtitle: "Berikut Daftar Seluruh Role dan Hak Akses Aplikasi ",
          breadcrumbs: [
            {
              name: "",
              title: "Utility",
            },
            {
              name: "utility-roles",
              title: "Manajemen Role dan Hak Akses",
            },
          ],
          actions: {
            refresh: true,
            add: true,
            edit: true,
            delete: true,
            bulkdelete: false,
            export: true,
            print: false,
            help: true,
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
        authents,
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
      };
    },
  };
  </script>
  
  