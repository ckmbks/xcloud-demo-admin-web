import { ECharts } from 'echarts'
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'ResizeMixin'
})
export default class extends Vue {
  @Prop({ default: 'chart' }) className!: string
  @Prop({ default: '100%' }) width!: string
  @Prop({ default: '300px' }) height!: string
  @Prop({ default: ()=>{} }) options!: any;
  @Prop({ default: true }) loading?: boolean;
  chart!: any
  sidebarElm?: Element

  public defaultOption: any = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: "rgba(48, 48, 48, 0.7)",
      borderColor: "rgba(48, 48, 48, 0)",
      textStyle: {
        color: "#fff"
      },
      axisPointer: {            
        type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    yAxis: {
      type: "value",
      axisLine:{       //y轴
        show: true
      },
      axisTick:{       //y轴刻度线
        show: true
      },
    },
    grid: {
      top: 30,
      left: 50,
      right: 20,
      bottom: 30,
    },
  }
  mounted() {
    this.initResizeEvent()
    this.initSidebarResizeEvent()
  }

  beforeDestroy() {
    this.destroyResizeEvent()
    this.destroySidebarResizeEvent()
  }

  activated() {
    this.initResizeEvent()
    this.initSidebarResizeEvent()
  }

  deactivated() {
    this.destroyResizeEvent()
    this.destroySidebarResizeEvent()
  }

  chartResizeHandler() {
    if (this.chart) {
      this.chart.resize()
    }
  }

  sidebarResizeHandler(e: TransitionEvent) {
    if (e.propertyName === 'width') {
      this.chartResizeHandler()
    }
  }

  initResizeEvent() {
    if (this.chartResizeHandler) {
      window.addEventListener('resize', this.chartResizeHandler)
    }
  }

  destroyResizeEvent() {
    if (this.chartResizeHandler) {
      window.removeEventListener('resize', this.chartResizeHandler)
    }
  }

  initSidebarResizeEvent() {
    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    if (this.sidebarElm) {
      this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler as EventListener)
    }
  }

  destroySidebarResizeEvent() {
    if (this.sidebarElm) {
      this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler as EventListener)
    }
  }
}
