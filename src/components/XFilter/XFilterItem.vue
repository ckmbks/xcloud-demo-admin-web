<template>
  <div class="xf_item" :data-width="relWidth" :style="fiStyle">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component({
  components: {}
})
export default class XFilterItem extends Vue {
  @Prop({
    default: 200
  })
  width?: any

  get relWidth() {
    const width = this.width
    let relW
    if (!isNaN(Number(width))) {
      relW = Number(width)
    } else {
      relW = 200
    }
    return relW
  }

  get fiStyle() {
    const style: any = {
      width: this.relWidth + 'px'
    }
    return style
  }
}
</script>

<style lang="scss" scoped>
.xf_item {
  //flex-shrink: 1;
  padding-right: 12px;
  padding-bottom: 12px;
}
</style>
