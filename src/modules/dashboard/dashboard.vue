<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Header: welcome + year -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500">Selamat datang kembali</p>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
          {{ user?.name || 'Pengguna' }}
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

    <!-- Stats -->
    <section>
      <h2 class="sr-only">Ringkasan survey</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <!-- Card Total Survey -->
        <div class="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-gray-200/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/15 hover:border-cyan-100 hover:-translate-y-0.5">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-cyan-600 opacity-90 rounded-t-2xl"></div>
          <div class="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl group-hover:bg-cyan-400/20 transition-colors"></div>
          <div class="relative flex items-start justify-between gap-4">
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-500">Total Survey</p>
              <p class="mt-2 text-3xl font-bold tabular-nums tracking-tight text-gray-900">
                {{ formatNumber(dashboard.totalSurvey) }}
              </p>
              <p class="mt-1 text-xs text-gray-400">Survei tercatat</p>
            </div>
            <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30 ring-4 ring-cyan-100">
              <i class="ri-survey-line text-2xl"></i>
            </span>
          </div>
        </div>
        <!-- Card Total Responden -->
        <div class="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-gray-200/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/15 hover:border-indigo-100 hover:-translate-y-0.5">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-indigo-600 opacity-90 rounded-t-2xl"></div>
          <div class="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-400/10 blur-2xl group-hover:bg-indigo-400/20 transition-colors"></div>
          <div class="relative flex items-start justify-between gap-4">
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-500">Total Responden</p>
              <p class="mt-2 text-3xl font-bold tabular-nums tracking-tight text-gray-900">
                {{ formatNumber(dashboard.totalResponden) }}
              </p>
              <p class="mt-1 text-xs text-gray-400">Orang mengisi survei</p>
            </div>
            <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-100">
              <i class="ri-group-line text-2xl"></i>
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Map section -->
    <section class="rounded-2xl border border-gray-100 bg-white shadow-sm shadow-gray-200/50 overflow-hidden">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 sm:px-6 sm:py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 via-cyan-50/40 to-indigo-50/30">
        <div class="flex items-center gap-3">
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-500 text-white shadow-md shadow-cyan-500/25 ring-2 ring-white">
            <i class="ri-map-pin-2-line text-xl"></i>
          </span>
          <div>
            <h3 class="font-semibold text-gray-900">Peta Sebaran Responden</h3>
            <p class="text-xs text-gray-500 mt-0.5">Lokasi responden berdasarkan koordinat survey</p>
          </div>
        </div>
      </div>
      <div class="p-5 sm:p-6">
        <div class="rounded-xl border border-gray-100 overflow-hidden min-h-[380px] sm:min-h-[420px] shadow-inner bg-gray-50/50">
          <UMap
            :markers="markers"
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
    const markerIcon = ref("/images/marker-icon.png");
    const markers = ref([]);

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
          markers.value = result.data.data.map((item) => ({
            latLng: [Number(item.latitude), Number(item.longitude)],
            title: item.survey_name || "Survey Location",
            popup: buildPopupContent(item),
            icon: markerIcon.value,
          }));
        } else {
          markers.value = [];
        }
      } catch (e) {
        console.error("Error fetching sebaran responden:", e);
        markers.value = [];
      }
    };

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
      formatNumber,
    };
  },
};
</script>
