<template>
  <div>
    <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      :nudge-right="40"
      :return-value.sync="curValue"
      transition="scale-transition"
      offset-y
      :disabled="disabled||readonly"
      min-width="290px"
    >
      <template v-slot:activator="{on}">
        <v-text-field
          v-model="curValue"
          :label="label"
          append-icon="access_time"
          :color="readonly?'grey':''"
          dense
          :outlined="outlined"
          :solo="solo"
          :hide-details="hideDetails"
          :disabled="disabled"
          :rules="getRules"
          clearable
          v-on="on"
          @click:clear="clear"
        >
          <template v-slot:prepend-inner>
            <span v-if="!disabled&&!readonly&&required" class="require-star lh-30">*</span>
            <slot name="prepend-inner" />
          </template>
        </v-text-field>
      </template>
      <v-time-picker
        v-if="menu"
        v-model="curValue"
        full-width
        ampm-in-title
        :format="format"
        :disabled="disabled"
        :readonly="readonly"
        :min="min"
        :max="max"
        :allowed-hours="allowedHours"
        :allowed-minutes="allowedMinutes"
        :use-seconds="useSeconds"
        @click:hour="clickHour"
        @click:minute="$refs.menu.save(curValue)"
      />
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { ValidateRules } from "@/utils/ValidateRules";

@Component({

})
export default class TimePicker extends Vue {
  @Prop({ default: true }) outlined?: boolean;
  @Prop({ default: false }) solo?: boolean;
  @Prop({ default: false }) hideDetails?: boolean;
  @Prop({ default: '' }) value?: string;
  @Prop({ default: '时间' }) label?: string;
  @Prop({ default: undefined }) min?: string;
  @Prop({ default: undefined }) max?: string;
  @Prop({ default: 'ampm' }) format?: string;
  @Prop({ default: false }) useSeconds?: boolean;
  @Prop({ default: false }) required?: boolean;
  @Prop({ default: false }) icon?: boolean;
  @Prop({ default: false }) disabled?: boolean;
  @Prop({ default: false }) readonly?: boolean;
  @Prop({ default: true }) clearable?: boolean;
  @Prop({ default: null }) allowedHours?: any;
  @Prop({ default: null }) allowedMinutes?: any;
  @Prop({ default: ()=>[] }) rules?: any;

  menu = false
  curValue: any = ''
  validateRules: any = ValidateRules;
  clear() {
    this.curValue = ''
    this.$emit('clearEvent')
  }

  mounted() {
    this.curValue = this.value
  }

  @Watch('value')
  getValue(value: any) {
    this.curValue = this.value
  }

  @Watch('curValue')
  getCurValue(value: any) {
    this.$emit('input', value)
    this.$emit('selected', value)
    this.$emit('change', value)
  }

  clickHour(value: any) {
    this.$emit('clickHour', value)
  }
  get getRules() {
    return this.required ? [this.validateRules.required, ...this.rules] : this.rules
  }
}
</script>
