<template>
  <v-menu :close-on-content-click="closeOnContentClick" v-model="menuShow" offset-y
    :max-width="optionsData.length > 0 ? '100%' : undefined" v-bind="$attrs" allow-overflow>
    <template v-slot:activator="{ on }">
      <v-text-field readonly outlined dense v-bind="$attrs" v-on="on" hide-details="auto" :value="textFieldValue"
        @click:clear="handleClear" :rules="getRules">
        <template slot="append">
          <v-icon @click="menuShow = !menuShow" :class="{ 'menu-drop': menuShow }">mdi-menu-down</v-icon>
        </template>
        <template v-slot:prepend-inner>
          <span v-if="required" class="require-star lh-30">*</span>
          <slot name="prepend-inner" />
        </template>
      </v-text-field>
    </template>

    <x-cascader-item :props="defaultProps" v-if="optionsData.length > 0" v-model="checkedValues"
      :defaultValue="defaultValues" :items="optionsData">
    </x-cascader-item>
    <template v-else>
      <slot name="empty">
        <div class="empty d-flex justify-center align-center">暂无数据</div>
      </slot>
    </template>
  </v-menu>
</template>
<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Watch,
  Model,
  Emit
} from 'vue-property-decorator'
import XCascaderItem from './XCascaderItem.vue'
import { ValidateRules } from '@/utils/ValidateRules'
@Component({
  components: {
    XCascaderItem
  }
})
export default class XCascader extends Vue {
  @Model('input', { default: () => [] })
  value: any

  menuShow: boolean = false
  @Prop({ default: false }) required?: boolean
  @Prop({ default: () => [] }) rules?: any
  get getRules() {
    return this.required ? [ValidateRules.required, ...this.rules] : this.rules
  }

  @Prop({ default: '' })
  defaultValue: any

  @Prop({ default: false })
  emitPath?: boolean // 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值

  @Prop({ default: () => [] })
  items?: any

  get optionsData() {
    if (this.defaultProps.lazy) {
      return this.asyncItems
    } else {
      return this.items
    }
  }

  @Watch('optionsData')
  watchOptionsData() {
    if (Array.isArray(this.defaultValue)) {
      if (this.defaultValue.length > 0) {
        this.setDefaultValue(this.defaultValue[this.defaultValue.length - 1])
      }
    } else {
      this.setDefaultValue(this.defaultValue)
    }
  }

  defaultValues: any = []
  setDefaultValue(nodeId: string | number) {
    const nodes = this.getParentNode(this.optionsData, nodeId, {
      value: this.defaultProps.value,
      children: this.defaultProps.children
    })
    this.checkedValues = nodes
    this.defaultValues = nodes
  }

  // 获取已知节点的父节点
  getParentNode(
    sourceData: any,
    targetNodeId: number | string,
    { value = 'value', children = 'children', parentId = 'parentId' } = {}
  ) {
    const arrRes: any = []
    if (sourceData.length === 0) {
      return arrRes
    }
    const rec = (data: any, nodeId: number | string) => {
      data.forEach((node: any) => {
        if (node[value] === nodeId) {
          arrRes.unshift(node)
          rec(sourceData, node[parentId])
        } else {
          if (node[children] && node[children].length > 0) {
            rec(node[children], nodeId)
          }
        }
      })
      return arrRes
    }
    return rec(sourceData, targetNodeId)
  }

  @Prop({ default: false })
  returnObject: any // 以对象数组的形式返回

  @Prop({ default: true })
  showAllLevels?: boolean // 是否展示所有标签

  @Prop({
    default: () => { }
  })
  props?: any

  get defaultProps() {
    return {
      value: 'value',
      label: 'label',
      children: 'children',
      disabled: 'disabled',
      leaf: 'leaf',
      lazy: false,
      lazyLoad: (node: any, resolve: any) => {
        // 数据加载完必须调用resolve,将数据resolve出去
        resolve([])
      },
      ...this.props
    }
  }

  asyncItems: any = []

  @Watch('menuShow')
  watchMenuShow(val: boolean) {
    if (val && this.optionsData.length === 0 && this.defaultProps.lazy) {
      if (typeof this.defaultProps.lazyLoad !== 'function') {
        throw new Error('缺少动态加载数据源的方法')
      }

      new Promise((resolve) => {
        return this.defaultProps.lazyLoad.call(this, '', resolve)
      }).then((node) => {
        this.asyncItems = node
      })
    }
  }

  // 获取数据最大深度
  itemsDeep() {
    const that = this
    function getMaxDeep(items: any) {
      let deep = 0
      function eachData(data: any, index: number) {
        data.forEach((el: any) => {
          if (index > deep) {
            deep = index
          }
          if (
            el[that.defaultProps.children] &&
            el[that.defaultProps.children].length > 0
          ) {
            eachData(el[that.defaultProps.children], index + 1)
          }
        })
      }

      if (items.length > 0) {
        eachData(items, 1)
      }

      return deep
    }
    if (this.checkedValues.length > 0) {
      return getMaxDeep(this.checkedValues)
    } else {
      return 0
    }
  }

  get closeOnContentClick() {
    return this.defaultProps.lazy
      ? false
      : this.checkedValues.length >= this.itemsDeep()
  }

  @Watch('value')
  watchValue() {
    if (!this.value) {
      this.checkedValues = []
      this.emitInput()
    }
  }

  get textFieldValue() {
    if (
      this.showAllLevels &&
      this.checkedValues.length !== this.itemsDeep() &&
      this.itemsDeep() !== 0
    ) {
      return ''
    }
    const strAry: any = []
    this.checkedValues.forEach((item: any) => {
      strAry.push(item[this.defaultProps.label])
    })
    return this.showAllLevels ? strAry.join('/') : strAry[strAry.length - 1]
  }

  get valuesArray() {
    const ary: any = []
    this.checkedValues.forEach((item: any) => {
      ary.push(item[this.defaultProps.value])
    })
    return ary
  }

  @Emit('input')
  emitInput() {
    // if (this.checkedValues.length > 0) {
    //   return this.returnObject
    //     ? this.checkedValues[this.checkedValues.length - 1]
    //     : this.valuesArray[this.valuesArray.length - 1]
    // } else {
    //   return ''
    // }

    if (this.emitPath) {
      return this.returnObject ? this.checkedValues : this.valuesArray
    } else {
      if (this.checkedValues.length > 0) {
        return this.returnObject
          ? this.checkedValues[this.checkedValues.length - 1]
          : this.valuesArray[this.valuesArray.length - 1]
      } else {
        return null
      }
    }
  }

  @Emit('change')
  emitChange() {
    return this.returnObject ? this.checkedValues : this.valuesArray
  }

  checkedValues: any = []
  @Watch('checkedValues')
  watchCheckedValues() {
    if (this.itemsDeep() !== 0) {
      if (this.showAllLevels) {
        // 需要选到最后一级才触发更新
        if (this.checkedValues.length === this.itemsDeep()) {
          this.emitInput()
          this.emitChange()
        }
      } else {
        this.emitInput()
        this.emitChange()
      }
    }
  }

  handleClear() {
    this.checkedValues = []
    this.emitInput()
    this.emitChange()
  }
}
</script>
<style lang="scss" scoped>
.empty {
  background-color: #fff;
  min-height: 50px;
  font-size: 14px;
  color: #999;
}

.menu-drop {
  transform: rotate(180deg);
  transition: 0.5s;
}
</style>
