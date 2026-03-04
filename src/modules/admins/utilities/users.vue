<template>
  <div class="flex flex-col mt-4 w-full min-h-full animate-fadeIn">
    <UFormDataTable
      title="Daftar Pengguna"
      @onRefresh="fetchRecords({})"
      @onAdd="addNew"
      v-model:keyword="keyWord"
    >
      <template v-slot:data-table>
        <UDataTable
          :headers="headers"
          @update:options="fetchRecords"
        >
          <template v-slot:body>
            <tr
              v-for="(item, index) in records"
              :key="item.uuid || item.id || index"
              class="border-b border-gray-200 hover:bg-slate-50/80 transition-colors duration-150"
            >
              <td class="px-4 py-3 text-center text-sm text-slate-500 w-14">
                {{ (table.footer?.currentPage - 1) * (table.footer?.itemsPerPage || 10) + index + 1 }}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="flex-shrink-0 w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                    <img
                      v-if="item.avatar"
                      :src="item.avatar"
                      :alt="item.name"
                      class="w-full h-full object-cover"
                    >
                    <span
                      v-else
                      class="text-sm font-semibold text-slate-600"
                    >{{ (item.name || '?').charAt(0).toUpperCase() }}</span>
                  </div>
                  <span class="text-sm font-medium text-slate-900">{{ item.name }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-slate-600">{{ item.email }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700">
                  {{ item.role || '—' }}
                </span>
              </td>
              <td class="px-4 py-3 text-center">
                <span
                  :class="item.status
                    ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                    : 'bg-slate-100 text-slate-600 ring-slate-500/10'"
                  class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
                >
                  <span
                    :class="item.status ? 'bg-emerald-500' : 'bg-slate-400'"
                    class="h-1.5 w-1.5 rounded-full"
                  />
                  {{ item.status ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <UDropdownOpsi>
                  <template v-slot:menu>
                    <button
                      v-if="page.actions?.edit"
                      type="button"
                      class="flex w-full min-w-[160px] items-center gap-2.5 px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      @click="showRecord(item.uuid)"
                    >
                      <i class="ri-edit-line text-lg text-amber-600"></i>
                      <span>Ubah Data</span>
                    </button>
                    <button
                      v-if="page.actions?.delete"
                      type="button"
                      class="flex w-full min-w-[160px] items-center gap-2.5 px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
                      @click="postConfirmDelete(item.uuid)"
                    >
                      <i class="ri-delete-bin-line text-lg text-red-500"></i>
                      <span>Hapus Data</span>
                    </button>
                  </template>
                </UDropdownOpsi>
              </td>
            </tr>
          </template>
        </UDataTable>
      </template>
    </UFormDataTable>

    <!-- Form Dialog -->
    <UFormDialog
      title="Formulir Manajemen Pengguna"
      @onSave="postRecord"
      @onUpdate="postUpdate"
      width="w-[480px]"
    >
      <template v-slot:formdata>
        <div class="space-y-5">
          <!-- Profil -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-slate-800 border-b border-slate-200 pb-2">
              Profil
            </h3>
            <div>
              <UTextField
                v-model="record.name"
                label="Nama Lengkap"
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>
            <div>
              <UTextField
                v-model="record.email"
                label="Email"
                type="email"
                placeholder="nama@contoh.com"
                required
              />
            </div>
            <div>
              <UTextField
                v-model="record.phone"
                label="No. Telepon (WhatsApp)"
                placeholder="08xxxxxxxxxx"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Avatar</label>
              <UFileUpload
                v-model="record.avatar"
                folder="avatars"
              />
            </div>
          </div>

          <!-- Akses -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-slate-800 border-b border-slate-200 pb-2">
              Akses & Status
            </h3>
            <div>
              <UComboBox
                v-model="record.role_id"
                :items="authents"
                label="Level"
                placeholder="Pilih level"
                value-key="value"
                label-key="title"
              />
            </div>
            <div>
              <USwitch
                v-model="record.status"
                label="Akun aktif"
              />
            </div>
          </div>
        </div>
      </template>
    </UFormDialog>

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
    UTextField,
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
    const endpoint = "api/v1/utilities/users";

    const winheight = window.innerHeight - 320;
    const headers = [
      { title: "#", key: "ids", align: "center", width: "48px" },
      { title: "NAMA", key: "name", align: "start" },
      { title: "EMAIL", key: "email", align: "start" },
      { title: "LEVEL", key: "role", align: "start" },
      { title: "STATUS", key: "status", align: "center", width: "100px" },
      {
        title: "AKSI",
        key: "id",
        align: "end",
        width: "80px",
        sortable: false,
      },
    ];
    const authents = [
      { title: "Administrator", value: 1 },
      { title: "User", value: 2 },
    ];

    const isChecked = ref(false);
    const isOpen = ref(false);
    const selectedOption = ref(null);
    const keyWord = ref(null);

    const addNew = () => {
      store.setRecord({});
      store.setForm({
        add: true,
        edit: false,
      });
    };

    const fetchRecords = async (payload) => {
      const params = {
        page: payload?.page ?? 1,
        itemsPerPage: payload?.itemsPerPage ?? 10,
        keyWord: payload?.keyWord ?? keyWord.value ?? null,
      };
      const result = await store.fetchRecords(endpoint, params, true);
      store.setRecords(result?.data?.data ? result.data.data : []);
      if (result?.data?.meta) {
        const meta = result.data.meta;
        table.value.totalItems = meta.total ?? 0;
        table.value.footer.total = meta.total ?? 0;
        table.value.footer.currentPage = meta.current_page ?? 1;
        table.value.footer.firstPage = meta.first_page ?? 1;
        table.value.footer.lastPage = meta.last_page ?? 1;
      }
    };

    const postRecord = async () => {
      const result = await store.postRecord(
        endpoint,
        record.value,
        "store",
        true
      );
      if (result?.data?.status) {
        store.setSnackbar(
          result.data.message,
          colors.value.SUCCESS,
          types.value.SUCCESS
        );
        store.setForm({ add: false, edit: false });
        fetchRecords({ page: table.value?.footer?.currentPage, itemsPerPage: table.value?.footer?.itemsPerPage });
      }
    };

    const showRecord = async (payload) => {
      const result = await store.showRecord(endpoint + "/" + payload, true);
      store.setRecord(result?.data ?? result ?? {});
      store.setForm({
        add: true,
        edit: true,
      });
    };

    const postUpdate = async () => {
      const result = await store.postRecord(
        endpoint + "/" + record.value.uuid,
        record.value,
        "update",
        true
      );
      if (result?.data?.status) {
        store.setSnackbar(result.data.message, colors.value.SUCCESS);
        store.setForm({ add: false, edit: false });
        store.changeRecord(result.data.data);
      }
    };

    const postConfirmDelete = (payload) => {
      store.setRecord({ uuid: payload });
      store.setForm({
        add: false,
        edit: false,
        delete: true,
      });
    };

    const postDelete = async () => {
      const result = await store.postRecord(
        endpoint + "/" + record.value.uuid,
        {},
        "delete",
        true
      );
      if (result?.data?.status) {
        store.setSnackbar(result.data.message);
        store.setForm({
          add: false,
          edit: false,
          delete: false,
        });
        store.removeRecord(result.data.data?.uuid);
        store.setRecord({});
      }
    };

    const postConfirmBulkDelete = () => {};

    const openHelper = () => {
      store.setForm({ help: true });
    };

    const load = async ({ done }) => {
      const params = {
        page: list.value?.page ?? 1,
        itemsPerPage: list.value?.itemsPerPage ?? 10,
      };
      try {
        const result = await store.fetchRecords(endpoint, params, true);
        const data = result?.data?.data ?? [];
        data.forEach((el) => records.value.push(el));
        const meta = result?.data?.meta;
        if (meta) {
          store.setList({
            page: (meta.current_page ?? 1) + 1,
            lastPage: meta.last_page ?? 1,
          });
        }
        if (!meta || (meta.current_page >= meta.last_page)) done("empty");
      } catch {
        done("error");
      }
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
      if (table.value?.footer) {
        table.value.footer.keyWord = keyWord.value;
      }
      fetchRecords({
        page: 1,
        itemsPerPage: table.value?.footer?.itemsPerPage ?? 10,
        keyWord: keyWord.value,
      });
    }, 400);

    onMounted(() => {
      store.setPage({
        title: "Manajemen Pengguna",
        subtitle: "Berikut Daftar Seluruh Pengguna Aplikasi",
        breadcrumbs: [
          { name: "", title: "Utility" },
          { name: "utility-user", title: "Manajemen Pengguna" },
        ],
        dataUrl: endpoint,
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
      table,
      fetchRecords,
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
