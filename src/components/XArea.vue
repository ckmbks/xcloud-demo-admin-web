<template>
  <x-cascade
    v-bind="$attrs"
    v-on="$listeners"
    :label="label"
    :getItems="getAreas"
    :sync-first-text.sync="province"
    :sync-first-value.sync="provinceCode"
    :sync-second-text.sync="city"
    :sync-second-value.sync="cityCode"
    :sync-third-text.sync="region"
    :sync-third-value.sync="regionCode"
    item-text="name"
    item-value="code"
    item-parent-value="parentCode"
    :required="required"
    :actions="actions"
    :clearable="clearable"
    @change="change"
    :hide-details="hideDetails"
  >
  </x-cascade>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator'
import AreaApi from '@/api/AreaApi'

@Component({})
export default class XArea extends Vue {
  @Prop({ default: '地区' })
  label?: string

  @PropSync('syncProvince')
  province!: string

  @PropSync('syncProvinceCode')
  provinceCode!: string

  @PropSync('syncCity')
  city!: string

  @PropSync('syncCityCode')
  cityCode!: string

  @PropSync('syncRegion')
  region!: string

  @PropSync('syncRegionCode')
  regionCode!: string

  @Prop({ default: false })
  actions?: boolean | string

  @Prop({ default: false })
  clearable?: boolean | string

  @Prop({ default: false })
  required?: boolean | string

  @Prop({ default: false }) hideDetails?: boolean | string
  getAreas() {
    return AreaApi.geAll()
  }

  change() {
    this.$emit('change')
  }
}
</script>
