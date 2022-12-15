<template>
  <v-dialog
    persistent
    scrollable
    :retain-focus="false"
    v-model="display"
    :width="dialogWidth"
    :disabled="isDisabled || isReadonly"
  >
    <template v-slot:activator="{ on }">
      <v-icon size="30" v-if="onlyIcon" v-on="on"
        >mdi-calendar-clock-outline</v-icon
      >
      <v-text-field
        v-else
        v-bind="textFieldProps"
        :disabled="isDisabled"
        :loading="loading"
        dense
        :outlined="outlined"
        :clearable="isClearable && !isDisabled && !isReadonly"
        append-inner-icon="event"
        :color="isReadonly ? 'grey' : ''"
        :solo="solo"
        :label="label"
        :rules="getRules"
        :value="formattedvalue"
        :hide-details="hideDetails"
        v-on="on"
        readonly
      >
        <template v-slot:prepend-inner>
          <span
            v-if="!isDisabled && !isReadonly && isRequired"
            class="require-star lh-30"
            >*</span
          >
          <slot name="prepend-inner" />
        </template>
        <template v-slot:progress>
          <slot name="progress">
            <v-progress-linear
              color="primary"
              indeterminate
              absolute
              height="2"
            ></v-progress-linear>
          </slot>
        </template>
        <template v-slot:append-outer>
          <slot name="append-outer"></slot>
        </template>
      </v-text-field>
    </template>

    <v-card>
      <v-card-text class="px-0 py-0">
        <v-tabs fixed-tabs v-model="activeTab">
          <v-tab key="calendar">
            <slot name="dateIcon">
              <v-icon>event</v-icon>
            </slot>
          </v-tab>
          <v-tab key="timer" :disabled="dateSelected">
            <slot name="timeIcon">
              <v-icon>access_time</v-icon>
            </slot>
          </v-tab>
          <v-tab-item key="calendar">
            <v-date-picker
              v-model="date"
              :readonly="isReadonly"
              v-bind="datePickerProps"
              @input="showTimePicker"
              full-width
            ></v-date-picker>
          </v-tab-item>
          <v-tab-item key="timer">
            <v-time-picker
              ref="timer"
              :readonly="isReadonly"
              class="v-time-picker-custom"
              v-model="time"
              format="24hr"
              v-bind="timePickerProps"
              full-width
            ></v-time-picker>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <slot name="actions" :parent="this">
          <v-btn color="primary" text @click.native="clearHandler">取消</v-btn>
          <v-btn color="primary" text @click="okHandler">确定</v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Model } from 'vue-property-decorator'
import { ValidateRules } from '@/utils/ValidateRules'
import { isArray } from '@/utils/validate'
import moment from 'moment'
const DEFAULT_DATE = ''
const DEFAULT_TIME = '00:00:00'
const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD'
const DEFAULT_TIME_FORMAT = 'HH:mm:ss'
const DEFAULT_DIALOG_WIDTH = 340
const DEFAULT_CLEAR_TEXT = 'CLEAR'
const DEFAULT_OK_TEXT = 'OK'
@Component({})
export default class XDatetimePicker extends Vue {
  @Model('input', { default: false })
  value: any

  @Prop({ default: false }) onlyIcon?: any
  @Prop({ default: '' }) label?: string
  @Prop({ default: true }) outlined?: boolean
  @Prop({ default: true }) clearable?: boolean | string
  @Prop({ default: true }) hideDetails?: boolean
  @Prop({ default: false }) solo?: boolean
  @Prop({ default: false }) loading?: boolean
  @Prop({ default: false }) disabled?: boolean | string
  @Prop({ default: false }) readonly?: boolean | string
  @Prop({ default: false }) required?: boolean | string
  @Prop({ default: () => [] }) rules?: any
  @Prop({ default: DEFAULT_DIALOG_WIDTH }) dialogWidth?: string
  @Prop({ default: DEFAULT_DATE_FORMAT }) dateFormat?: string
  @Prop({ default: DEFAULT_TIME_FORMAT }) timeFormat?: string
  @Prop({ default: DEFAULT_CLEAR_TEXT }) clearText?: string
  @Prop({ default: DEFAULT_OK_TEXT }) okText?: string
  @Prop() textFieldProps?: any
  @Prop() datePickerProps?: any
  @Prop() timePickerProps?: any
  display = false
  activeTab = 0
  date = DEFAULT_DATE
  time = DEFAULT_TIME
  validateRules: any = ValidateRules
  @Watch('value')
  valueChange() {
    this.init()
  }

  mounted() {
    this.init()
  }

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

  get valueFormat() {
    return this.dateFormat + ' ' + this.timeFormat
  }

  get defaultvalueFormat() {
    return DEFAULT_DATE_FORMAT + ' ' + DEFAULT_TIME_FORMAT
  }

  get formattedvalue() {
    return this.selectedvalue
      ? moment(this.selectedvalue).format(this.valueFormat)
      : ''
  }

  get selectedvalue() {
    if (this.date && this.time) {
      let valueString = this.date + ' ' + this.time
      if (this.time.length === 5) {
        valueString += ':00'
      }

      return moment(valueString, this.defaultvalueFormat)
    } else {
      return null
    }
  }

  get dateSelected() {
    return !this.date
  }

  init() {
    if (!this.value) {
      return
    }
    let initvalue: any

    if (this.value instanceof Date) {
      initvalue = this.value
    } else if (typeof this.value === 'string' || this.value instanceof String) {
      // see https://stackoverflow.com/a/9436948
      initvalue = moment(String(this.value), this.valueFormat)
    }

    this.date = moment(initvalue).format(DEFAULT_DATE_FORMAT)
    this.time = moment(initvalue).format(DEFAULT_TIME_FORMAT)
  }

  okHandler() {
    this.resetPicker()
    // this.$emit("input", this.selectedvalue);
    this.$emit('input', this.formattedvalue)
    this.$emit('change', this.formattedvalue)
  }

  clearHandler() {
    this.resetPicker()
    if (!this.value) {
      this.date = DEFAULT_DATE
      this.time = DEFAULT_TIME
    } else {
      this.init()
    }

    this.$emit('input', this.value)
    this.$emit('change', this.value)
  }

  resetPicker() {
    this.display = false
    this.activeTab = 0
    if (this.$refs.timer) {
      const timer: any = this.$refs.timer
      timer.selectingHour = true
    }
  }

  showTimePicker() {
    this.activeTab = 1
  }
}
</script>
