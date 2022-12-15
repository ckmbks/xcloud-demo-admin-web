<template>
  <v-card flat class="pa-4">
    <v-card-title class="px-2 py-0">
      <h4 class="module-title">瞎看看</h4>
    </v-card-title>
    <div>
      <barChart
        :options="options"
      ></barChart>
    </div>
  </v-card>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import barChart from "@/components/Charts/BarChart.vue";

@Component({
  components: {
    barChart,
  },
})
export default class BarChart extends Vue {
  public $refs: any;
  options: any = null;

  async created() {
    this.initChart()
  }

  initChart() {
    this.options = {
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: "bar",
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
          },
          itemStyle: {
            color: "#45a2f7",
            borderRadius: [20, 20, 0, 0]
          }
        },
      ],
    };
  }
}
</script>
<style lang="scss" scoped>

</style>
