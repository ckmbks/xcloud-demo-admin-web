<template>
  <v-text-field
    v-bind="$attrs"
    v-on="$listeners"
    v-model="val"
    :label="label"
    :placeholder="placeholder"
    :disabled="isDisabled"
    :readonly="isReadonly"
    :dense="dense"
    :outlined="outlined"
    :clearable="isClearable && !isDisabled && !isReadonly"
    :hide-details="hideDetails"
    :color="isReadonly ? 'grey' : ''"
    :counter="counter"
    :maxlength="maxlength"
    :type="type"
    :max="max"
    :min="min"
    :append-icon="appendIcon"
    :autocomplete="autocomplete"
    :rules="getRules"
    @blur="onChange"
    @keydown="keydown"
    @keyup="keyup"
    @click:clear="clearTap"
    @click:append="appendClick"
  >
    <template v-slot:prepend>
      <slot name="prepend" />
    </template>
    <template v-slot:append>
      <slot name="append" />
    </template>
    <template v-slot:append-outer>
      <slot name="outer" />
    </template>
    <template v-slot:prepend-inner>
      <span
        v-if="!isDisabled && !isReadonly && isRequired"
        class="require-star lh-30"
        >*</span
      >
      <slot name="prepend-inner" />
    </template>
  </v-text-field>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { ValidateRules } from '@/utils/ValidateRules'
@Component({})
export default class XTextField extends Vue {
  @Prop({ default: '' }) label?: string
  @Prop({ default: '' }) placeholder?: string
  @Prop({ default: '' }) type?: string
  @Prop({ default: '' }) appendIcon?: string
  @Prop({ default: true }) dense?: boolean
  @Prop({ default: true }) outlined?: boolean
  @Prop({ default: false }) disabled?: boolean | string
  @Prop({ default: false }) readonly?: boolean | string
  @Prop({ default: true }) clearable?: boolean | string
  @Prop({ default: false }) hideDetails?: boolean | string
  @Prop({ default: false }) required?: boolean | string
  @Prop({ default: Infinity }) min?: number
  @Prop({ default: Infinity }) max?: number
  @Prop() counter?: number
  @Prop() maxlength?: number
  @Prop({ default: 'off' }) autocomplete?: string
  @Prop({ default: '' }) value!: any
  @Prop({ default: () => [] }) rules?: any
  @Prop({ default: () => ({ bottom: true, offsetY: true }) }) menuProps:
    | string
    | any
    | Object

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

  validateRules: any = ValidateRules
  clear = false
  val: any = null
  tempVal: any = null
  created() {
    this.val = this.value
    this.tempVal = this.val
  }

  @Watch('value')
  valueChange(val: any) {
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

  keyup(e: any) {
    this.$emit('keyup', e)
  }

  onChange() {
    if (this.val === this.tempVal) return
    this.tempVal = this.val
    this.$emit('input', this.val)
    this.$emit('change', this.val)
    this.$emit('blur', this.val)
  }

  get getRules() {
    return !this.isDisabled && !this.isReadonly
      ? this.isRequired
        ? [this.validateRules.required, ...this.rules]
        : this.rules
      : []
  }

  appendClick() {
    this.$emit('click:append')
  }
}
</script>
