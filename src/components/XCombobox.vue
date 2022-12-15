<template>
  <v-combobox
    v-model="val"
    v-bind="$attrs"
    v-on="$listeners"
    :disabled="isDisabled"
    :readonly="isReadonly"
    :dense="dense"
    :outlined="outlined"
    :clearable="isClearable && !isDisabled && !isReadonly"
    :items="items"
    :item-text="itemText"
    :item-value="itemValue"
    :item-disabled="itemDisabled"
    :label="label"
    :multiple="multiple"
    :autofocus="autofocus"
    :hide-details="hideDetails"
    :placeholder="placeholder"
    :color="isReadonly ? 'grey' : ''"
    :rules="!isDisabled && !isReadonly ? getRules : []"
    :menu-props="menuProps"
    :chips="chips"
    @change="onChange"
    @click:clear="clearTap"
  >
    <template v-slot:no-data>
      <slot name="no-data" />
    </template>
    <template v-slot:prepend-inner>
      <span
        v-if="!isDisabled && !isReadonly && isRequired"
        class="require-star lh-30"
        >*</span
      >
      <slot name="prepend-inner" />
    </template>
  </v-combobox>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { ValidateRules } from '@/utils/ValidateRules'
@Component({})
export default class XCombobox extends Vue {
  @Prop({ default: '' }) label?: string
  @Prop({ default: '' }) placeholder?: string
  @Prop({ default: 'name' }) itemText?: string
  @Prop({ default: 'id' }) itemValue?: string
  @Prop({ default: () => [] }) items?: any
  @Prop({ default: true }) dense?: boolean
  @Prop({ default: true }) outlined?: boolean
  @Prop({ default: false }) disabled?: boolean | string
  @Prop({ default: false }) readonly?: boolean | string
  @Prop({ default: true }) clearable?: boolean | string
  @Prop({ default: false }) hideDetails?: boolean | string
  @Prop({ default: false }) autofocus?: boolean
  @Prop({ default: false }) required?: boolean | string
  @Prop({ default: true }) multiple?: boolean
  @Prop({ default: 'disabled' }) itemDisabled?: any
  @Prop({ default: '' }) value: any
  @Prop({ default: true }) chips?: boolean
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
  val: any = ''
  created() {
    this.val = this.value
  }

  @Watch('value')
  valueChange(val: any) {
    this.val = this.value
  }

  clearTap() {
    this.val = null
    this.$emit('input', this.val)
    this.$emit('change', this.val)
  }

  onChange() {
    if (!this.val) return
    this.$emit('input', this.val)
    this.$emit('change', this.val)
  }

  get getRules() {
    return !this.isDisabled && !this.isReadonly
      ? this.isRequired
        ? [this.validateRules.required, ...this.rules]
        : this.rules
      : []
  }
}
</script>
