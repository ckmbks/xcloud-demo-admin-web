<template>
  <div class="d-flex">
    <v-menu
      ref="menu"
      v-model="isShowMenu"
      :close-on-content-click="false"
      :disabled="disabled || readonly"
      transition="scale-transition"
      min-width="360px"
      offset-y
      :nudge-bottom="!hideDetails ? -22 : 4"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-text-field
          v-model="rangeText"
          :label="label"
          placeholder="请选择时间范围"
          :color="readonly ? 'grey' : ''"
          dense
          :outlined="outlined"
          :solo="solo"
          readonly
          :hide-details="hideDetails"
          :rules="getRules"
          :clearable="clearable && !disabled && !readonly"
          v-on="on"
          v-bind="attrs"
          @focus="init"
          @click:append="isShowMenu = true"
          append-icon="event"
        >
          <template v-slot:prepend-inner>
            <span
              v-if="!disabled && !readonly && required"
              class="require-star lh-30"
              >*</span
            >
            <slot name="prepend-inner" />
          </template>
        </v-text-field>
      </template>
      <v-sheet class="d-flex">
        <v-date-picker
          v-if="isLimited"
          show-adjacent-months
          :first-day-of-week="1"
          v-model="curRangeValue"
          no-title
          scrollable
          :readonly="readonly"
          :min="min"
          :max="max"
          range
          @input="onClick"
          :allowed-dates="limitedDates"
        />
        <v-date-picker
          v-else
          show-adjacent-months
          :first-day-of-week="1"
          v-model="curRangeValue"
          no-title
          scrollable
          :readonly="readonly"
          :min="min"
          :max="max"
          range
          @input="onClick"
        />
        <v-row dense class="pt-2" style="width: 70px">
          <v-col cols="12">
            <v-btn depressed color="primary" outlined small @click="today"
              >今天
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn depressed color="primary" outlined small @click="yesterday"
              >昨天
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn depressed color="primary" outlined small @click="thisWeek"
              >本周
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn depressed color="primary" outlined small @click="lastWeek"
              >上周
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn depressed color="primary" outlined small @click="thisMonth"
              >本月
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn depressed color="primary" outlined small @click="lastMonth"
              >上月
            </v-btn>
          </v-col>
        </v-row>
      </v-sheet>
      <v-sheet class="d-flex align-right">
        <v-spacer />
        <v-btn
          color="primary"
          class="mb-2 mr-4"
          outlined
          depressed
          @click="isShowMenu = false"
        >
          取消
        </v-btn>
        <v-btn
          color="primary"
          depressed
          class="mb-2 mr-2"
          @click="rangeValueChange()"
        >
          确定
        </v-btn>
      </v-sheet>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, PropSync } from 'vue-property-decorator'
import { ValidateRules } from '@/utils/ValidateRules'
import {
  getLastMonth,
  getLastWeek,
  getNowDate,
  getThisMonth,
  getThisWeek,
  getYesterdayDate
} from '@/utils/DateTimeUtil'
import moment from 'moment'

@Component({})
export default class XDatePickerRange extends Vue {
  @Prop({ default: '日期' }) label?: string
  @Prop({ default: '' }) placeholder?: string
  @Prop({ default: false }) disabled?: boolean
  @Prop({ default: true }) outlined?: boolean
  @Prop({ default: true }) hideDetails?: boolean
  @Prop({ default: false }) solo?: boolean
  @Prop({ default: false }) readonly?: boolean
  @Prop({ default: true }) clearable?: boolean
  @PropSync('syncStartDate') startDate: any
  @PropSync('syncEndDate') endDate: any
  @Prop({ default: false }) required?: boolean
  @Prop({ default: '' }) min?: string
  @Prop({ default: '' }) max?: string
  @Prop({ default: () => [] }) rules?: any

  @Prop({ default: 'date' }) type?: string
  @Prop({ default: false }) isLimited?: boolean
  @Prop({ default: () => ({ ymd: 'years', long: 0 }) }) limits?:
    | any
    | Object

  $refs: any
  isShowMenu = false
  validateRules: any = ValidateRules

  curRangeValue: string[] = []

  get getRules() {
    return this.required
      ? [this.validateRules.required, ...this.rules]
      : this.rules
  }

  mounted() {}

  init() {
    if (this.startDate != null && this.startDate !== '') {
      this.curRangeValue[0] = this.startDate
      if (this.endDate != null && this.endDate !== '')
        this.curRangeValue[1] = this.endDate
    } else {
      this.curRangeValue = []
    }
  }

  clear() {
    this.startDate = null
    this.endDate = null
    this.curRangeValue = []
    this.rangeValueChange()
  }

  get rangeText() {
    const array: string[] = []
    if (!this.isShowMenu) {
      if (this.startDate != null && this.startDate !== '')
        array.push(this.startDate)
      if (this.endDate != null && this.endDate !== '') array.push(this.endDate)
    } else if (this.curRangeValue != null) {
      if (this.curRangeValue.length > 0) array.push(this.curRangeValue[0])
      if (this.curRangeValue.length > 1) array.push(this.curRangeValue[1])
    }
    return array.join(' - ')
  }

  set rangeText(val: any) {
    if (val === null || val === '') {
      this.curRangeValue = []
      this.rangeValueChange()
    }
  }

  // 限制可选时间范围，ymd: years,months,days;long:整数
  limitedDates(val: any) {
    const value: any = val.replaceAll('-', '').toString()
    // 当前年月
    const cur =
      this.type === 'month'
        ? moment().format('YYYYMM')
        : moment().format('YYYYMMDD')
    if (this.limits && this.limits.long) {
      let dateDiff = 0
      const m1 = moment(value)
      const m2 = moment(cur)
      dateDiff = m2.diff(m1, this.limits.ymd)
      if (dateDiff > 0) {
        return dateDiff < this.limits.long
      }
    }
    return parseInt(value) <= parseInt(cur)
  }

  rangeValueChange() {
    this.adjustDate()
    this.startDate =
      this.curRangeValue.length > 0 ? this.curRangeValue[0] : null
    this.endDate = this.curRangeValue.length > 1 ? this.curRangeValue[1] : null
    this.$refs.menu.save(this.curRangeValue)
    this.$emit('change')
  }

  onClick() {
    if (this.curRangeValue.length > 1) this.rangeValueChange()
  }

  adjustDate() {
    if (this.curRangeValue.length === 1) {
      this.curRangeValue[1] = this.curRangeValue[0]
      return
    }
    if (this.curRangeValue.length < 2) return
    const aDate = new Date(this.curRangeValue[0])
    const bDate = new Date(this.curRangeValue[1])
    if (aDate.getTime() > bDate.getTime())
      this.curRangeValue = [this.curRangeValue[1], this.curRangeValue[0]]
  }

  today() {
    const date = getNowDate()
    this.curRangeValue = [date, date]
    this.rangeValueChange()
  }

  yesterday() {
    const date = getYesterdayDate()
    this.curRangeValue = [date, date]
    this.rangeValueChange()
  }

  thisWeek() {
    this.curRangeValue = getThisWeek()
    this.rangeValueChange()
  }

  lastWeek() {
    this.curRangeValue = getLastWeek()
    this.rangeValueChange()
  }

  thisMonth() {
    this.curRangeValue = getThisMonth()
    this.rangeValueChange()
  }

  lastMonth() {
    this.curRangeValue = getLastMonth()
    this.rangeValueChange()
  }
}
</script>

<style scoped></style>
