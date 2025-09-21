import { createApp } from 'vue'
import './style.css'
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

// Perbaiki ikon default Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
    iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
    shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

import 'remixicon/fonts/remixicon.css'
import VueApexCharts from "vue3-apexcharts";
import App from './App.vue'

// import router
import router from './router'

//import store management
import pinia from "./store"

const app = createApp(App)

// Load theme from localStorage before mounting
const savedTheme = localStorage.getItem('app-theme');
if (savedTheme) {
    // Theme will be loaded by the store when components mount
    console.log('Loading saved theme:', savedTheme);
}

app.use(router).use(pinia).use(VueApexCharts).mount('#app')
