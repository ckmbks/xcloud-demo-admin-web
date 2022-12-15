<template>
  <div>
    <template v-for="(item, index) in data">
      <div :style="splitStyle" :key="'split' + index" v-if="index"></div>
      <v-row class="flex-nowrap">
        <div
          :style="labelStyle"
          v-text="item.label"
          :class="{ colon: colon }"
          class="flex-shrink-0"
        />
        <v-spacer v-text="item.value" class="ml-2" />
      </v-row>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

export enum SplitType {
  // eslint-disable-next-line no-unused-vars
  SPACE = '',
  // eslint-disable-next-line no-unused-vars
  DASHED = 'dashed',
  // eslint-disable-next-line no-unused-vars
  SOLID = 'solid'
}
@Component({})
export default class VDetail extends Vue {
  @Prop({ default: 'right' })
  labelAlign!: String

  @Prop({ default: 100 })
  labelWidth!: number

  @Prop({ default: 20 })
  rowGutter!: number

  @Prop({ default: SplitType.SPACE })
  splitType!: SplitType

  @Prop({ default: 400 })
  labelWeight!: number

  @Prop({ default: () => [] })
  data!: Array<{ label: string; value: any }>

  @Prop({ default: true })
  colon!: boolean

  get splitStyle() {
    const { rowGutter, splitType } = this
    const half = rowGutter / 2
    const commonStyle = { margin: `${half}px  0` }
    if (splitType === SplitType.SPACE) {
      return commonStyle
    }
    return { ...commonStyle, borderTop: `1px ${splitType} #F1F1F1` }
  }

  get labelStyle() {
    const { labelAlign, labelWidth, labelWeight } = this
    return {
      textAlign: labelAlign,
      width: labelWidth + 'px',
      fontWeight: labelWeight
    }
  }
}
</script>

<style scoped>
.colon::after {
  display: inline-block;
  content: '：';
}
</style>
