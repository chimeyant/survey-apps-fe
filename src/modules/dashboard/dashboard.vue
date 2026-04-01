<template>
  <div class="space-y-6 sm:space-y-8">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500">Selamat datang kembali</p>
        <h1 class="mt-0.5 text-xl font-bold text-gray-900 sm:text-2xl">
          {{ user?.name || "Pengguna" }}
        </h1>
      </div>
      <div class="w-full sm:w-40">
        <UComboBox
          v-model="selectedTahun"
          :items="tahuns"
          label-key="title"
          value-key="value"
          placeholder="Tahun"
          class="min"
        />
      </div>
    </div>

    <section class="grid grid-cols-1 gap-5 md:grid-cols-3">
      <div class="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-gray-200/50 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-100 hover:shadow-lg hover:shadow-cyan-500/15">
        <div class="absolute left-0 right-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-cyan-400 to-cyan-600 opacity-90"></div>
        <div class="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl transition-colors group-hover:bg-cyan-400/20"></div>
        <div class="relative flex items-start justify-between gap-4">
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-gray-500">Total Topik</p>
            <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 tabular-nums">
              {{ formatNumber(dashboard.totalSurvey) }}
            </p>
            <p class="mt-1 text-xs text-gray-400">Topik survey aktif & historis</p>
          </div>
          <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30 ring-4 ring-cyan-100">
            <i class="ri-survey-line text-2xl"></i>
          </span>
        </div>
      </div>

      <div class="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-gray-200/50 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/15">
        <div class="absolute left-0 right-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-indigo-400 to-indigo-600 opacity-90"></div>
        <div class="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-400/10 blur-2xl transition-colors group-hover:bg-indigo-400/20"></div>
        <div class="relative flex items-start justify-between gap-4">
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-gray-500">Total Responden</p>
            <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 tabular-nums">
              {{ formatNumber(dashboard.totalResponden) }}
            </p>
            <p class="mt-1 text-xs text-gray-400">Data responden yang masuk</p>
          </div>
          <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-100">
            <i class="ri-group-line text-2xl"></i>
          </span>
        </div>
      </div>

      <div class="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-gray-200/50 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-100 hover:shadow-lg hover:shadow-emerald-500/15">
        <div class="absolute left-0 right-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-90"></div>
        <div class="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl transition-colors group-hover:bg-emerald-400/20"></div>
        <div class="relative flex items-start justify-between gap-4">
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-gray-500">Rata-rata / Topik</p>
            <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 tabular-nums">
              {{ averageRespondentPerTopic }}
            </p>
            <p class="mt-1 text-xs text-gray-400">Distribusi responden per topik</p>
          </div>
          <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-100">
            <i class="ri-bar-chart-grouped-line text-2xl"></i>
          </span>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 gap-5 lg:grid-cols-12">
      <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm shadow-gray-200/50 lg:col-span-8">
        <div class="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-gray-50 via-cyan-50/40 to-indigo-50/30 px-5 py-4 sm:px-6">
          <div class="flex items-center gap-3">
            <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-500 text-white shadow-md shadow-cyan-500/25 ring-2 ring-white">
              <i class="ri-bar-chart-box-line text-xl"></i>
            </span>
            <div>
              <h3 class="font-semibold text-gray-900">Responden per Topik</h3>
              <p class="mt-0.5 text-xs text-gray-500">Topik dengan responden terbanyak</p>
            </div>
          </div>
        </div>
        <div class="space-y-4 p-5 sm:p-6">
          <div
            v-for="item in topicStatsTopFive"
            :key="item.topic"
            class="space-y-1.5"
          >
            <div class="flex items-center justify-between gap-3">
              <p class="truncate text-sm font-medium text-gray-700">{{ item.topic }}</p>
              <p class="text-sm font-semibold text-indigo-600">{{ formatNumber(item.total) }}</p>
            </div>
            <div class="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                class="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 transition-all duration-500"
                :style="{ width: `${item.percentage}%` }"
              ></div>
            </div>
          </div>
          <div
            v-if="!topicStatsTopFive.length"
            class="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-8 text-center text-sm text-gray-500"
          >
            Belum ada data responden untuk ditampilkan.
          </div>
        </div>
      </div>

      <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm shadow-gray-200/50 lg:col-span-4">
        <div class="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-emerald-50/40 px-5 py-4 sm:px-6">
          <h3 class="font-semibold text-gray-900">Highlight</h3>
          <p class="mt-0.5 text-xs text-gray-500">Ringkasan performa data</p>
        </div>
        <div class="space-y-4 p-5 sm:p-6">
          <div class="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-emerald-700">Topik Teratas</p>
            <p class="mt-1 truncate text-sm font-semibold text-emerald-900">{{ bestTopicName }}</p>
            <p class="mt-1 text-xs text-emerald-700">{{ formatNumber(bestTopicTotal) }} responden</p>
          </div>
          <div class="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-indigo-700">Sebaran Marker</p>
            <p class="mt-1 text-sm font-semibold text-indigo-900">{{ formatNumber(markers.length) }} titik lokasi</p>
            <p class="mt-1 text-xs text-indigo-700">Data dari survey yang punya koordinat</p>
          </div>
          <div class="rounded-xl border border-cyan-100 bg-cyan-50/60 p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-cyan-700">Coverage</p>
            <p class="mt-1 text-sm font-semibold text-cyan-900">
              {{ formatNumber(topicStats.length) }} topik memiliki responden
            </p>
            <p class="mt-1 text-xs text-cyan-700">Dibanding total {{ formatNumber(dashboard.totalSurvey) }} topik</p>
          </div>
        </div>
      </div>
    </section>

    <section class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm shadow-gray-200/50">
      <div class="flex flex-col gap-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 via-cyan-50/40 to-indigo-50/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div class="flex items-center gap-3">
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-500 text-white shadow-md shadow-cyan-500/25 ring-2 ring-white">
            <i class="ri-map-pin-2-line text-xl"></i>
          </span>
          <div>
            <h3 class="font-semibold text-gray-900">Peta Sebaran Responden</h3>
            <p class="mt-0.5 text-xs text-gray-500">Lokasi responden berdasarkan koordinat survey</p>
          </div>
        </div>
        <div class="w-full sm:w-72">
          <UComboBox
            v-model="selectedMapTopic"
            :items="mapTopicOptions"
            label-key="title"
            value-key="value"
            placeholder="Pilih topik untuk peta"
          />
        </div>
      </div>
      <div class="p-5 sm:p-6">
        <div
          v-if="!selectedMapTopic"
          class="flex min-h-[380px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/70 px-4 text-center sm:min-h-[420px]"
        >
          <div>
            <p class="text-sm font-semibold text-gray-700">Pilih topik terlebih dahulu</p>
            <p class="mt-1 text-xs text-gray-500">
              Hanya topik yang memiliki koordinat lokasi yang tersedia pada opsi.
            </p>
          </div>
        </div>
        <div
          v-else
          class="min-h-[380px] overflow-hidden rounded-xl border border-gray-100 bg-gray-50/50 shadow-inner sm:min-h-[420px]"
        >
          <UMap
            :markers="filteredMarkers"
            :show-layer-control="true"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { useAppStore } from "@/store/app";
import { computed, onMounted, ref } from "vue";
import { UComboBox, UMap } from "@/components";

export default {
  name: "DashboardModule",
  components: {
    UComboBox,
    UMap,
  },
  setup() {
    const store = useAppStore();
    const user = computed(() => store.user);
    const selectedTahun = ref(2025);
    const tahuns = ref([
      { title: "2025", value: 2025 },
      { title: "2024", value: 2024 },
      { title: "2023", value: 2023 },
    ]);
    const dashboard = ref({
      totalSurvey: 0,
      totalResponden: 0,
    });
    const selectedMapTopic = ref("");
    const markerIcon = ref("/images/marker-icon.png");
    const markers = ref([]);
    const sebaranRows = ref([]);

    const formatNumber = (n) => {
      const num = Number(n);
      if (Number.isNaN(num)) return "0";
      return new Intl.NumberFormat("id-ID").format(num);
    };

    const fetchDashboard = async () => {
      try {
        const result = await store.showRecord("api/v1/survey/dashboard", true);
        if (result) {
          dashboard.value.totalSurvey = result.total_survey ?? 0;
          dashboard.value.totalResponden = result.total_responden ?? 0;
        }
      } catch (_) {
        dashboard.value = { totalSurvey: 0, totalResponden: 0 };
      }
    };

    const fetchSebaranResponden = async () => {
      try {
        const result = await store.fetchRecords(
          "api/v1/survey/dashboard/sebaran-responden",
          {},
          true
        );
        if (result?.data?.data && Array.isArray(result.data.data)) {
          sebaranRows.value = result.data.data;
          markers.value = result.data.data.map((item) => ({
            latLng: [Number(item.latitude), Number(item.longitude)],
            title: item.survey_name || "Survey Location",
            popup: buildPopupContent(item),
            icon: markerIcon.value,
          }));
          if (
            selectedMapTopic.value &&
            !result.data.data.some(
              (item) => (item?.survey_name || "Tanpa Topik") === selectedMapTopic.value
            )
          ) {
            selectedMapTopic.value = "";
          }
        } else {
          sebaranRows.value = [];
          markers.value = [];
          selectedMapTopic.value = "";
        }
      } catch (e) {
        console.error("Error fetching sebaran responden:", e);
        sebaranRows.value = [];
        markers.value = [];
        selectedMapTopic.value = "";
      }
    };

    const isValidCoord = (row) => {
      const lat = Number(row?.latitude);
      const lng = Number(row?.longitude);
      return !Number.isNaN(lat) && !Number.isNaN(lng) && lat !== 0 && lng !== 0;
    };

    const mapTopicOptions = computed(() => {
      const uniq = new Set();
      for (const row of sebaranRows.value) {
        if (!isValidCoord(row)) continue;
        uniq.add((row?.survey_name || "Tanpa Topik").trim() || "Tanpa Topik");
      }
      return Array.from(uniq)
        .sort((a, b) => a.localeCompare(b, "id"))
        .map((name) => ({
          title: name,
          value: name,
        }));
    });

    const filteredMarkers = computed(() => {
      if (!selectedMapTopic.value) return [];
      return markers.value.filter((m) => m.title === selectedMapTopic.value);
    });

    const topicStats = computed(() => {
      const map = {};
      for (const row of sebaranRows.value) {
        const key = (row?.survey_name || "Tanpa Topik").trim() || "Tanpa Topik";
        map[key] = (map[key] || 0) + 1;
      }
      return Object.entries(map)
        .map(([topic, total]) => ({ topic, total }))
        .sort((a, b) => b.total - a.total);
    });

    const maxTopicTotal = computed(() => {
      return topicStats.value.length ? topicStats.value[0].total : 0;
    });

    const topicStatsTopFive = computed(() => {
      const max = maxTopicTotal.value || 1;
      return topicStats.value.slice(0, 5).map((item) => ({
        ...item,
        percentage: Math.max(8, Math.round((item.total / max) * 100)),
      }));
    });

    const averageRespondentPerTopic = computed(() => {
      const totalTopik = Number(dashboard.value.totalSurvey || 0);
      const totalResponden = Number(dashboard.value.totalResponden || 0);
      if (!totalTopik) return "0";
      return (totalResponden / totalTopik).toFixed(1);
    });

    const bestTopicName = computed(() => {
      return topicStats.value[0]?.topic || "Belum ada data";
    });

    const bestTopicTotal = computed(() => {
      return topicStats.value[0]?.total || 0;
    });

    function buildPopupContent(item) {
      const phone = item.phone || "";
      const phoneClean = phone.replace(/[^0-9]/g, "");
      const waLink = phoneClean ? `https://wa.me/${phoneClean}` : "#";
      const atts = Array.isArray(item.attachments)
        ? item.attachments.slice(0, 3)
        : [];
      const attsHtml = atts
        .map(
          (att, idx) => `
        <div class="w-20 flex-shrink-0 rounded bg-gray-100 p-1">
          <img
            src="${att.path}"
            alt="Lampiran ${idx + 1}"
            class="h-20 w-full object-contain cursor-pointer rounded"
            onclick="event.stopPropagation(); window.open('${
              att.path
            }', '_blank', 'width=800,height=600');"
          />
        </div>
      `
        )
        .join("");

      return `
        <div class="min-w-[200px] text-sm">
          <div class="font-semibold text-gray-900">${
            item.survey_name || "—"
          }</div>
          ${
            item.address
              ? `<div class="text-gray-500 mt-1">${item.address}</div>`
              : ""
          }
          ${
            item.surveyor_name
              ? `<div class="text-gray-500 mt-0.5">${item.surveyor_name}</div>`
              : ""
          }
          ${
            phone
              ? `<div class="mt-1 flex items-center gap-1">
            <span class="text-gray-600">${phone}</span>
            <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="text-green-600 hover:text-green-700" title="Chat WhatsApp">
              <i class="ri-whatsapp-line text-lg"></i>
            </a>
          </div>`
              : ""
          }
          ${
            atts.length
              ? `<div class="mt-2 font-medium text-gray-600">Lampiran</div><div class="flex gap-2 mt-1 flex-wrap">${attsHtml}</div>`
              : ""
          }
        </div>
      `;
    }

    onMounted(() => {
      store.setPage({
        title: "Dashboard",
        subtitle: "Ringkasan data survey dan sebaran responden",
        breadcrumbs: [{ name: "dashboard", title: "Dashboard" }],
        dataUrl: "api/v1/utility/users",
        actions: {
          refresh: false,
          add: false,
          edit: false,
          delete: false,
          bulkdelete: false,
          export: true,
          print: false,
          help: false,
          close: false,
        },
        showtable: false,
      });
      fetchDashboard();
      fetchSebaranResponden();
    });

    return {
      user,
      selectedTahun,
      tahuns,
      dashboard,
      markers,
      filteredMarkers,
      selectedMapTopic,
      mapTopicOptions,
      formatNumber,
      topicStats,
      topicStatsTopFive,
      averageRespondentPerTopic,
      bestTopicName,
      bestTopicTotal,
    };
  },
};
</script>
