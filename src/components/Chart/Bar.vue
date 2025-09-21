<template>
  <div id="chart">
    <apexchart
      type="bar"
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
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
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
  