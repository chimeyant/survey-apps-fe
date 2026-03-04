<template>
  <div class="flex flex-col w-full min-h-full">
    <UFormDataTable
      title="Daftar Topik Survey"
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
              <td class="px-4 py-3 text-sm text-gray-900 max-w-[200px]">
                <span class="font-medium line-clamp-2">{{ item.name }}</span>
              </td>
              <td class="px-4 py-3 text-center text-sm text-gray-600 whitespace-nowrap">
                {{ item.start_date }} – {{ item.end_date }}
              </td>
              <td class="px-4 py-3 text-center">
                <span
                  v-if="item.is_token"
                  class="font-mono text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded"
                >{{ item.token || '—' }}</span>
                <span
                  v-else
                  class="text-xs text-gray-500"
                >Tidak aktif</span>
              </td>
              <td class="px-4 py-3 text-center">
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  @click="openQrModal(item.uuid)"
                >
                  <i class="ri-qr-code-line text-base"></i>
                  QR Code
                </button>
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
                      @click="showTopicQuestionPage(item.uuid)"
                    >
                      <i class="ri-article-line text-lg text-indigo-600"></i>
                      <span>Template Formulir Survey</span>
                    </button>
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
      title="Formulir Topik Survey"
      @onSave="postRecord"
      @onUpdate="postUpdate"
    >
      <template #formdata>
        <div class="space-y-4">
          <div>
            <UTextField
              v-model="record.name"
              label="Nama Topik"
              placeholder="Nama topik survey"
              required
            />
          </div>
          <div>
            <UTextArea
              v-model="record.description"
              label="Penjelasan Singkat"
              placeholder="Deskripsi topik"
              required
            />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <UTextField
                v-model="record.start_date"
                label="Dari Tanggal"
                type="date"
                required
              />
            </div>
            <div>
              <UTextField
                v-model="record.end_date"
                label="Sampai Tanggal"
                type="date"
                required
              />
            </div>
            <div>
              <UTextField
                v-model="record.start_time"
                label="Jam Mulai"
                type="time"
              />
            </div>
            <div>
              <UTextField
                v-model="record.end_time"
                label="Jam Selesai"
                type="time"
              />
            </div>
          </div>
          <div>
            <USwitch
              v-model="record.is_token"
              label="Aktifkan Token"
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

    <!-- QR Modal -->
    <teleport to="body">
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showQrModal"
          class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-modal-title"
        >
          <div
            class="absolute inset-0 bg-black/50"
            aria-hidden="true"
            @click="closeQrModal"
          />
          <div
            class="relative w-full max-w-lg rounded-xl bg-white shadow-xl overflow-hidden"
            role="document"
          >
            <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4 bg-gray-50">
              <h2 id="qr-modal-title" class="text-lg font-semibold text-gray-900">
                {{ qrMeta.name || "QR Survey" }}
              </h2>
              <button
                type="button"
                class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Tutup"
                @click="closeQrModal"
              >
                <i class="ri-close-line text-xl"></i>
              </button>
            </div>
            <div class="p-5 space-y-4">
              <p v-if="qrMeta.description" class="text-sm text-gray-600">
                {{ qrMeta.description }}
              </p>
              <div class="flex items-center justify-center min-h-[280px] rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div v-if="qrLoading" class="text-sm text-gray-500 flex items-center gap-2">
                  <i class="ri-loader-4-line animate-spin text-lg"></i>
                  Menyiapkan QR Code...
                </div>
                <img
                  v-else-if="qrPreview"
                  :src="qrPreview"
                  alt="QR Code"
                  class="max-h-[320px] w-auto object-contain"
                />
                <div v-else class="text-sm text-red-600">
                  QR Code tidak tersedia.
                </div>
              </div>
            </div>
            <div class="flex flex-wrap items-center justify-end gap-2 border-t border-gray-200 bg-gray-50 px-5 py-4">
              <button
                type="button"
                class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                @click="closeQrModal"
              >
                Tutup
              </button>
              <button
                type="button"
                class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                :disabled="qrLoading || !qrMeta.url"
                @click="openLink"
              >
                Buka Link
              </button>
              <button
                type="button"
                class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
                :disabled="qrLoading || !qrPreview"
                @click="downloadQr"
              >
                <i class="ri-download-line mr-1.5 align-middle"></i>
                Download
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script>
import { useAppStore } from "@/store/app";
import { useRouter } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";
import {
  UDataTable,
  UDropdownOpsi,
  UFormDelete,
  UFormDialog,
  UFormDataTable,
  UTextArea,
  UTextField,
  USwitch,
} from "@/components";
import { debounce } from "lodash";

export default {
  name: "SurveyTopicModule",
  components: {
    UDataTable,
    UDropdownOpsi,
    UFormDelete,
    UFormDialog,
    UFormDataTable,
    UTextArea,
    UTextField,
    USwitch,
  },
  setup() {
    const store = useAppStore();
    const router = useRouter();
    const page = computed(() => store.page);
    const form = computed(() => store.form);
    const colors = computed(() => store.colors);
    const types = computed(() => store.types);
    const table = computed(() => store.table);
    const record = computed(() => store.record);
    const records = computed(() => store.records);

    const endpoint = "api/v1/survey/survey-topics";
    const keyWord = ref("");

    const showQrModal = ref(false);
    const qrPreview = ref(null);
    const qrLoading = ref(false);
    const qrMeta = ref({
      uuid: null,
      name: "",
      description: "",
      url: "",
    });

    const headers = [
      { title: "#", key: "ids", align: "center", width: "50px" },
      { title: "Topik", key: "name", align: "start", width: "200px" },
      { title: "Periode", key: "date", align: "center", width: "140px" },
      { title: "Token", key: "token", align: "center", width: "120px" },
      { title: "QR", key: "qr", align: "center", width: "100px" },
      { title: "Status", key: "status", align: "center", width: "90px" },
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
        keyWord: (payload.keyWord ?? payload.keyword) ?? keyWord.value ?? null,
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
        fetchRecords({
          page: table.value.footer?.currentPage,
          itemsPerPage: table.value.footer?.itemsPerPage,
          keyWord: keyWord.value,
        });
      }
    };

    const openQrModal = async (uuid) => {
      try {
        showQrModal.value = true;
        qrLoading.value = true;
        qrPreview.value = null;
        const topic = records.value.find((r) => r.uuid === uuid);
        if (!topic) {
          qrLoading.value = false;
          store.setSnackbar("Data topik tidak ditemukan", colors.value.ERROR, types.value.ERROR);
          showQrModal.value = false;
          return;
        }
        const surveyUrl = `${window.location.origin}/survey/${uuid}`;
        qrMeta.value = {
          uuid,
          name: topic.name,
          description: topic.description,
          url: surveyUrl,
        };
        const qrEndpoint = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(surveyUrl)}`;
        const response = await fetch(qrEndpoint);
        if (!response.ok) throw new Error("QR request failed");
        const blob = await response.blob();
        const qrWithText = await composeQrImage(blob, topic.name, topic.description);
        qrPreview.value = qrWithText;
        store.setSnackbar("QR Code siap diunduh", colors.value.SUCCESS, types.value.SUCCESS);
      } catch (err) {
        console.error("openQrModal error:", err);
        showQrModal.value = false;
        store.setSnackbar("Gagal menyiapkan QR Code", colors.value.ERROR, types.value.ERROR);
      } finally {
        qrLoading.value = false;
      }
    };

    const downloadQr = () => {
      if (!qrPreview.value || !qrMeta.value.uuid) return;
      const link = document.createElement("a");
      const safeName = (qrMeta.value.name || "qr-code")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      link.href = qrPreview.value;
      link.download = `${safeName}-${qrMeta.value.uuid}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      store.setSnackbar("QR Code berhasil diunduh", colors.value.SUCCESS, types.value.SUCCESS);
    };

    const openLink = () => {
      if (qrMeta.value.url) window.open(qrMeta.value.url, "_blank");
    };

    const closeQrModal = () => {
      showQrModal.value = false;
      qrPreview.value = null;
      qrMeta.value = { uuid: null, name: "", description: "", url: "" };
    };

    const composeQrImage = (blob, title, description) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const padding = 24;
          const infoHeight = 120;
          const canvas = document.createElement("canvas");
          canvas.width = img.width + padding * 2;
          canvas.height = img.height + infoHeight + padding * 2;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "#1f2937";
          ctx.textAlign = "center";
          const centerX = canvas.width / 2;
          ctx.font = "bold 24px Arial";
          wrapAndDrawText(ctx, title || "Survey Topic", centerX, padding, canvas.width - padding * 2, 28);
          ctx.font = "16px Arial";
          wrapAndDrawText(ctx, description || "Scan QR untuk membuka survei.", centerX, padding + 40, canvas.width - padding * 2, 22);
          ctx.drawImage(img, padding, infoHeight, img.width, img.height);
          resolve(canvas.toDataURL("image/png"));
        };
        const objectUrl = URL.createObjectURL(blob);
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error("Image load failed"));
        };
        img.onloadend = () => URL.revokeObjectURL(objectUrl);
        img.src = objectUrl;
      });
    };

    const wrapAndDrawText = (ctx, text, centerX, startY, maxWidth, lineHeight) => {
      const words = text.split(" ");
      let line = "";
      let y = startY;
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(line.trim(), centerX, y);
          line = words[i] + " ";
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), centerX, y);
    };

    const showTopicQuestionPage = (uuid) => {
      router.push({ name: "survey-topic-question-management", params: { survey_topic_id: uuid } });
    };

    const onSearch = debounce(() => {
      if (table.value.footer) table.value.footer.keyWord = keyWord.value;
      fetchRecords({ keyWord: keyWord.value, page: 1 });
    }, 400);

    watch(keyWord, () => onSearch());

    onMounted(() => {
      store.setPage({
        title: "Manajemen Topik Survey",
        subtitle: "Daftar topik survey pada aplikasi",
        breadcrumbs: [
          { name: "dashboard", title: "Dashboard" },
          { name: "survey-topic-management", title: "Manajemen Topik" },
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
      showTopicQuestionPage,
      openQrModal,
      downloadQr,
      openLink,
      closeQrModal,
      showQrModal,
      qrPreview,
      qrLoading,
      qrMeta,
    };
  },
};
</script>
