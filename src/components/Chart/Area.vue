<template>
  <div id="chart">
    <apexchart
      type="area"
      height="350"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>
    
  <script>
export default {
  setup() {
    const series = [
      {
        name: "Laki-laki",
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
      {
        name: "Perempuan",
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
    ];

    const chartOptions = {
      chart: {
        type: "area",
        height: 350,
      },

      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Ags",
          "Sep",
          "OKt",
          "Nop",
          "Des",
        ],
      },
      yaxis: {
        title: {
          text: "Jml. Kerugian (Rp)",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return " " + val + " Permohonan";
          },
        },
      },
    };
    return {
      series,
      chartOptions,
    };
  },
};
</script>
    