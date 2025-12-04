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
                <button
                  type="button"
                  class="focus:outline-none"
                  @click="openQrModal(item.uuid)"
                >
                  <UChip
                    label="Download QR Code"
                    color="info"
                  />
                </button>
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
    <!-- QR Preview Modal -->
    <div
      v-if="showQrModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
        <button
          type="button"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          @click="closeQrModal"
        >
          <i class="ri-close-circle-fill text-2xl"></i>
        </button>
        <div class="space-y-3 text-center mb-6">
          <h3 class="text-xl font-semibold text-gray-800">
            {{ qrMeta.name || "QR Survey Topic" }}
          </h3>
          <p class="text-sm text-gray-600">
            {{ qrMeta.description || "Scan QR untuk membuka survei." }}
          </p>
        </div>
        <div class="min-h-[300px] flex items-center justify-center border border-dashed border-gray-200 rounded-lg bg-gray-50">
          <div
            v-if="qrLoading"
            class="text-gray-500 text-sm"
          >Menyiapkan QR Code...</div>
          <img
            v-else-if="qrPreview"
            :src="qrPreview"
            alt="QR Preview"
            class="max-h-[360px] object-contain"
          >
          <div
            v-else
            class="text-red-500 text-sm"
          >QR Code tidak tersedia.</div>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            class="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            @click="closeQrModal"
          >
            Tutup
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50"
            :disabled="qrLoading || !qrPreview"
            @click="downloadQr"
          >
            Download
          </button>
        </div>
      </div>
    </div>
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
    const showQrModal = ref(false);
    const qrPreview = ref(null);
    const qrLoading = ref(false);
    const qrMeta = ref({
      uuid: null,
      name: "",
      description: "",
      url: "",
    });

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

    /**
     * Prepare QR modal preview
     * @param payload
     */
    const openQrModal = async (payload) => {
      try {
        showQrModal.value = true;
        qrLoading.value = true;
        qrPreview.value = null;

        const topic = records.value.find((item) => item.uuid === payload);

        if (!topic) {
          qrLoading.value = false;
          store.setSnackbar(
            "Data topik tidak ditemukan",
            colors.value.ERROR,
            types.value.ERROR
          );
          showQrModal.value = false;
          return;
        }

        const surveyUrl =
          topic.url || `${window.location.origin}/survey/${payload}`;

        qrMeta.value = {
          uuid: payload,
          name: topic.name,
          description: topic.description,
          url: surveyUrl,
        };

        const qrEndpoint = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(
          surveyUrl
        )}`;

        const response = await fetch(qrEndpoint);

        if (!response.ok) {
          throw new Error("QR request failed");
        }

        const blob = await response.blob();
        const qrWithText = await composeQrImage(
          blob,
          topic.name,
          topic.description
        );
        qrPreview.value = qrWithText;

        store.setSnackbar(
          "QR Code siap diunduh",
          colors.value.SUCCESS,
          types.value.SUCCESS
        );
      } catch (error) {
        console.error("openQrModal error:", error);
        showQrModal.value = false;
        store.setSnackbar(
          "Gagal menyiapkan QR Code",
          colors.value.ERROR,
          types.value.ERROR
        );
      } finally {
        qrLoading.value = false;
      }
    };

    /**
     * Download QR from modal preview
     */
    const downloadQr = () => {
      if (!qrPreview.value || !qrMeta.value.uuid) {
        return;
      }

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

      store.setSnackbar(
        "QR Code berhasil diunduh",
        colors.value.SUCCESS,
        types.value.SUCCESS
      );
    };

    const closeQrModal = () => {
      showQrModal.value = false;
      qrPreview.value = null;
      qrMeta.value = {
        uuid: null,
        name: "",
        description: "",
        url: "",
      };
    };

    /**
     * Compose QR with title & description text
     * @param blob
     * @param title
     * @param description
     * @returns {Promise<string>}
     */
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
          wrapAndDrawText(
            ctx,
            title || "Survey Topic",
            centerX,
            padding,
            canvas.width - padding * 2,
            28
          );

          ctx.font = "16px Arial";
          wrapAndDrawText(
            ctx,
            description || "Scan QR untuk membuka survei.",
            centerX,
            padding + 40,
            canvas.width - padding * 2,
            22
          );

          ctx.drawImage(img, padding, infoHeight, img.width, img.height);

          resolve(canvas.toDataURL("image/png"));
        };

        const objectUrl = URL.createObjectURL(blob);

        img.onerror = (err) => {
          URL.revokeObjectURL(objectUrl);
          reject(err);
        };

        img.onloadend = () => {
          URL.revokeObjectURL(objectUrl);
        };

        img.src = objectUrl;
      });
    };

    /**
     * Helper to wrap and draw text centered
     */
    const wrapAndDrawText = (
      ctx,
      text,
      centerX,
      startY,
      maxWidth,
      lineHeight
    ) => {
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
      openQrModal,
      downloadQr,
      closeQrModal,
      showQrModal,
      qrPreview,
      qrLoading,
      qrMeta,
    };
  },
};
</script>
  
  