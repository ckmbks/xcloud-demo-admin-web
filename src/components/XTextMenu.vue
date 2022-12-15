<template>
  <v-menu
    :close-on-content-click="false"
    v-model="isShow"
  >
    <template v-slot:activator="{ on, attrs }">
      <x-text-field
        hide-details
        v-model="val"
        readonly
        append-icon="arrow_drop_down"
        :label="label"
        @input="search"
        @click:append="search"
        v-bind="attrs"
        v-on="on"
      ></x-text-field>
    </template>
    <v-card>
      <v-card-text
        class="pa-0"
      >
        <v-textarea
          v-model="val"
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
          autofocus
          @keydown="keydown"
          @blur="onChange"
          @click:clear="clearTap"
        >
          <template v-slot:prepend-inner>
      <span v-if="!disabled && !readonly && required" class="require-star lh-30"
      >*</span
      >
            <slot name="prepend-inner"/>
          </template>
        </v-textarea>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          small
          depressed
          color="primary"
          outlined
          dark
          @click="confirm"
        >确定
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>

</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { ValidateRules } from '@/utils/ValidateRules'

@Component({})
export default class XTextMenu extends Vue {
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
  @Prop({ default: 500 }) height?: number | string
  @Prop({ default: '' }) value!: any
  @Prop({ default: () => [] }) rules?: any
  @Prop({ default: () => ({ bottom: true, offsetY: true }) }) menuProps:
    | string
    | any
    | Object

  isShow: boolean = false
  validateRules: any = ValidateRules
  clear = false
  val: any = null
  tempVal: any = null
  searchValue: any = null

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


  async search() {
    this.isShow = true
  }

  async confirm() {
    this.isShow = false
  }

  get getRules() {
    return this.required
      ? [this.validateRules.required, ...this.rules]
      : this.rules
  }
}
</script>
