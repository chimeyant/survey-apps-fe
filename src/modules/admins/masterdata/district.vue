<template>
  <div class="flex flex-col w-full min-h-full">
    <UFormDataTable
      title="Daftar Kecamatan"
      @onRefresh="fetchRecords({})"
      @onAdd="addNew"
      v-model:keyWord="keyWord"
    >
      <template #data-table>
        <UDataTable
          :headers="headers"
          @update:options="fetchRecords"
        >
          <template #body>
            <tr
              v-for="(item, index) in records"
              :key="item.uuid || item.id || index"
              class="border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-3 text-center text-sm text-gray-500 w-14">
                {{ table.footer?.itemsPerPage * (table.footer?.currentPage - 1) + index + 1 }}
              </td>
              <td class="px-4 py-3 text-center text-sm font-medium text-gray-900">
                {{ item.code }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">
                {{ item.name }}
              </td>
              <td class="px-4 py-3 text-center">
                <span
                  :class="item.status ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'"
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                >
                  {{ item.status ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <UDropdownOpsi>
                  <template #menu>
                    <button
                      v-if="page.actions.edit"
                      type="button"
                      class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      @click="showRecord(item.uuid)"
                    >
                      <i class="ri-edit-line text-lg text-amber-600"></i>
                      <span>Ubah</span>
                    </button>
                    <button
                      v-if="page.actions.delete"
                      type="button"
                      class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      @click="postConfirmDelete(item.uuid)"
                    >
                      <i class="ri-delete-bin-line text-lg"></i>
                      <span>Hapus</span>
                    </button>
                  </template>
                </UDropdownOpsi>
              </td>
            </tr>
          </template>
        </UDataTable>
      </template>
    </UFormDataTable>

    <UFormDialog
      title="Formulir Kecamatan"
      @onSave="postRecord"
      @onUpdate="postUpdate"
    >
      <template #formdata>
        <div class="space-y-4">
          <div>
            <UTextField
              v-model="record.code"
              label="Kode"
              placeholder="Contoh: 001"
              required
            />
          </div>
          <div>
            <UTextField
              v-model="record.name"
              label="Nama Kecamatan"
              placeholder="Nama kecamatan"
              required
            />
          </div>
          <div>
            <USwitch
              v-model="record.status"
              label="Status aktif"
            />
          </div>
        </div>
      </template>
    </UFormDialog>

    <UFormDelete @delete="postDelete" />
  </div>
</template>

<script>
import { useAppStore } from "@/store/app";
import { computed, onMounted, ref, watch } from "vue";
import {
  UDataTable,
  UDropdownOpsi,
  UFormDelete,
  UFormDialog,
  UFormDataTable,
  UTextField,
  USwitch,
} from "@/components";
import { debounce } from "lodash";

export default {
  name: "DistrictModule",
  components: {
    UDataTable,
    UDropdownOpsi,
    UFormDelete,
    UFormDialog,
    UFormDataTable,
    UTextField,
    USwitch,
  },
  setup() {
    const store = useAppStore();
    const page = computed(() => store.page);
    const form = computed(() => store.form);
    const colors = computed(() => store.colors);
    const types = computed(() => store.types);
    const table = computed(() => store.table);
    const record = computed(() => store.record);
    const records = computed(() => store.records);

    const endpoint = "api/v1/master-data/districts";
    const keyWord = ref("");

    const headers = [
      { title: "#", key: "ids", align: "center", width: "60px" },
      { title: "Kode", key: "code", align: "center", width: "100px" },
      { title: "Nama", key: "name", align: "start" },
      { title: "Status", key: "status", align: "center", width: "100px" },
      { title: "Aksi", key: "id", align: "end", width: "80px", sortable: false },
    ];

    const addNew = () => {
      store.setRecord({});
      store.setForm({ add: true, edit: false });
    };

    const fetchRecords = async (payload = {}) => {
      const params = {
        page: payload.page ?? 1,
        itemsPerPage: payload.itemsPerPage ?? table.value.footer?.itemsPerPage ?? 10,
        keyWord: payload.keyWord ?? payload.keyword ?? keyWord.value ?? null,
      };
      const result = await store.fetchRecords(endpoint, params, true);
      store.setRecords(result?.data?.data ?? []);
      if (result?.data?.meta) {
        table.value.footer.totalItems = result.data.meta.total;
        table.value.footer.total = result.data.meta.total;
        table.value.footer.currentPage = result.data.meta.current_page;
        table.value.footer.lastPage = result.data.meta.last_page;
        table.value.footer.firstPage = result.data.meta.first_page ?? 1;
      }
    };

    const postRecord = async () => {
      const result = await store.postRecord(endpoint, record.value, "store", true);
      if (result?.data?.status) {
        store.setSnackbar(result.data.message, colors.value.SUCCESS, types.value.SUCCESS);
        store.setForm({ add: false, edit: false });
        records.value.push(result.data.data);
      }
    };

    const showRecord = async (uuid) => {
      const result = await store.showRecord(`${endpoint}/${uuid}`, true);
      store.setRecord(result?.data ?? result ?? {});
      store.setForm({ add: true, edit: true });
    };

    const postUpdate = async () => {
      const result = await store.postRecord(
        `${endpoint}/${record.value.uuid}`,
        record.value,
        "update",
        true
      );
      if (result?.data?.status) {
        store.setSnackbar(result.data.message, colors.value.SUCCESS, types.value.SUCCESS);
        store.setForm({ add: false, edit: false });
        store.changeRecord(result.data.data);
      }
    };

    const postConfirmDelete = (uuid) => {
      store.setRecord({ uuid });
      store.setForm({ add: false, edit: false, delete: true });
    };

    const postDelete = async () => {
      const result = await store.postRecord(
        `${endpoint}/${record.value.uuid}`,
        {},
        "delete",
        true
      );
      if (result?.data?.status) {
        store.setSnackbar(result.data.message, colors.value.SUCCESS, types.value.SUCCESS);
        store.setForm({ add: false, edit: false, delete: false });
        store.removeRecord(result.data.data?.uuid);
        store.setRecord({});
        fetchRecords({ page: table.value.footer?.currentPage, itemsPerPage: table.value.footer?.itemsPerPage, keyWord: keyWord.value });
      }
    };

    const onSearch = debounce(() => {
      if (table.value.footer) table.value.footer.keyWord = keyWord.value;
      fetchRecords({ keyWord: keyWord.value, page: 1 });
    }, 400);

    watch(keyWord, () => {
      onSearch();
    });

    onMounted(() => {
      store.setPage({
        title: "Manajemen Kecamatan",
        subtitle: "Daftar kecamatan pada aplikasi",
        breadcrumbs: [
          { name: "dashboard", title: "Dashboard" },
          { name: "master-data-district-management", title: "Manajemen Kecamatan" },
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
          search: true,
        },
        showtable: true,
      });
      fetchRecords({});
    });

    return {
      page,
      form,
      table,
      records,
      record,
      keyWord,
      headers,
      addNew,
      fetchRecords,
      postRecord,
      postUpdate,
      showRecord,
      postConfirmDelete,
      postDelete,
    };
  },
};
</script>
