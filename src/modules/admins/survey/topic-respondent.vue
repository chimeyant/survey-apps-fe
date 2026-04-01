<template>
  <div class="flex flex-col w-full min-w-0 max-w-full min-h-full overflow-hidden">
    <UFormDataTable
      class="min-w-0 max-w-full"
      :title="page.title"
      :subtitle="page.subtitle"
      @onRefresh="fetchRecords({})"
      @onAdd="addNew"
      @onExport="exportToExcel"
      v-model:keyWord="keyWord"
    >
      <template #data-table>
        <UDataTable
          :headers="tableHeaders"
          v-model:column-widths="columnWidths"
          @update:options="fetchRecords"
        >
          <template #body>
            <tr
              v-for="(item, index) in records"
              :key="item.uuid || item.id || index"
              class="border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td
                class="px-4 py-3 text-center text-sm text-gray-500"
                :style="getColumnStyle(tableHeaders[0]?.key)"
              >
                {{ table.footer?.itemsPerPage * (table.footer?.currentPage - 1) + index + 1 }}
              </td>
              <td
                class="px-4 py-3 text-sm text-gray-900"
                :style="getColumnStyle(tableHeaders[1]?.key)"
              >
                <span class="font-medium line-clamp-2">{{ item.respondent_id || '—' }}</span>
              </td>
              <td
                v-for="(q, qIdx) in questionColumns"
                :key="q.survey_topic_question_id"
                class="px-4 py-3 text-sm text-gray-700"
                :style="getColumnStyle(tableHeaders[2 + qIdx]?.key)"
              >
                <span
                  v-if="isCheckboxChecked(getAnswerRow(item, q.survey_topic_question_id))"
                  class="inline-flex text-emerald-600"
                  title="Tercentang"
                >
                  <i class="ri-checkbox-circle-fill text-lg"></i>
                </span>
                <span
                  v-else-if="isCheckboxOrSwitchUnchecked(getAnswerRow(item, q.survey_topic_question_id))"
                  class="inline-flex text-gray-400"
                  title="Tidak tercentang"
                >
                  <i class="ri-close-circle-line text-lg"></i>
                </span>
                <span
                  v-else-if="isLocationAnswer(getAnswerRow(item, q.survey_topic_question_id))"
                  class="inline-flex"
                >
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
                    title="Lihat di peta"
                    @click="openMapModal(getAnswerRow(item, q.survey_topic_question_id))"
                  >
                    <i class="ri-map-pin-line text-base"></i>
                    Peta
                  </button>
                </span>
                <span
                  v-else-if="isFileAnswer(getAnswerRow(item, q.survey_topic_question_id))"
                  class="inline-flex"
                >
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    title="Lihat file"
                    @click="openFileViewer(getAnswerRow(item, q.survey_topic_question_id))"
                  >
                    <i class="ri-file-view-line text-base"></i>
                    View
                  </button>
                </span>
                <span
                  v-else
                  class="line-clamp-2"
                >{{ getAnswerForQuestion(item, q.survey_topic_question_id) }}</span>
              </td>

              <td
                class="px-4 py-3 text-right"
                :style="getColumnStyle(tableHeaders[tableHeaders.length - 1]?.key)"
              >
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
              <h2
                id="qr-modal-title"
                class="text-lg font-semibold text-gray-900"
              >
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
              <p
                v-if="qrMeta.description"
                class="text-sm text-gray-600"
              >
                {{ qrMeta.description }}
              </p>
              <div class="flex items-center justify-center min-h-[280px] rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div
                  v-if="qrLoading"
                  class="text-sm text-gray-500 flex items-center gap-2"
                >
                  <i class="ri-loader-4-line animate-spin text-lg"></i>
                  Menyiapkan QR Code...
                </div>
                <img
                  v-else-if="qrPreview"
                  :src="qrPreview"
                  alt="QR Code"
                  class="max-h-[320px] w-auto object-contain"
                />
                <div
                  v-else
                  class="text-sm text-red-600"
                >
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
                class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1"
                :disabled="qrLoading || !qrMeta.url"
                @click="copyLink"
              >
                <i class="ri-file-copy-line mr-1.5 align-middle"></i>
                Copy Link
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

    <!-- Modal Detail Jawaban (dynamic table dari survey_topic_question_answers) -->
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
          v-if="showDetailJawaban"
          class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-jawaban-title"
        >
          <div
            class="absolute inset-0 bg-black/50"
            aria-hidden="true"
            @click="closeDetailJawaban"
          />
          <div
            class="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-xl bg-white shadow-xl overflow-hidden"
            role="document"
          >
            <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4 bg-gray-50 shrink-0">
              <h2
                id="detail-jawaban-title"
                class="text-lg font-semibold text-gray-900"
              >
                Data Responden — {{ detailRespondent?.respondent_id || '—' }}
              </h2>
              <button
                type="button"
                class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Tutup"
                @click="closeDetailJawaban"
              >
                <i class="ri-close-line text-xl"></i>
              </button>
            </div>
            <div class="flex-1 overflow-auto p-5">
              <table class="w-full border-collapse text-sm">
                <thead>
                  <tr class="border-b border-gray-200 bg-gray-50">
                    <th class="px-4 py-3 text-left font-semibold text-gray-700 w-12">#</th>
                    <th class="px-4 py-3 text-left font-semibold text-gray-700">Pertanyaan</th>
                    <th class="px-4 py-3 text-left font-semibold text-gray-700 w-28">Tipe</th>
                    <th class="px-4 py-3 text-center font-semibold text-gray-700 w-20">Wajib</th>
                    <th class="px-4 py-3 text-left font-semibold text-gray-700 min-w-[120px]">Jawaban 1</th>
                    <th class="px-4 py-3 text-left font-semibold text-gray-700 min-w-[120px]">Jawaban 2</th>
                    <th class="px-4 py-3 text-left font-semibold text-gray-700 min-w-[120px]">Jawaban 3</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, idx) in detailAnswerRows"
                    :key="row.key"
                    class="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td class="px-4 py-3 text-gray-500">{{ idx + 1 }}</td>
                    <td class="px-4 py-3 text-gray-900">{{ row.question_text || '—' }}</td>
                    <td class="px-4 py-3 text-gray-600">{{ row.question_type || '—' }}</td>
                    <td class="px-4 py-3 text-center">
                      <span
                        :class="row.question_required ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'"
                        class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                      >
                        {{ row.question_required ? 'Ya' : 'Tidak' }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-gray-700">{{ row.jawaban1 || '—' }}</td>
                    <td class="px-4 py-3 text-gray-700">{{ row.jawaban2 || '—' }}</td>
                    <td class="px-4 py-3 text-gray-700">{{ row.jawaban3 || '—' }}</td>
                  </tr>
                  <tr v-if="!detailAnswerRows.length">
                    <td
                      colspan="7"
                      class="px-4 py-8 text-center text-gray-500"
                    >Tidak ada jawaban.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="flex justify-end gap-2 border-t border-gray-200 bg-gray-50 px-5 py-4 shrink-0">
              <button
                type="button"
                class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                @click="closeDetailJawaban"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Modal Peta (location) -->
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
          v-if="showMapModal"
          class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="map-modal-title"
        >
          <div
            class="absolute inset-0 bg-black/50"
            aria-hidden="true"
            @click="closeMapModal"
          />
          <div
            class="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-xl bg-white shadow-xl overflow-hidden"
            role="document"
          >
            <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4 bg-gray-50 shrink-0">
              <h2
                id="map-modal-title"
                class="text-lg font-semibold text-gray-900"
              >
                Lokasi
              </h2>
              <button
                type="button"
                class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Tutup"
                @click="closeMapModal"
              >
                <i class="ri-close-line text-xl"></i>
              </button>
            </div>
            <div class="flex-1 min-h-[320px] overflow-auto p-5">
              <UMap
                v-if="mapLocation"
                :latitude="mapLocation.lat"
                :longitude="mapLocation.lng"
                :show-default-marker="!!(mapLocation.lat && mapLocation.lng)"
              />
              <p
                v-else
                class="text-sm text-gray-500 py-4"
              >Koordinat tidak tersedia.</p>
            </div>
            <div class="flex justify-end gap-2 border-t border-gray-200 bg-gray-50 px-5 py-4 shrink-0">
              <button
                type="button"
                class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
                @click="closeMapModal"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <UFileViewer
      :visible="showFileViewer"
      :file-url="fileViewerData.url"
      :file-name="fileViewerData.fileName"
      :file-size="fileViewerData.fileSize"
      :file-type="fileViewerData.fileType"
      @close="closeFileViewer"
    />
  </div>
</template>
  
  <script>
import { useAppStore } from "@/store/app";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";
import {
  UDataTable,
  UDropdownOpsi,
  UFormDelete,
  UFormDialog,
  UFormDataTable,
  UFileViewer,
  UMap,
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
    UFileViewer,
    UMap,
    UTextArea,
    UTextField,
    USwitch,
  },
  setup() {
    const store = useAppStore();
    const router = useRouter();
    const route = useRoute();
    const page = computed(() => store.page);
    const form = computed(() => store.form);
    const colors = computed(() => store.colors);
    const types = computed(() => store.types);
    const table = computed(() => store.table);
    const record = computed(() => store.record);
    const records = computed(() => store.records);

    const endpoint =
      "api/v1/survey/survey-topic-respondents/" + route.params.survey_topic_id;
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

    const showDetailJawaban = ref(false);
    const detailRespondent = ref(null);

    const showMapModal = ref(false);
    const mapLocation = ref(null);

    const openDetailJawaban = (item) => {
      detailRespondent.value = item;
      showDetailJawaban.value = true;
    };

    const closeDetailJawaban = () => {
      showDetailJawaban.value = false;
      detailRespondent.value = null;
    };

    const isLocationAnswer = (row) => {
      return row && (row.question_type || "").toLowerCase() === "location";
    };

    const getLocationFromAnswer = (row) => {
      if (!row) return null;
      let lat = null;
      let lng = null;
      if (row.answer_json != null && row.answer_json !== "") {
        try {
          const parsed =
            typeof row.answer_json === "string"
              ? JSON.parse(row.answer_json)
              : row.answer_json;
          if (parsed && typeof parsed === "object") {
            lat = parsed.latitude ?? parsed.lat ?? parsed.latLng?.[0];
            lng = parsed.longitude ?? parsed.lng ?? parsed.latLng?.[1];
          }
        } catch (_) {}
      }
      if ((lat == null || lng == null) && row.answer_text) {
        const parts = String(row.answer_text).split(/[,;\s]+/);
        if (parts.length >= 2) {
          lat = parseFloat(parts[0]);
          lng = parseFloat(parts[1]);
        }
      }
      if (
        lat != null &&
        lng != null &&
        !Number.isNaN(lat) &&
        !Number.isNaN(lng)
      ) {
        return { lat, lng };
      }
      return null;
    };

    const openMapModal = (row) => {
      const loc = getLocationFromAnswer(row);
      mapLocation.value = loc || { lat: -6.1783, lng: 106.6319 };
      showMapModal.value = true;
    };

    const closeMapModal = () => {
      showMapModal.value = false;
      mapLocation.value = null;
    };

    const showFileViewer = ref(false);
    const fileViewerData = ref({
      url: "",
      fileName: "File",
      fileSize: "",
      fileType: "",
    });

    const isFileAnswer = (row) => {
      return row && (row.question_type || "").toLowerCase() === "file";
    };

    const getFileInfoFromAnswer = (row) => {
      if (!row) return null;
      let url = "";
      let fileName = "File";
      let fileSize = "";
      let fileType = "";
      if (row.answer_json != null && row.answer_json !== "") {
        try {
          const parsed =
            typeof row.answer_json === "string"
              ? JSON.parse(row.answer_json)
              : row.answer_json;
          if (parsed && typeof parsed === "object") {
            url = parsed.url ?? parsed.path ?? parsed.src ?? "";
            fileName =
              parsed.fileName ?? parsed.file_name ?? parsed.name ?? fileName;
            fileSize =
              parsed.fileSize ?? parsed.file_size ?? parsed.size ?? fileSize;
            fileType =
              parsed.fileType ?? parsed.file_type ?? parsed.type ?? fileType;
          }
        } catch (_) {}
      }
      if (!url && row.answer_text) {
        url = String(row.answer_text).trim();
        const parts = url.split("/").filter(Boolean);
        if (parts.length) fileName = parts[parts.length - 1];
      }
      if (
        url &&
        !url.startsWith("http://") &&
        !url.startsWith("https://") &&
        !url.startsWith("blob:")
      ) {
        const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
        const pathOrFilename = url.replace(/^\/?documents\/?/i, "");
        url = `${baseUrl}/api/v1/media-file/download/documents/${pathOrFilename}`;
      }
      if (!url) return null;
      if (!fileType && fileName) {
        const ext = fileName.split(".").pop()?.toLowerCase() || "";
        fileType = ext;
      }
      return { url, fileName, fileSize, fileType };
    };

    const openFileViewer = (row) => {
      const info = getFileInfoFromAnswer(row);
      if (info) {
        fileViewerData.value = { ...info };
        showFileViewer.value = true;
      }
    };

    const closeFileViewer = () => {
      showFileViewer.value = false;
      fileViewerData.value = {
        url: "",
        fileName: "File",
        fileSize: "",
        fileType: "",
      };
    };

    const parseQuestionOptions = (json) => {
      if (json == null) return [];
      try {
        const arr = typeof json === "string" ? JSON.parse(json) : json;
        return Array.isArray(arr) ? arr : [];
      } catch {
        return [];
      }
    };

    /** Label kecamatan/desa untuk jawaban tipe lokasi (Kecamatan & Desa) */
    const districtLabelByCode = ref({});
    const villageLabelByComposite = ref({});

    const parseLocationAddressPayload = (row) => {
      if (!row) return null;
      const qType = (row.question_type || "").toLowerCase();
      if (qType !== "location-address" && qType !== "lokasi") return null;
      let obj = null;
      if (row.answer_json != null && row.answer_json !== "") {
        try {
          obj =
            typeof row.answer_json === "string"
              ? JSON.parse(row.answer_json)
              : row.answer_json;
        } catch (_) {}
      }
      if (
        !obj &&
        row.answer_text &&
        String(row.answer_text).trim().startsWith("{")
      ) {
        try {
          obj = JSON.parse(row.answer_text);
        } catch (_) {}
      }
      if (!obj || typeof obj !== "object") return null;
      const district_code = String(
        obj.district_code ?? obj.district ?? ""
      ).trim();
      const village_code = String(
        obj.village_code ?? obj.village ?? ""
      ).trim();
      if (!district_code && !village_code) return null;
      return { district_code, village_code };
    };

    const hydrateLocationAddressLabels = async () => {
      const districtSet = new Set();
      for (const r of records.value) {
        for (const a of r.survey_topic_question_answers || []) {
          const codes = parseLocationAddressPayload(a);
          if (codes?.district_code) districtSet.add(codes.district_code);
        }
      }
      if (!districtSet.size) return;
      try {
        const data = await store.getCombo("/api/v1/combo/districts", true);
        const list = Array.isArray(data) ? data : [];
        const dmap = { ...districtLabelByCode.value };
        for (const d of list) {
          const code = String(d.value ?? d.code ?? "").trim();
          const title = (d.title ?? d.name ?? "").trim();
          if (code) dmap[code] = title || code;
        }
        districtLabelByCode.value = dmap;
      } catch (e) {
        console.error("hydrateLocationAddressLabels districts:", e);
      }
      const vmap = { ...villageLabelByComposite.value };
      for (const dist of districtSet) {
        try {
          const data = await store.getCombo(
            `/api/v1/combo/villages/${encodeURIComponent(dist)}`,
            true
          );
          const list = Array.isArray(data) ? data : [];
          for (const v of list) {
            const code = String(v.value ?? v.code ?? "").trim();
            const title = (v.title ?? v.name ?? "").trim();
            if (code) {
              vmap[`${dist}:${code}`] = title || code;
              if (!vmap[code]) vmap[code] = title || code;
            }
          }
        } catch (e) {
          console.error("hydrateLocationAddressLabels villages:", dist, e);
        }
      }
      villageLabelByComposite.value = vmap;
    };

    const formatLocationAddressAnswer = (row) => {
      const codes = parseLocationAddressPayload(row);
      if (!codes) return "—";
      const dName =
        districtLabelByCode.value[codes.district_code] || codes.district_code;
      const vKey = `${codes.district_code}:${codes.village_code}`;
      const vName =
        villageLabelByComposite.value[vKey] ||
        villageLabelByComposite.value[codes.village_code] ||
        codes.village_code;
      if (dName && vName)
        return `${dName} — ${vName}`;
      return dName || vName || "—";
    };

    /** Map question_id -> question_options dari jawaban mana pun yang punya options (untuk fallback baris pertama) */
    const questionOptionsByQuestionId = computed(() => {
      const map = {};
      for (const r of records.value) {
        const list = r.survey_topic_question_answers || [];
        for (const a of list) {
          const id = a.survey_topic_question_id;
          if (
            id != null &&
            a.question_options != null &&
            a.question_options !== ""
          ) {
            if (!map[id]) map[id] = a.question_options;
          }
        }
      }
      return map;
    });

    const formatAnswer = (row, fallbackQuestionOptions) => {
      const rawValue = row.answer_text || "";
      const qType = (row.question_type || "").toLowerCase();

      if (qType === "location-address" || qType === "lokasi") {
        return formatLocationAddressAnswer(row);
      }

      if (qType === "select") {
        const optionsJson = row.question_options ?? fallbackQuestionOptions;
        if (optionsJson != null) {
          const opts = parseQuestionOptions(optionsJson);
          const selected = opts.find(
            (o) =>
              String(o.value ?? o.id ?? "") === String(rawValue) ||
              String(o.label ?? o.title ?? o.name ?? "") === String(rawValue)
          );
          if (selected) {
            const label = selected.label ?? selected.title ?? selected.name;
            return label || rawValue || "—";
          }
        }
      }

      if (rawValue) return rawValue;
      if (row.answer_json != null && row.answer_json !== "") {
        try {
          const parsed =
            typeof row.answer_json === "string"
              ? JSON.parse(row.answer_json)
              : row.answer_json;
          return typeof parsed === "object"
            ? JSON.stringify(parsed)
            : String(parsed);
        } catch {
          return String(row.answer_json);
        }
      }
      return "—";
    };

    /** Baris untuk modal detail: dikelompokkan per pertanyaan, maksimal 3 jawaban pertama per kolom */
    const detailAnswerRows = computed(() => {
      const answers =
        detailRespondent.value?.survey_topic_question_answers || [];
      if (!answers.length) return [];
      const byQuestion = {};
      for (const a of answers) {
        const key = a.survey_topic_question_id ?? a.question_text ?? a.id;
        if (!byQuestion[key]) {
          byQuestion[key] = {
            key: String(key),
            question_text: a.question_text,
            question_type: a.question_type,
            question_required: a.question_required,
            items: [],
          };
        }
        byQuestion[key].items.push(a);
      }
      return Object.values(byQuestion).map((g) => {
        const firstThree = g.items.slice(0, 3);
        const qId = g.items[0]?.survey_topic_question_id;
        const fallbackOpts = questionOptionsByQuestionId.value[qId];
        return {
          key: g.key,
          question_text: g.question_text,
          question_type: g.question_type,
          question_required: g.question_required,
          jawaban1: firstThree[0]
            ? formatAnswer(firstThree[0], fallbackOpts)
            : "—",
          jawaban2: firstThree[1]
            ? formatAnswer(firstThree[1], fallbackOpts)
            : "—",
          jawaban3: firstThree[2]
            ? formatAnswer(firstThree[2], fallbackOpts)
            : "—",
        };
      });
    });

    /** Kolom pertanyaan dinamis: gabungan unique question dari semua responden (urutan pertama muncul) */
    const questionColumns = computed(() => {
      const seen = new Map();
      for (const r of records.value) {
        const list = r.survey_topic_question_answers || [];
        for (const a of list) {
          const id = a.survey_topic_question_id;
          if (id != null && !seen.has(id)) {
            seen.set(id, {
              survey_topic_question_id: id,
              question_text: a.question_text || `Pertanyaan ${id}`,
            });
          }
        }
      }
      return Array.from(seen.values());
    });

    const tableHeaders = computed(() => {
      const base = [
        { title: "#", key: "ids", align: "center", width: "auto" },
        {
          title: "Responden Id",
          key: "respondent_id",
          align: "start",
          width: "auto",
        },
      ];
      const questionHeaders = questionColumns.value.map((q) => ({
        title: q.question_text,
        key: `q_${q.survey_topic_question_id}`,
        align: "start",
        width: "auto",
      }));
      const end = [
        {
          title: "Aksi",
          key: "id",
          align: "end",
          width: "auto",
          sortable: false,
        },
      ];
      return [...base, ...questionHeaders, ...end];
    });

    const columnWidths = ref({});

    const getColumnStyle = (key) => {
      if (!key || columnWidths.value[key] == null) return {};
      const w = columnWidths.value[key];
      return { width: `${w}px`, minWidth: `${w}px`, maxWidth: `${w}px` };
    };

    const getAnswerForQuestion = (respondent, questionId) => {
      const answers = respondent.survey_topic_question_answers || [];
      const found = answers.find(
        (a) => a.survey_topic_question_id === questionId
      );
      if (!found) return "—";
      const fallbackOpts = questionOptionsByQuestionId.value[questionId];
      return formatAnswer(found, fallbackOpts);
    };

    const getAnswerRow = (respondent, questionId) => {
      const answers = respondent.survey_topic_question_answers || [];
      return (
        answers.find((a) => a.survey_topic_question_id === questionId) || null
      );
    };

    const isCheckboxChecked = (row) => {
      if (!row) return false;
      const qType = (row.question_type || "").toLowerCase();
      const v = row.answer_text;

      if (qType === "switch") {
        return v === "true" || v === true || v === "1";
      }
      if (qType === "checkbox") {
        if (v === "1" || v === "true" || v === true) return true;
        if (v === "0" || v === "false" || v === false || v === "" || v == null)
          return false;
        return Boolean(v);
      }
      return false;
    };

    const isCheckboxOrSwitchUnchecked = (row) => {
      if (!row) return false;
      const qType = (row.question_type || "").toLowerCase();
      if (qType !== "checkbox" && qType !== "switch") return false;
      const v = row.answer_text;
      return v === "false" || v === false || v === "0" || v === "" || v == null;
    };

    const addNew = () => {
      store.setRecord({});
      store.setForm({ add: true, edit: false });
    };

    const fetchRecords = async (payload = {}) => {
      const params = {
        page: payload.page ?? 1,
        itemsPerPage:
          payload.itemsPerPage ?? table.value.footer?.itemsPerPage ?? 10,
        keyWord: payload.keyWord ?? payload.keyword ?? keyWord.value ?? null,
        surveyTopicId: route.params.survey_topic_id || undefined,
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
      hydrateLocationAddressLabels();
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
        store.setSnackbar(
          result.data.message,
          colors.value.SUCCESS,
          types.value.SUCCESS
        );
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
        store.setSnackbar(
          result.data.message,
          colors.value.SUCCESS,
          types.value.SUCCESS
        );
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
          store.setSnackbar(
            "Data topik tidak ditemukan",
            colors.value.ERROR,
            types.value.ERROR
          );
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
        const qrEndpoint = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(
          surveyUrl
        )}`;
        const response = await fetch(qrEndpoint);
        if (!response.ok) throw new Error("QR request failed");
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
      } catch (err) {
        console.error("openQrModal error:", err);
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
      store.setSnackbar(
        "QR Code berhasil diunduh",
        colors.value.SUCCESS,
        types.value.SUCCESS
      );
    };

    const openLink = () => {
      if (qrMeta.value.url) window.open(qrMeta.value.url, "_blank");
    };

    const copyLink = async () => {
      if (!qrMeta.value?.url) return;
      try {
        await navigator.clipboard.writeText(qrMeta.value.url);
        store.setSnackbar(
          "Link disalin ke clipboard",
          colors.value.SUCCESS,
          types.value.SUCCESS
        );
      } catch (e) {
        store.setSnackbar(
          "Gagal menyalin link",
          colors.value.ERROR,
          types.value.ERROR
        );
      }
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
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error("Image load failed"));
        };
        img.onloadend = () => URL.revokeObjectURL(objectUrl);
        img.src = objectUrl;
      });
    };

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

    const showTopicQuestionPage = (uuid) => {
      router.push({
        name: "survey-topic-question-management",
        params: { survey_topic_id: uuid },
      });
    };

    const onSearch = debounce(() => {
      if (table.value.footer) table.value.footer.keyWord = keyWord.value;
      fetchRecords({ keyWord: keyWord.value, page: 1 });
    }, 400);

    const exportToExcel = async () => {
      try {
        const topicId = route.params.survey_topic_id;
        const params = new URLSearchParams({
          keyWord: keyWord.value || "",
        });
        const url = `api/v1/survey/survey-topic-respondents-export/${topicId}?${params.toString()}`;
        const response = await store.fetchExport(url);
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute(
          "download",
          `Responden_Topik_${new Date().getTime()}.xlsx`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
        store.setSnackbar(
          "Export berhasil",
          colors.value.SUCCESS,
          types.value.SUCCESS
        );
      } catch (error) {
        console.error("Export failed:", error);
        store.setSnackbar(
          "Export gagal",
          colors.value.ERROR,
          types.value.ERROR
        );
      }
    };

    watch(keyWord, () => onSearch());

    onMounted(() => {
      store.setPage({
        title: "Daftar Data Responden",
        subtitle: "Berikut Daftar Seluruh Data Responden Pada Aplikasi",
        breadcrumbs: [
          { name: "dashboard", title: "Dashboard" },
          { name: "survey-topic-management", title: "Topik" },
          {
            name: "survey-topic-respondent-management",
            title: "Data Responden",
          },
        ],
        actions: {
          refresh: true,
          add: false,
          edit: false,
          delete: false,
          bulkdelete: false,
          export: true,
          print: true,
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
      tableHeaders,
      columnWidths,
      getColumnStyle,
      questionColumns,
      getAnswerForQuestion,
      getAnswerRow,
      isCheckboxChecked,
      isCheckboxOrSwitchUnchecked,
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
      copyLink,
      closeQrModal,
      showQrModal,
      qrPreview,
      qrLoading,
      qrMeta,
      showDetailJawaban,
      detailRespondent,
      openDetailJawaban,
      closeDetailJawaban,
      formatAnswer,
      isLocationAnswer,
      openMapModal,
      closeMapModal,
      showMapModal,
      mapLocation,
      isFileAnswer,
      openFileViewer,
      closeFileViewer,
      showFileViewer,
      fileViewerData,
      detailAnswerRows,
      exportToExcel,
    };
  },
};
</script>
  