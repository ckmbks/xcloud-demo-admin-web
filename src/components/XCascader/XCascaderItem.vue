<template>
  <div class="d-flex">
    <v-list dense class="py-0 area-list">
      <v-list-item-group
        :value="activeValue"
        :mandatory="activeValue !== ''"
        color="primary"
      >
        <template v-for="item in items">
          <v-list-item
            :value="item[defaultProps.value]"
            :disabled="item[defaultProps.disabled]"
            @click="hanleChecked(item)"
            :key="item[defaultProps.value]"
          >
            <v-list-item-title>{{
              item[defaultProps.label]
            }}</v-list-item-title>
            <v-list-item-icon
              v-if="
                defaultProps.lazy
                  ? item.leaf || activeItems.length > 0
                  : item[defaultProps.children] &&
                    item[defaultProps.children].length > 0
              "
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </template>
      </v-list-item-group>
    </v-list>
    <x-cascader-item
      :props="defaultProps"
      :defaultValue="defaultValues"
      v-model="childrenValue"
      v-if="
        defaultProps.lazy
          ? activeItems.length > 0
          : activeItems[defaultProps.children] &&
            activeItems[defaultProps.children].length > 0
      "
      :items="
        defaultProps.lazy ? activeItems : activeItems[defaultProps.children]
      "
    ></x-cascader-item>
  </div>
</template>
<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Model,
  Watch,
  Emit
} from 'vue-property-decorator'
@Component({
  name: 'XCascaderItem'
})
export default class XCascaderItem extends Vue {
  @Model('input', { default: () => [] })
  value: any

  @Prop({ default: '' })
  defaultValue: any

  @Prop({ default: () => {} })
  props: any

  get defaultProps() {
    return {
      value: 'value',
      label: 'label',
      children: 'children',
      disabled: 'disabled',
      leaf: 'leaf',
      lazy: false,
      lazyLoad: () => {},
      ...this.props
    }
  }

  defaultValues: any = []
  @Watch('defaultValue', { immediate: true })
  watchDefaultValue() {
    if (this.defaultValue.length > 0) {
      this.activeValue = this.defaultValue[0][this.defaultProps.value]
      this.activeItems = this.defaultValue[0]
      const ary = [...this.defaultValue]
      ary.shift()
      this.defaultValues = ary
    }
  }

  @Prop({ default: () => [] })
  items: any

  @Watch('items')
  watchActiveItems() {
    this.activeItems = []
    this.activeValue = ''
  }

  activeItems: any = []

  @Emit('input')
  emitInput() {
    const value = [this.activeItems, ...this.childrenValue]
    return value
  }

  childrenValue: any = []
  @Watch('childrenValue')
  watchChildrenValue(val: any) {
    val.length > 0 && this.emitInput()
  }

  activeValue: any = ''
  @Watch('value')
  watchValue(val: any) {
    if (Array.isArray(val)) {
      if (val.length === 0) {
        this.activeValue = ''
        this.childrenValue = []
        this.activeItems = []
      }
    } else if (val === '') {
      this.activeValue = ''
      this.childrenValue = []
      this.activeItems = []
    }
  }

  @Emit('lazyLoad')
  emitLazyLoad(item: any) {
    return item
  }

  loading: boolean = false
  hanleChecked(item: any) {
    //   懒加载
    if (this.defaultProps.lazy) {
      this.loading = true
      new Promise((resolve) => {
        return this.defaultProps.lazyLoad.call(this, item, resolve)
      }).then((node) => {
        this.loading = false
        this.activeItems = node
        this.childrenValue = []
        this.activeValue = item[this.defaultProps.value]
        this.emitInput()
      })
    } else {
      this.activeItems = item
      this.childrenValue = []
      this.activeValue = item[this.defaultProps.value]
      this.emitInput()
    }
  }
}
</script>
<style lang="scss" scoped></style>
