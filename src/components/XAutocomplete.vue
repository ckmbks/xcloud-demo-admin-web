<template>
  <v-autocomplete
    v-bind="$attrs"
    v-on="$listeners"
    :disabled="isDisabled"
    :readonly="isReadonly"
    :clearable="isClearable && !isDisabled && !isReadonly"
    dense
    outlined
    :rules="getRules"
    :color="isDisabled ? 'grey' : ''"
    :hide-details="hideDetails"
  >
    <template v-if="$scopedSlots.selection" v-slot:selection="data">
      <slot name="selection" :data="data"></slot>
    </template>
    <template v-if="$scopedSlots.item" v-slot:item="data">
      <slot name="item" :data="data"></slot>
    </template>
    <template v-slot:prepend-inner>
      <span
        v-if="!isDisabled && !isReadonly && isRequired"
        class="require-star lh-30"
        >*</span
      >
      <slot name="prepend-inner"></slot>
    </template>
  </v-autocomplete>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { ValidateRules } from '@/utils/ValidateRules'

@Component({
  components: {}
})
export default class XAutocomplete extends Vue {
  @Prop({ default: true }) clearable?: boolean | string
  @Prop({ default: false }) disabled?: boolean | string
  @Prop({ default: false }) required?: boolean | string
  @Prop({ default: () => [] }) rules?: any
  @Prop({ default: 'auto' }) hideDetails?: boolean | string
  @Prop({ default: false }) readonly?: boolean | string
  validateRules: any = ValidateRules
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

  get getRules() {
    return this.isRequired
      ? [this.validateRules.required, ...this.rules]
      : this.rules
  }
}
</script>
