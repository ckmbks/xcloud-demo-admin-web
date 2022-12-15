<template>
  <v-textarea
    v-model="val"
    :label="label"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :dense="dense"
    :outlined="outlined"
    :clearable="clearable && !disabled && !readonly"
    :hide-details="hideDetails"
    :rules="getRules"
    :counter="counter"
    :maxlength="maxlength"
    :rows="rows"
    :row-height="rowHeight"
    :height="height"
    no-resize
    :color="readonly ? 'grey' : ''"
    :auto-grow="autoGrow"
    @keydown="keydown"
    @blur="onChange"
    @click:clear="clearTap"
  >
    <template v-slot:prepend-inner>
      <span v-if="!disabled && !readonly && required" class="require-star lh-30"
      >*</span
      >
      <slot name="prepend-inner" />
    </template>
  </v-textarea>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { ValidateRules } from '@/utils/ValidateRules'
@Component({})
export default class XTextarea extends Vue {
  @Prop({ default: '' }) label?: string
  @Prop({ default: '' }) placeholder?: string
  @Prop({ default: true }) dense?: boolean
  @Prop({ default: true }) outlined?: boolean
  @Prop({ default: false }) disabled?: boolean
  @Prop({ default: false }) readonly?: boolean
  @Prop({ default: false }) clearable?: boolean
  @Prop({ default: false }) hideDetails?: boolean
  @Prop({ default: false }) required?: boolean
  @Prop({ default: false }) autoGrow?: boolean
  @Prop() counter?: number | string
  @Prop() maxlength?: number | string
  @Prop({ default: 5 }) rows?: number | string
  @Prop({ default: 30 }) rowHeight?: number | string
  @Prop({ default: 65 }) height?: number | string
  @Prop({ default: '' }) value!: any
  @Prop({ default: () => [] }) rules?: any
  @Prop({ default: () => ({ bottom: true, offsetY: true }) }) menuProps:
    | string
    | any
    | Object

  validateRules: any = ValidateRules
  clear = false
  val: any = null
  tempVal: any = null
  created() {
    this.val = this.value
    this.tempVal = this.val
  }

  @Watch('value')
  valueChange() {
    this.val = this.value
    this.tempVal = this.val
  }

  clearTap() {
    this.val = null
  }

  keydown(e: any) {
    if (e.keyCode === 13) {
      this.onChange()
    }
  }

  onChange() {
    if (this.val === this.tempVal) return
    this.tempVal = this.val
    this.$emit('input', this.val)
    this.$emit('change', this.val)
    this.$emit('blur', this.val)
  }

  get getRules() {
    return this.required
      ? [this.validateRules.required, ...this.rules]
      : this.rules
  }
}
</script>
