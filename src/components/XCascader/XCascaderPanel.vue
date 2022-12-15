<template>
  <v-card>
    <v-card-text class="pa-0">
      <x-cascader-item v-model="checkedValues" :items="items"></x-cascader-item>
    </v-card-text>

    <!-- <v-card-actions v-if="items.length > 0 && isActions">
        <v-spacer></v-spacer>
        <v-btn depressed color="primary" outlined @click="cancel">取消</v-btn>
        <v-btn depressed color="primary" @click="submit"> 确定</v-btn>
      </v-card-actions> -->
  </v-card>
</template>
<script lang="ts">
import {
  Component,
  Vue,
  Model,
  Watch,
  Emit,
  Prop,
  Provide
} from 'vue-property-decorator'
import XCascaderItem from './XCascaderItem.vue'
@Component({
  name: 'XCascaderPanel',
  components: {
    XCascaderItem
  }
})
export default class XCascaderPanel extends Vue {
  @Model('input')
  value?: any

  @Prop({ default: () => [] })
  items: any

  @Prop({
    default: () => {}
  })
  props?: any

  get defaultProps() {
    return {
      value: 'value',
      label: 'label',
      children: 'children',
      disabled: 'disabled',
      lazy: false,
      lazyLoad: () => {},
      ...this.props
    }
  }

  @Provide('propsOptions')
  propsOptions = this.defaultProps

  checkedValues: any = []
  @Watch('checkedValues')
  watchCheckedValues(val: any) {
    this.emitInput()
  }

  @Emit('input')
  emitInput() {
    return this.checkedValues
  }
}
</script>
<style lang="scss" scoped>
::v-deep.v-card {
  display: inline-block;
}
</style>
