<template>
  <div>
    <div class="flex justify-between">
      <div class="">
        <span class=" font-bold text-gray-600">Wellcome Back, </span><span>Ujang Selamat</span>
      </div>
      <div class="flex justify-items-end w-60 h-10">
        <u-combo-box
          class="min"
          :items="tahuns"
        />
      </div>
    </div>
    <div class="grid grid-cols-12 gap-2 mt-10">
      <div class="col-span-12 lg:col-span-6">
        <card-one icon="ri-megaphone-line" title="Total Survey" :value="dashboard.totalSurvey" />
      </div>
      <div class="col-span-12 lg:col-span-6">
        <card-one icon="ri-group-3-fill" title="Total Responden" :value="dashboard.totalResponden" />
      </div>
     

    </div>

    <div class="grid grid-cols-12 gap-2 mt-10">
      <!-- Char Area -->
      <div v-if="false" class="col-span-12 lg:col-span-8">
        <bar-chart />
      </div>
      <div v-if="false" class="col-span-12 lg:col-span-4">
        <pie-chart />
      </div>
      <div v-if="false" class="col-span-12 lg:col-span-6">
        <area-chart />
      </div>
      <div v-if="false" class="col-span-12 lg:col-span-6">
        <card-four />
      </div>
      <div class="col-span-12">
        <div class="flex justify-between py-5">
          <h3 class="font-bold text-gray-600">Peta Sebaran Responden</h3>
        </div>
        <u-map :markers="markers"  :show-layer-control="true" />
      </div>
    </div>
  </div>
</template>

<script>
import { useAppStore } from "@/store/app";
import { computed, onMounted, ref } from "vue";
import {
  UComboBox,
  BarChart,
  PieChart,
  AreaChart,
  CardOne,
  CardTwo,
  CardThree,
  CardFour,
  UMap,
} from "../../components";

export default {
  components: {
    BarChart,
    UComboBox,
    PieChart,
    AreaChart,
    CardOne,
    CardTwo,
    CardThree,
    CardFour,
    UMap,
  },
  setup() {
    const store = useAppStore();
    const page = computed(() => store.page);
    const user = computed(() => store.user);
    const tahuns = ref([
      {
        title: 2025,
        value: 2025,
      },
    ]);
    const map = ref(0);
    const dashboard = ref({
      totalSurvey: 0,
      totalResponden: 0,
    });
    const markerIcon = ref("/images/marker-icon.png");
    const defaultMarker = ref({
      latLng: [-6.1725, 106.6267],
      title: "Kantor Dinas Komunikasi Dan Informatika Kab. Tangerang",
      popup: "Kantor Dinas Komunikasi Dan Informatika Kab. Tangerang",
      icon: markerIcon.value,
    });
    const markers = ref([])

    const fetchDashboard = async () => {
      const result = await store.showRecord("api/v1/survey/dashboard",true)

      dashboard.value.totalSurvey = result.total_survey;
      dashboard.value.totalResponden = result.total_responden;
    };

    const fetchSebaranResponden = async () => {
      map.value++;
      try {
        const result = await store.fetchRecords("api/v1/survey/dashboard/sebaran-responden",{},true)
        
        if (result.data && result.data.data && Array.isArray(result.data.data)) {
          markers.value = result.data.data.map(item => ({
            latLng: [Number(item.latitude), Number(item.longitude)],
            title: item.survey_name || 'Survey Location',
            popup: `<div>
              <div>
                <div class="font-bold">${item.survey_name}</div>
                <div class="text-gray-500">${item.address}</div>
                <div class="text-gray-500">${item.surveyor_name}</div>
                <div class="text-gray-500 flex items-center gap-1">
                  <span>${item.phone}</span>
                  ${
                    item.phone
                      ? `<a href="https://wa.me/${item.phone.replace(/[^0-9]/g, '')}" target="_blank" rel="noopener noreferrer" title="Chat via WhatsApp">
                          <i class="ri-whatsapp-line"></i>
                        </a>`
                      : ''
                  }
                </div>
                <div>Lampiran</div>
              </div>
              <div class="flex flex-col gap-2 mt-2">
                <!-- Tiga card kecil di bawah -->
                <div class="flex justify-between gap-2">
                  ${
                    (Array.isArray(item.attachments) ? item.attachments.slice(0, 3) : []).map((att, idx) => `
                      <div class="w-1/8 bg-white rounded shadow p-2 flex flex-col items-center" key="${idx}">
                        <div class="w-20 h-20 flex items-center justify-center bg-gray-100 rounded">
                          <img 
                            src="${att.path}" 
                            alt="Lampiran ${idx + 1}" 
                            class="object-contain h-40 cursor-zoom-in"
                            onclick="event.stopPropagation(); window.open('${att.path}', '_blank', 'toolbar=0,location=0,menubar=0,width=800,height=600');"
                          />
                        </div>
                      </div>
                    `).join('')
                  }
                </div>
                  
                </div>
              </div>

            </div>`,
            icon: markerIcon.value,
          }));
        } else {
          markers.value = [];
        }
        
        map.value++;
      } catch (error) {
        console.error('Error fetching sebaran responden:', error);
        markers.value = [];
      }
    };

    onMounted(() => {
      store.setPage({
        title: "Dashboard",
        subtitle: "Berikut Daftar Seluruh Pengguna Aplikasi ",
        breadcrumbs: [
          {
            name: "dashboard",
            title: "Dashboard",
          },
        ],
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
      tahuns,
      dashboard,
      markers,
      defaultMarker,
      map
    };
  },
};
</script>