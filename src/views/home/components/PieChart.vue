<template>
  <v-card flat class="pa-4">
    <v-card-title class="px-2 py-0">
      <h4 class="module-title">瞎转转</h4>
    </v-card-title>
    <div>
      <pieChart :options="options"></pieChart>
    </div>
  </v-card>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import pieChart from "@/components/Charts/PieChart.vue";

@Component({
  components: {
    pieChart,
  },
})
export default class PieChart extends Vue {
  public $refs: any;
  options: any = null;

  async created() {
    this.initChart();
  }

  initChart() {
    this.options = {
      legend: {
        top: 'left'
      },
      series: [
        {
          name: "面积模式",
          type: "pie",
          radius: [20, 90],
          center: ["50%", "50%"],
          roseType: "radius",
          itemStyle: {
            borderRadius: 8,
          },
          color: ["#4464c3","#8ad069","#fac858","#ee6667","#5db7da","#35a56a","#ef7943","#995ab5"],
          data: [
            { value: 40, name: "rose 1" },
            { value: 38, name: "rose 2" },
            { value: 32, name: "rose 3" },
            { value: 30, name: "rose 4" },
            { value: 28, name: "rose 5" },
            { value: 26, name: "rose 6" },
            { value: 22, name: "rose 7" },
            { value: 18, name: "rose 8" },
          ],
        },
      ],
    };
  }
}
</script>
<style lang="scss" scoped>
</style>
