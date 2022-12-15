<template>
  <div class="d-flex">
    <v-menu v-if="range" ref="startMenu" v-model="startMenu" :close-on-content-click="false"
      :disabled="disabled || readonly" :return-value.sync="curRangeValue" transition="scale-transition"
      min-width="360px" offset-y :nudge-bottom="!hideDetails ? -22 : 4">
      <template v-slot:activator="{ on }">
        <v-text-field dense v-model="rangeText" :label="label" placeholder="请选择时间范围" :color="readonly ? 'grey' : ''"
          :solo="solo" :rules="getRules" :outlined="outlined" readonly :hide-details="hideDetails"
          :clearable="clearable && !disabled && !readonly" v-on="on" @click:append="startMenu = true"
          @click:clear="clear" @focus="focus" append-icon="event">
          <template v-slot:prepend-inner>
            <span v-if="!disabled && !readonly && required" class="require-star lh-30">*</span>
            <slot name="prepend-inner" />
          </template>
        </v-text-field>
      </template>
      <v-sheet class="d-flex">
        <v-date-picker show-adjacent-months :first-day-of-week="1" v-model="curRangeValue" no-title scrollable
          :readonly="readonly" :min="min" :max="max" :range="range">
        </v-date-picker>
        <v-row dense class="pt-2" style="width: 70px">
          <v-col cols="12">
            <v-btn depressed color="primary" outlined small @click="today">今天
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn depressed color="primary" outlined small @click="yesterday">昨天
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn depressed color="primary" outlined small @click="thisWeek">本周
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn depressed color="primary" outlined small @click="lastWeek">上周
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn depressed color="primary" outlined small @click="thisMonth">本月
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn depressed color="primary" outlined small @click="lastMonth">上月
            </v-btn>
          </v-col>
        </v-row>
      </v-sheet>
      <v-sheet class="d-flex align-right">
        <v-spacer />
        <v-btn color="primary" class="mb-2 mr-4" outlined depressed @click="startMenu = false">
          取消
        </v-btn>
        <v-btn color="primary" depressed class="mb-2 mr-2" @click="rangeValueChange(curRangeValue)">
          确定
        </v-btn>
      </v-sheet>
    </v-menu>
    <v-menu v-else ref="startMenu" v-model="startMenu" :close-on-content-click="false" :disabled="disabled || readonly"
      :return-value.sync="curValue" transition="scale-transition" min-width="290px" offset-y
      :nudge-bottom="!hideDetails ? -22 : 4">
      <template v-slot:activator="{ on }">
        <v-text-field dense v-on="on" v-model="newValue" append-icon="event" :label="label" :placeholder="placeholder"
          :disabled="disabled" :readonly="!isDateInput" :hide-details="hideDetails" :color="readonly ? 'grey' : ''"
          :outlined="outlined" :solo="solo" :rules="getRules" :clearable="clearable && !disabled && !readonly"
          @focus="focus" @click:append="startMenu = true" @change="changeInput" @mousedown="keydown"
          @click:clear="clear">
          <template v-slot:prepend-inner>
            <span v-if="!disabled && !readonly && required" class="require-star lh-30">*</span>
            <slot name="prepend-inner" />
          </template>
        </v-text-field>
      </template>
      <v-date-picker v-if="isLimited" show-adjacent-months :first-day-of-week="1" v-model="curValue"
        :readonly="readonly" no-title scrollable :min="min" :max="max" :type="type" :allowed-dates="limitedDates"
        @change="$refs.startMenu.save(curValue)" />
      <v-date-picker v-else show-adjacent-months :first-day-of-week="1" v-model="curValue" :readonly="readonly" no-title
        scrollable :min="min" :max="max" :type="type" :allowed-dates="handleDisableDate"
        @change="$refs.startMenu.save(curValue)" />
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, PropSync } from 'vue-property-decorator'
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
export default class DatePicker extends Vue {
  @Prop({ default: '日期' }) label?: string
  @Prop({ default: '' }) placeholder?: string
  @Prop({ default: false }) hasEnd?: boolean
  @Prop({ default: false }) disabled?: boolean
  @Prop({ default: false }) range?: boolean
  @Prop({ default: true }) outlined?: boolean
  @Prop({ default: false }) hideDetails?: boolean
  @Prop({ default: false }) solo?: boolean
  @Prop({ default: false }) readonly?: boolean
  @Prop({ default: true }) clearable?: boolean
  @Prop({ default: '' }) value?: string | Array<string>
  @PropSync('start') startDate!: string
  @PropSync('end') endDate!: string
  @Prop({ default: false }) required?: boolean
  @Prop({ default: '' }) min?: string
  @Prop({ default: '' }) max?: string
  @Prop({ default: () => [] }) rules?: any

  @Prop({ default: 'date' }) type?: string
  @Prop({ default: false }) isLimited?: boolean
  @Prop({ default: () => ({ ymd: 'years', long: 0 }) }) limits?:
    | any
    | Object

  @Prop({ default: false }) isDateInput?: boolean // 可以手动输入
  @Prop({ default: () => [] })
  disableDates: any

  public $refs: any
  startMenu = false
  curRangeValue: Array<string> = []
  curValue: string = ''
  newValue: any = ''
  validateRules: any = ValidateRules

  @Watch('value')
  watchValue(val: any) {
    this.newValue = val
  }

  @Watch('newValue')
  watchNewVal(val: any) {
    if (!val) {
      if (this.range) {
        this.curRangeValue = []
      } else {
        this.curValue = ''
      }
    }
  }

  get getRules() {
    return this.required
      ? [this.validateRules.required, ...this.rules]
      : this.rules
  }

  @Watch('curRangeValue')
  curRangeValueChange(val: Array<string>) {
    if (this.range) {
      this.$emit('input', val)
    }
  }

  handleDisableDate(val: any) {
    if (this.disableDates.length) {
      return !this.disableDates.includes(val)
    }
    return true
  }

  // 限制可选时间范围，ymd: years,months,days;long:number
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
      if (dateDiff >= 0) {
        return dateDiff < this.limits.long
      } else {
        return dateDiff <= -1
      }
    }
    return parseInt(value) <= parseInt(cur)
  }

  mounted() {
    this.newValue = this.value
    this.curValue = this.newValue || this.startDate
    if (this.range) {
      if (Array.isArray(this.value) && this.value.length === 2) {
        this.$set(this.curRangeValue, 0, this.value[0] || this.startDate)
        this.$set(this.curRangeValue, 1, this.value[1] || this.endDate)
      } else {
        this.curRangeValue = []
      }
    }
  }

  clear() {
    this.curValue = ''
    this.newValue = ''
    this.curRangeValue = []
    this.startDate = ''
    this.endDate = ''
    let value: any = ''
    if (this.range) {
      value = ['', '']
    }

    this.$emit('afterSelected', value)
    this.$emit('selected', value)
    this.$emit('input', value)
    this.$emit('change', value)
  }

  get rangeText() {
    if (
      this.curRangeValue &&
      this.curRangeValue.length > 0 &&
      this.curRangeValue[0]
    ) {
      return `${this.curRangeValue[0]} ${this.curRangeValue[0] ? '至' : ''} ${this.curRangeValue[1] || ''
        }`
    }
    return ''
  }

  set rangeText(val: any) { }

  rangeValueChange(value: any) {
    if (value.length > 0) {
      if (this.compareDate(value[0], value[1])) {
        value = [value[1], value[0]]
      }
      this.curRangeValue = value
    }
    this.$refs.startMenu.save(value)
    this.$emit('afterSelected', value)
    this.$emit('selected', value)
    this.$emit('change', value)
    this.$emit('update:start', value[0])
    this.$emit('update:end', value[1])
  }

  compareDate(a: string, b: string) {
    const aDate = new Date(a)
    const bDate = new Date(b)
    if (aDate.getTime() >= bDate.getTime()) {
      return true
    } else {
      return false
    }
  }

  @Watch('curValue')
  getCurValue(value: any) {
    if (!value) {
      return
    }
    this.newValue = value
    this.$emit('afertSelected', value)
    this.$emit('selected', value)
    this.$emit('input', value)
    this.$emit('change', value)
  }

  focus() {
    this.$emit('focus')
  }

  today() {
    const date = getNowDate()
    this.curRangeValue = [date, date]
    this.rangeValueChange(this.curRangeValue)
  }

  yesterday() {
    const date = getYesterdayDate()
    this.curRangeValue = [date, date]
    this.rangeValueChange(this.curRangeValue)
  }

  thisWeek() {
    this.curRangeValue = getThisWeek()
    this.rangeValueChange(this.curRangeValue)
  }

  lastWeek() {
    this.curRangeValue = getLastWeek()
    this.rangeValueChange(this.curRangeValue)
  }

  thisMonth() {
    this.curRangeValue = getThisMonth()
    this.rangeValueChange(this.curRangeValue)
  }

  lastMonth() {
    this.curRangeValue = getLastMonth()
    this.rangeValueChange(this.curRangeValue)
  }

  keydown() {
    if (!this.isDateInput) return false
    if (!this.newValue) return false
    const tVal = moment(this.newValue, ['YYYY-MM-DD']).isValid() // 日期是否存在
    const reg = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
    if (!reg.test(this.newValue) || !tVal) {
      this.$error('请输入正确的日期格式,如2020-01-01')
      this.newValue = ''
      return
    }
    this.curValue = this.newValue
  }

  changeInput() {
    if (!this.isDateInput) return false
    if (!this.newValue) return false
    const tVal = moment(this.newValue, ['YYYY-MM-DD']).isValid() // 日期是否存在
    const reg = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
    if (!reg.test(this.newValue) || !tVal) {
      this.$error('请输入正确的日期格式,如2020-01-01')
      this.newValue = ''
      return
    }
    this.curValue = this.newValue
  }
}
</script>
<style scoped>
.controls {
  position: relative;
}
</style>
