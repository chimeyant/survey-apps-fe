<template>
  <div class="min-h-[300px] w-full">
    <div class="w-full h-[400px] border border-gray-300 rounded-lg overflow-hidden">
      <l-map
        ref="map"
        style="height: 100%; width: 100%;"
        :zoom="mapZoom"
        :center="mapCenter"
        :key="mapKey"
      >
        <!-- Default OpenStreetMap Layer -->
        <l-tile-layer
          :name="layers.openstreetmap.name"
          :url="layers.openstreetmap.url"
          :attribution="layers.openstreetmap.attribution"
          layer-type="base"
        />

        <!-- Additional Layers -->
        <l-tile-layer
          v-for="layerKey in additionalLayers"
          :key="layerKey"
          v-if="layers[layerKey]"
          :name="layers[layerKey].name"
          :url="layers[layerKey].url"
          :attribution="layers[layerKey].attribution"
          layer-type="base"
        />

        <!-- Layer Control - Show if there are additional layers -->
        <l-control-layers
          v-if="showLayerControl && additionalLayers.length > 0"
          :position="layerControlPosition"
          :collapsed="layerControlCollapsed"
        />

        <!-- Single marker from latitude/longitude props -->
        <l-marker
          v-if="singleMarker && !hasMarkers"
          :lat-lng="singleMarker"
        ></l-marker>

        <!-- Always show markers -->
        <l-marker
          v-if="markers.length > 0 "
          v-for="(marker, index) in markers"
          :key="`marker-${index}`"
          :lat-lng="marker.latLng"
          :title="marker.title"
        >
          <l-popup>
            <div v-html="marker.popup">
            </div>
          </l-popup>
        </l-marker>

        <!-- Default marker when no markers provided -->
        <l-marker
          v-if="showDefaultMarker && !hasMarkers && !singleMarker"
          :lat-lng="defaultMarker.latLng"
          :title="defaultMarker.title"
        >
          <l-popup v-if="defaultMarker.popup">
            <div v-html="defaultMarker.popup"></div>
          </l-popup>
        </l-marker>
      </l-map>
    </div>
  </div>
</template>
  
<script>
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LControlLayers,
} from "@vue-leaflet/vue-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LControlLayers,
  },
  data() {
    return {
      layers: {
        openstreetmap: {
          name: "OpenStreetMap",
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        },
        satellite: {
          name: "Satellite",
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
        },
        terrain: {
          name: "Terrain",
          url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
          attribution:
            '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a>',
        },
        dark: {
          name: "Dark",
          url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        },
        watercolor: {
          name: "Watercolor",
          url: "https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg",
          attribution: '&copy; <a href="https://stamen.com/">Stamen Design</a>',
        },
        toner: {
          name: "Toner",
          url: "https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png",
          attribution: '&copy; <a href="https://stamen.com/">Stamen Design</a>',
        },
      },
      mapsarray1: [-6.1725, 106.6267],
      mapsarray2: [-6.1825, 106.6367],
      mapsarray3: [-6.1625, 106.6167],
      markers2: [
        {
          latLng: [-6.1725, 106.6267],
          title: "Kantor Dinas Komunikasi Dan Informatika Kab. Tangerang",
          popup: "Kantor Dinas Komunikasi Dan Informatika Kab. Tangerang",
        },
        {
          latLng: [-6.1825, 106.6367],
          title: "Kantor Dinas Komunikasi Dan Informatika Kab. Tangerang",
          popup: "Kantor Dinas Komunikasi Dan Informatika Kab. Tangerang",
        },
      ],
      mapKey: 0,
    };
  },
  mounted() {
    // Simple icon setup - just fix the default icon issue
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });

    // Debug logging
    console.log("Map component mounted");
    console.log("Available layers:", this.availableLayers);
    console.log("Additional layers:", this.additionalLayers);
    console.log("Show layer control:", this.showLayerControl);
    console.log("Map center:", this.mapCenter);
    console.log("Map zoom:", this.mapZoom);
    console.log("Markers:", this.markers);
  },
  props: {
    latitude: {
      type: [String, Number],
      default: null,
    },
    longitude: {
      type: [String, Number],
      default: null,
    },
    markers: {
      type: Array,
      default: () => [],
    },
    showDefaultMarker: {
      type: Boolean,
      default: true,
    },
    defaultMarker: {
      type: Object,
      default: () => ({
        latLng: [-6.1725, 106.6267],
        title: "Kantor Dinas Komunikasi Dan Informatika Kab. Tangerang",
        popup: "Kantor Dinas Komunikasi Dan Informatika Kab. Tangerang",
        icon: "/images/marker-icon.png",
      }),
    },
    zoom: {
      type: Number,
      default: 13,
    },
    center: {
      type: Array,
      default: () => [-6.1725, 106.6267],
    },
    showLayerControl: {
      type: Boolean,
      default: true,
    },
    layerControlPosition: {
      type: String,
      default: "topright",
    },
    layerControlCollapsed: {
      type: Boolean,
      default: true,
    },
    availableLayers: {
      type: Array,
      default: () => ["openstreetmap", "terrain", "satellite", "dark"],
    },
  },
  watch: {
    markers: {
      handler(newMarkers, oldMarkers) {
        // Markers updated
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    // Check if markers array has items
    hasMarkers() {
      return this.markers && this.markers.length > 0;
    },

    // Single marker coordinates from props
    singleMarker() {
      if (this.latitude && this.longitude) {
        const lat = parseFloat(this.latitude);
        const lng = parseFloat(this.longitude);

        // Validate coordinates are not NaN
        if (!isNaN(lat) && !isNaN(lng)) {
          return [lat, lng];
        }
      }
      return null;
    },

    // Map center - use markers center or single marker or default marker or center prop
    mapCenter() {
      if (this.hasMarkers) {
        // Calculate center from markers
        const lats = this.markers.map((m) => (m.latLng ? m.latLng[0] : m.lat));
        const lngs = this.markers.map((m) => (m.latLng ? m.latLng[1] : m.lng));

        const avgLat = lats.reduce((sum, lat) => sum + lat, 0) / lats.length;
        const avgLng = lngs.reduce((sum, lng) => sum + lng, 0) / lngs.length;

        // Validate coordinates are not NaN
        if (!isNaN(avgLat) && !isNaN(avgLng)) {
          return [avgLat, avgLng];
        }
      } else if (this.singleMarker) {
        return this.singleMarker;
      } else if (this.showDefaultMarker && this.defaultMarker) {
        return this.defaultMarker.latLng;
      }
      return this.center;
    },

    // Map zoom level
    mapZoom() {
      if (this.hasMarkers && this.markers.length > 1) {
        // Auto-adjust zoom for multiple markers
        return Math.max(10, this.zoom - 2);
      }
      return this.zoom;
    },

    // Additional layers (excluding openstreetmap which is always shown)
    additionalLayers() {
      return this.availableLayers.filter((layer) => layer !== "openstreetmap");
    },

    // Check if markers2 has items
    hasMarkers2() {
      return this.markers2 && this.markers2.length > 0;
    },
  },
  methods: {
    getMarkerCoordinates(marker) {
      let coordinates;

      // Try different coordinate formats
      if (marker.latLng && Array.isArray(marker.latLng)) {
        coordinates = marker.latLng;
      } else if (marker.lat && marker.lng) {
        coordinates = [Number(marker.lat), Number(marker.lng)];
      } else if (marker.latitude && marker.longitude) {
        coordinates = [Number(marker.latitude), Number(marker.longitude)];
      } else if (marker.coordinates && Array.isArray(marker.coordinates)) {
        coordinates = marker.coordinates;
      } else if (marker.position && Array.isArray(marker.position)) {
        coordinates = marker.position;
      } else {
        coordinates = [-6.1725, 106.6267]; // fallback
      }

      // Ensure coordinates are numbers
      if (Array.isArray(coordinates) && coordinates.length >= 2) {
        coordinates = [Number(coordinates[0]), Number(coordinates[1])];
      }

      // Validate coordinates
      if (!Array.isArray(coordinates) || coordinates.length !== 2) {
        coordinates = [-6.1725, 106.6267];
      }

      if (isNaN(coordinates[0]) || isNaN(coordinates[1])) {
        coordinates = [-6.1725, 106.6267];
      }

      return coordinates;
    },

    getMarkerOptions(marker) {
      // Always return empty options to use default Leaflet markers
      return {};
    },

    // Get available layer names for debugging
    getAvailableLayerNames() {
      return this.availableLayers
        .map((key) => this.layers[key]?.name)
        .filter(Boolean);
    },
  },
};
</script>
  
<style>
/* Tidak diperlukan tambahan jika Leaflet CSS sudah diimpor */
</style>
  