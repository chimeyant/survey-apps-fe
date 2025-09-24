<template>
  <div class="flex flex-col mt-4 w-full min-h-full animate-fadeIn ">
    <UFormDataTable
      title="Daftar Model Kendaraan"
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
              v-for="(item,index) in records"
            >
              <td class="px-4 py-2 border border-gray-300">
                {{ index = index+1 }}
              </td>
              <td class="px-4 py-2 border border-gray-300">{{ item.name }}</td>

              <td class="px-4 py-2 border border-gray-300">
                <UDropdownOpsi>
                  <template v-slot:menu>
                    <div
                      v-if="page.actions.edit"
                      class="flex w-[140px] justify-start items-center hover:cursor-pointer hover:bg-gray-100 px-1 rounded-lg"
                    >
                      <button
                        class="flex justify-center items-center"
                        @click="showRecord(item.id)"
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
                        @click="postConfirmDelete(item.id)"
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
            Formulir Jenis Kendaraan
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
          >
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
    UChip,
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
    const endpoint = "api/v1/master-data/vehicle-model";

    const winheight = window.innerHeight - 320;
    const headers = [
      { title: "#", key: "ids", align: "center", width: "45px" },
      { title: "Model Kendaraan", key: "name", align: "start" },
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

      const result = await store.fetchRecords(endpoint, params);

      store.setRecords(result?.data.data ? result.data.data : []);
      table.value.totalItems = result?.data.meta.total;
    };

    /**
     * Post data record to store data
     */
    const postRecord = async () => {
      const result = await store.postRecord(endpoint, record.value);

      if (result?.data.success) {
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
        "delete"
      );

      if (result?.data.success) {
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

    onMounted(() => {
      store.setPage({
        title: "Daftar Model Kendaraan",
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
    };
  },
};
</script>
            
            