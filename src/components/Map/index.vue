<template>
  <div class="min-h-[300px]">

    <l-map
      style="height: 400px; width: 100%;"
      :zoom="13"
      :center="[51.505, -0.09]"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      <l-marker :lat-lng="[51.505, -0.09]"></l-marker>
    </l-map>
  </div>
</template>
  
  <script>
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
};
</script>
  
  <style>
/* Tidak diperlukan tambahan jika Leaflet CSS sudah diimpor */
</style>
  