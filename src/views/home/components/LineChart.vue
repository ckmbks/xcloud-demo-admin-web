<template>
  <v-card flat class="pa-4">
    <v-card-title class="px-2 py-0">
      <h4 class="module-title">瞎溜溜</h4>
    </v-card-title>
    <div>
      <lineChart
        :options="options"
      ></lineChart>
    </div>
  </v-card>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import lineChart from "@/components/Charts/LineChart.vue";

@Component({
  components: {
    lineChart,
  },
})
export default class LineChart extends Vue {
  public $refs: any;
  options: any = null;

  async created() {
    this.initChart();
  }

  initChart() {
    this.options = {
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: "line",
          smooth: true,
          itemStyle: {
            normal: {
              color: "#ffb317",
            },
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#ffb317", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fdfbf7", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
    };
  }
}
</script>
<style lang="scss" scoped>
</style>
