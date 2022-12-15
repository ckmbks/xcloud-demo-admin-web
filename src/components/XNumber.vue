<template>
  <!-- type="number" -->
  <v-text-field
    :label="label"
    :dense="dense"
    :disabled="isDisabled"
    :readonly="isReadonly"
    :color="isReadonly ? 'grey' : ''"
    :clearable="isClearable && !isDisabled && !isReadonly"
    :hide-details="hideDetails"
    v-model="val"
    :max="max"
    :min="min"
    :rules="getRules"
    :counter="counter"
    :maxlength="maxlength"
    @input.native="numTnput"
    @blur="blur"
    @keyup.13="enterTap"
    @keyup.delete="deleteTap"
    @click:clear="clearTap"
    :outlined="outlined"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-slot:append>
      <v-icon v-if="type === 'counter'" @click="handlePlus">mdi-plus</v-icon>
      <slot name="append"></slot>
    </template>
    <template v-slot:prepend-inner>
      <v-icon v-if="type === 'counter'" class="minus" @click="handleMinus"
        >mdi-minus</v-icon
      >
      <span
        v-if="!isDisabled && !isReadonly && isRequired && type !== 'counter'"
        class="require-star lh-30"
        >*</span
      >
      <slot name="prepend-inner" />
    </template>
    <template v-slot:append-outer>
      <slot name="append-outer" />
    </template>
    <template v-slot:prepend>
      <slot name="prepend" />
    </template>
  </v-text-field>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { ValidateRules } from '@/utils/ValidateRules'
import { number } from 'echarts'
@Component({})
export default class XNumber extends Vue {
  @Prop({ default: '' })
  label?: string

  @Prop({ default: true })
  dense?: boolean

  @Prop({ default: false })
  disabled?: boolean | string

  @Prop({ default: true })
  outlined?: boolean

  @Prop({ default: false })
  readonly?: boolean | string

  @Prop({ default: true })
  clearable?: boolean | string

  @Prop({ default: false })
  hideDetails?: boolean | string

  @Prop({ default: 1 }) // 点击一次加减的值
  step?: number

  @Prop()
  counter?: any

  @Prop()
  type?: string

  @Prop()
  maxlength?: any

  @Prop({ default: Infinity }) // 最大值
  max?: number

  @Prop({ default: -Infinity }) // 最小值
  min?: number

  @Prop({ default: -1 }) // 小数点修正
  fix?: number

  @Prop({ default: '' })
  value: any

  @Prop({ default: () => [] }) rules?: any
  @Prop({ default: false }) required?: boolean | string
  get isClearable() {
    return this.clearable === '' || this.clearable
  }

  get isReadonly() {
    return this.readonly === '' || this.readonly
  }

  get isDisabled() {
    return this.disabled === '' || this.disabled
  }

  get isRequired() {
    return this.required === '' || this.required
  }

  clear = false
  val: any = ''
  validateRules: any = ValidateRules
  created() {
    const clear: any = this.isClearable
    this.clear = clear
    if (clear === undefined) this.clear = true
    if (clear === '') this.clear = true
    // this.val = "0";
    this.valueChange()
  }

  @Watch('value')
  valueChange() {
    this.val = this.value
  }

  get getRules() {
    return !this.isDisabled && !this.isReadonly
      ? this.isRequired
        ? [this.validateRules.required, ...this.rules]
        : this.rules
      : []
  }

  clearTap() {
    this.val = ''
    this.numChange()
  }

  @Watch('val')
  numChange() {
    if (this.min) {
      if (this.val < this.min) {
        this.val = this.min
      }
    }
    if (this.max) {
      if (this.val > this.max) {
        this.val = this.max
      }
    }
    console.log(this.val)
    this.$emit('input', this.val)
    this.$emit('change', this.val)
  }

  deleteTap() {
    if (!this.clear && this.val === '') {
      this.val = ''
      this.numChange()
    }
  }

  enterTap() {
    this.numChange()
  }

  numTnput(e: any) {
    const ele = e.target
    let minus = ''
    let tempVal = this.val + ''
    // 优化操作体验
    if (this.clear === undefined && tempVal === '') tempVal = '0'
    if (tempVal === '00') tempVal = '0'
    tempVal = tempVal.replace(/^0([0-9])/, '$1')
    tempVal = tempVal.replace(/[^\d.]/g, '') // 替换掉非数字,除了数字和.
    if (this.fix !== 0) {
      if (tempVal === '.') tempVal = '0.'
      if (tempVal === '-.') tempVal = '-0.'
      if (tempVal.indexOf('.') === -1 && tempVal !== '-' && tempVal !== '') {
        tempVal = String(Number(tempVal))
      }
      // 保存负号
      if (tempVal.indexOf('-') === 0) {
        minus = '-'
        tempVal = String(tempVal).slice(1, tempVal.length)
      }
      tempVal = String(tempVal)
        .replace(/[^\d.]/g, '') // 先把非数字的都替换掉，除了数字和.
        .replace(/^\./g, '') // 必须保证第一个为数字而不是.
        .replace(/^0{2,}/, '0') // 保证第一位只能有一个或0个0
        .replace(/^0[\d]/, '0') // 以0开始的第二位只能为小数点
        .replace(/\.{2,}/g, '.') // 保证只有出现一个.而没有多个.
        // 保证.只出现一次，而不能出现两次以上
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
    } else {
      tempVal = String(tempVal).replace(/[^0-9]/g, '')
    }
    let val: any = minus + tempVal
    // 数值校验
    let max = this.max || Infinity
    max = this.max === 0 ? 0 : max
    let min = this.min || -Infinity
    min = this.min === 0 ? 0 : min
    // const fix: any = this.fix
    if (Number(val) > max) val = max
    if (Number(val) < min) val = min
    const _fix: any = this.fix
    if (_fix > 0) {
      if (String(val).indexOf('.') >= 0) {
        if (String(val).split('.')[1].length > _fix) {
          const _num = String(val).split('.')[1].substr(0, _fix)
          val = Number(`${String(val).split('.')[0]}.${_num}`)
          // val = Number(val).toFixed(_fix);
        }
      } else {
        val = Number(val)
      }
    } else if (_fix === 0) {
      if (String(val).indexOf('.') > 0) {
        val = val.replaceAll('[.]$', '')
        val = Number(val)
      }
    }
    if (this.maxlength && String(val).length > this.maxlength)
      val = Number(String(val).slice(0, Number(this.maxlength)))
    ele.value = val
    this.val = val
    this.numChange()
  }

  blur() {
    if (this.fix && this.fix >= 0) {
      this.val = Number(this.val).toFixed(this.fix)
      const arr = this.val.split('.')
      console.log('object1=', arr)
      arr[1] = arr[1] && arr[1].substr(0, this.fix)
      this.val = Number(arr.join('.')).toFixed(this.fix)
      this.numChange()
    }
  }

  handlePlus() {
    if (this.max && this.val >= this.max) return
    if (this.step) {
      this.val = Number(this.val) + this.step
    } else {
      this.val = Number(this.val) + 1
    }
    this.$emit('plus')
  }

  handleMinus() {
    if (this.min && this.val <= this.min) return
    if (this.step) {
      this.val = Number(this.val) - this.step
    } else {
      this.val = Number(this.val) - 1
    }
    this.$emit('minus')
  }
}
</script>
<style lang="scss" scoped>
.v-icon {
  &:active {
    position: relative;
    top: 2px;
  }
}
</style>
