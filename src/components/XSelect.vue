<template>
  <v-select
    v-model="val"
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
    :rules="getRules"
    :chips="chips"
    :menu-props="menuProps"
    @change="onChange"
    @click:clear="clearTap"
    v-bind="$attrs"
  >
    <template v-slot:no-data>
      <slot name="no-data" />
    </template>
    <template v-slot:prepend-inner>
      <span
        class="require-star lh-30"
        v-if="!isDisabled && !isReadonly && isRequired"
      >
        *
      </span>
      <slot name="prepend-inner" />
    </template>
    <template v-slot:prepend-item>
      <slot name="prepend-item" />
    </template>
    <template
      v-if="$scopedSlots.selection"
      v-slot:selection="{ parent, item, index, select, selected, disabled }"
    >
      <slot
        name="selection"
        :parent="parent"
        :item="item"
        :index="index"
        :select="select"
        :selected="selected"
        :disabled="disabled"
      />
    </template>
  </v-select>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { ValidateRules } from '@/utils/ValidateRules'
import { isArray } from '@/utils/validate'
@Component({})
export default class XSelect extends Vue {
  @Prop({ default: '' }) label?: string
  @Prop({ default: '' }) placeholder?: string
  @Prop({ default: 'text' }) itemText?: string
  @Prop({ default: 'value' }) itemValue?: string
  @Prop({ default: () => [] }) items?: any
  @Prop({ default: true }) dense?: boolean
  @Prop({ default: true }) outlined?: boolean
  @Prop({ default: false }) disabled?: boolean | string
  @Prop({ default: false }) readonly?: boolean | string
  @Prop({ default: true }) clearable?: boolean | string
  @Prop({ default: false }) hideDetails?: boolean | string
  @Prop({ default: false }) autofocus?: boolean
  @Prop({ default: false }) required?: boolean | string
  @Prop({ default: false }) multiple?: boolean
  @Prop({ default: false }) chips?: boolean
  @Prop({ default: 'disabled' }) itemDisabled?: any
  @Prop({ default: '' }) value: any
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
    // 修复当val为0或者""时导致误判问题
    if (!this.val && this.val !== 0 && this.val !== '') return
    this.$emit('input', this.val)
    this.$emit('change', this.val)
  }

  get getRules() {
    return !this.isDisabled && !this.isReadonly
      ? this.isRequired
        ? [
            this.validateRules.required,
            (v: any) => {
              if (isArray(v) && v.length === 0 && this.isRequired) {
                return '必填'
              } else return true
            },
            ...this.rules
          ]
        : this.rules
      : []
  }
}
</script>
