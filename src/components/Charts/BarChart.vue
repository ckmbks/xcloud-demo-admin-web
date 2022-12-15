<template>
  <v-skeleton-loader :loading="loading" type="article,article" :height="height">
    <div :class="className" :style="{ height: height, width: width }" />
  </v-skeleton-loader>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import ResizeMixin from "@/components/Charts/mixins/resize";
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { AriaComponent } from "echarts/components";

echarts.use([
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  CanvasRenderer,
]);
echarts.use(AriaComponent);

@Component({
  name: "BarChart",
})
export default class BarCharts extends mixins(ResizeMixin) {

  mounted() {
    this.defaultOption.tooltip.axisPointer.type = "shadow"
    this.$nextTick(() => {
      this.initChart();
    });
  }

  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  }

  initChart() {
    setTimeout(() => {
      this.chart = echarts.init(this.$el as HTMLDivElement, "macarons");
      this.chart.setOption({ ...this.defaultOption, ...this.options });
    }, 800);
  }
}
</script>
