<template>
    <div class="flex flex-col mt-4 w-full min-h-full animate-fadeIn">
      <UFormDataTable
        title="Daftar Permohonan"
        @onRefresh="fetchRecords({})"
        @onAdd="addNew"
        v-model:keyword="keyWord"
        v-show="!formSlider"
      >
        <template v-slot:data-table>
          <!-- U Data Table -->
           <UTable
            :data="records"
            :headers="headers"
            show-actions="true"
            show-edit="true"
            show-delete="true"
            edit-title="Ubah Data"
            delete-title="Hapus Data"
            action-column-width="10px"
            action-column-align="center"
            row-key="uuid"
            show-checkbox="true"
            :selected-rows="selectedRows"
            checkbox-column-width="50px"
            total-rows="0"
          >
          <template #header-registration_date="{ header }">
            <div class="text-center">
              {{ header.title }}
            </div>
          </template>
          <template #header-status="{ header }">
            <div class="text-center">
              {{ header.title }}
            </div>
          </template>

          <template #cell-status="{ row, value }">
            <div class="flex items-center justify-center">
              <UChip
                :label="value == '10' ? 'Draft' : 'Pengajuan'"
                :color="value == '10' ? 'info' : 'warning'"
              />
          </div>
        </template>


          <template #actions="{ row, rowIndex }">
          <div class="flex justify-center">
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
                      @click="postConfirmDelete(row.uuid)"
                    >
                      <i class="ri-delete-bin-2-fill text-lg text-red-500 mr-1"></i><span class="text-gray-700">Hapus Data</span>
                   </button>
                </div>
              </template>
            </UDropdownOpsi>
          </div>
        </template>
      </UTable>
          
        </template>
      </UFormDataTable>
  
      <!-- Form Slider -->
      <div
        v-if="formSlider"
        class="flex flex-col h-full w-full animate-fadeIn px-2"
      >
        <div class="lg:w-full h-[45px] bg-gradient-to-r from-cyan-700 to-cyan-500  relative overflow-hidden rounded-t-md">
          <div class="flex justify-between items-center h-full w-full px-5">
            <div class="text-white">
            </div>
            <div class="flex gap-x-3 px-4 bg-white justify-center rounded-full min-w-[50px] border border-cyan-300 border-3">
              <div class="text-white text-2xl">
                <i class="ri-close-circle-fill text-red-500" @click="closeForm"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="min-h-[74vh] w-full bg-gradient-to-b from-white-100 to-white-800 round-b-md shadow-lg">
          <div class="mx-auto overflow-scroll min-h-[60vh] px-4 py-2">
            <div class="text-center text-uppercase text-lg font-bold pb-10">
              <h2 class="text-gray-500">Formulir Permohonan</h2>
            </div>
            <div>
              <div class="mb-4 flex items-center">
                <div class="w-full">
                  <UComboBox
                    :items="categories"
                    v-model="record.service_category_master_id"
                    value="id"
                    placeholder="Pilih Kategori Pelayanan"
                    @change="getSubcategories"
                    label="Kategori Pelayanan"
                    labelPosition="inline"
                    labelWidth="w-1/5"
                    required="true"
                  />
                </div>
              </div>
              <div class="mb-4 flex items-center">
                <div class="w-full">
                  <UComboBox
                    :items="subcategories"
                    v-model="record.service_sub_category_master_id"
                    value="id"
                    placeholder="Pilih Pelayanan"
                    label="Pelayanan"
                    labelPosition="inline"
                    labelWidth="w-1/5"
                    required="true"
                  />
                </div>
              </div>
              <div class="mb-4 flex items-center">
                <UTextField
                  v-model="record.application_title"
                  placeholder="Perihal"
                  required="true"
                  label="Perihal"
                  labelPosition="inline"
                  labelWidth="w-1/5"
                />
              </div>
              <div class="mb-4 flex items-center">
                <div class="w-full">
                  <UComboBox
                    :items="conditions"
                    v-model="record.condition"
                    value="id"
                    placeholder="Pilih Prioritas Permohonan"
                    label="Prioritas Permohonan"
                    labelPosition="inline"
                    labelWidth="w-1/5"
                    required="true"
                  />
                </div>
              </div>
              <div class="mb-4 flex items-center">
                <UTextArea
                  v-model="record.application_description"
                  placeholder="Keterangan"
                  required="true"
                  label="Keterangan"
                  labelPosition="inline"
                  labelWidth="w-1/5"
                />
              </div>
              <div v-if="record.attachments? record.attachments.length > 0 : false">
                <div class="text-xs font-bold py-2 text-gray-600 opacity-50 ">
                  Dokumen Persyaratan
                </div>
                <div
                  class="mb-4 flex items-center"
                  v-for="(document, index) in record.attachments"
                  :key="document.uuid"
                >
                  <div class="w-full">
                    <UFileUpload
                      v-model="record[document.uuid]"
                      folder="attachments"
                      @change="(values) => setDocuments(values, document)"
                      labelPosition="inline"
                      labelWidth="w-1/5"
                      :label="document.name"
                      :required="document.require"
                    />
                  </div>
                </div>
              </div>
              <div class="flex justify-end my-5 mx4 gap-x-2 pb-5">
                <hr>
                <UButton label="Simpan sebagai draft" @click="postRecord('draft')" rounded="sm" size="sm" variant="info"  iconLeft="ri-save-line" />
                <UButton label="Kirim" @click="postRecord('send')" rounded="sm" size="sm"  iconLeft="ri-send-plane-fill" />
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Form Dialog -->
  
      <UFormDialog
        title="Formulir Jenis Kendaraan"
        @onSave="postRecord"
        @onUpdate="postUpdate"
      >
        <template v-slot:formdata>
          <!-- Name Field -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Merek Kendaraan</label>
            <input
              type="text"
              id="name"
              name="name"
              v-model="record.name"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Keterangan</label>
            <textarea
              name="description"
              id=""
              v-model="record.description"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            ></textarea>
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
    UDropdownOpsi,
    UFormDelete,
    UFormDialog,
    UFormDataTable,
    UFileUpload,
    UChip,
    UButton,
    UTextField,
    UTextArea,
    UTable,
  } from "@/components";
  
  import { debounce } from "lodash";
  import { values } from "lodash";
  
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
      UChip,
      UButton,
      UTextField,
      UTextArea,
      UTable,
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
      const endpoint = "api/v1/opd/service-ticket";
  
      const winheight = window.innerHeight - 320;
      const headers = [
      {
          key: 'registration_date',
          title: 'Tanggal',
          align: 'center',
          width: '100px',
        },
        {
          key: 'application_title',
          title: 'Permohonan',
          align: 'start',
          width: '300px',
        },
        {
          key: 'status',
          title: 'Status',
          align: 'center',
          width: '100px'
        },
       
      ];
      
      /**
       * Variable Page
       */
      const formSlider = ref(false);
      const keyWord = ref(null);
      const categories =ref([])
      const subcategories =ref([])
      const conditions =ref([
        {
          value:"Biasa",
          title:"Biasa"
        },
        {
          value:"Sedang",
          title:"Sedang"
        },
        {
          value:"Prioritas",
          title:"Prioritas"
        }
      ])
      const documents =ref([])
      const selectedRows = ref([])
  
      /**
       * Function Page
       */
      const addNew = () => {
        store.setRecord({});
        formSlider.value=true
        // store.setForm({
        //   add: true,
        //   edit: false,
        // });
        store.setPage({
          showtable: false,
        })
      };

      const closeForm = () => {
        formSlider.value=false
        store.setPage({
          showtable: true,
        })
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
  
        const result = await store.fetchRecords(endpoint, params,true);
  
        store.setRecords(result?.data.data ? result.data.data : []);
        table.value.totalItems = result?.data.meta.total;
      };
  
      /**
       * Post data record to store data
       */
      const postRecord = async (type) => {
        if (type=="send") {
          record.value.status = "20";
        }else{
          record.value.status = "10";
        }
        const result = await store.postRecord(endpoint, record.value, "store", true);
  
        if (result?.data.data.status) {
          store.setSnackbar(
            result.data.message,
            colors.value.SUCCESS,
            types.value.SUCCESS
          );
          store.setForm({
            add: false,
            edit: false,
          });
          formSlider.value=false
          fetchRecords({});
        }
      };
  
      /**
       * Show data record for preparing edit data
       * @param payload
       */
      const showRecord = async (payload) => {
        const result = await store.showRecord(endpoint + "/" + payload);
        store.setRecord(result?.data.data);
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
          endpoint + "/" + record.value.id,
          record.value,
          "update"
        );
  
        if (result?.data.success) {
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
          id: payload,
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
          endpoint + "/" + record.value.id,
          {},
          "delete",true
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
  
      watch(keyWord, () => {
        onSearch();
      });
  
      const onSearch = debounce(() => {
        table.value.footer.keyWord = keyWord.value;
      }, 1000);

      //custome function page
      const getCategories = async () => {
        const endpoint = "api/v1/combo/service-category-master";
        const result = await store.getCombo(endpoint, true);
        categories.value =result;
      };

      const getSubcategories = async () => {
        subcategories.value =[];
        const endpoint = "api/v1/combo/service-sub-category-master/"+ record.value.service_category_master_id;
        const result = await store.getCombo(endpoint, true);
        subcategories.value =result;
        getDocuments()
        
      };

      const getDocuments = async () => {
        const endpoint = "api/v1/master-data/service-category-document-master/all-dokumen-persyaratan/"+ record.value.service_category_master_id;
        const result = await store.showRecord(endpoint, true);
        documents.value =result;
        record.value.attachments = result
      };

      const setDocuments = (payload, document) => {
        const object = {
          ...document,
          file_name: payload.value
        }

        if (payload.value != null) {
          // Add or update the file_name for the document with the same uuid
          const idx = record.value.attachments.findIndex(item => item.uuid === document.uuid);
          if (idx !== -1) {
            record.value.attachments[idx].file_name = payload.value;
          } else {
            record.value.attachments.push(object);
          }
        } else {
          // If payload.value is null, update file_name to null by uuid
          const idx = record.value.attachments.findIndex(item => item.uuid === document.uuid);
          if (idx !== -1) {
            record.value.attachments[idx].file_name = null;
          }
        }
      };
  
      onMounted(() => {
        store.setPage({
          title: "Daftar Permohon",
          subtitle: "Berikut Daftar Seluruh Model Kendaraan Yang Tersedia ",
          breadcrumbs: [
            {
              name: "",
              title: "Master Data",
            },
            {
              name: "master-data-vehicle-model",
              title: "Model Kendaraan",
            },
          ],
          dataUrl: "api/v1/utility/vehile-model",
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
        getCategories();
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
        formSlider,
        closeForm,
        categories,
        getSubcategories,
        subcategories,
        conditions,
        getDocuments,
        documents,
        setDocuments,
        selectedRows,
      };
    },
  };
  </script>