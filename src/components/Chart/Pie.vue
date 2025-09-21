<template>
  <div>
    <apexchart
      type="pie"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>
  
  <script>
import { ref, watch } from "vue";

export default {
  props: {
    labels: {
      type: Array,
      default: ["ASN AKTIF", "PENSIUN", "NON ASN"],
    },
    datas: {
      type: Array,
      default: [100, 200, 300],
    },
  },
  setup(props, { emit }) {
    const series = ref(props.datas);

    watch(
      () => props.datas,
      (newVal) => {
        series.value = newVal;
      }
    );

    const chartOptions = {
      chart: {
        width: 300,
        type: "pie",
      },
      labels: props.labels,
      legend: {
        position: "top",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: "100%",
            },
            legend: {
              position: "top",
              show: false,
            },
          },
        },
      ],
    };

    return {
      series,
      chartOptions,
    };
  },
};
</script>
  