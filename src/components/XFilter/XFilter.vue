<template>
  <v-row class="x_filter" ref="filter" :class="XFClass">
    <slot></slot>
    <x-filter-item
      ref="searchFilter"
      class="no_hide d-flex align-center"
      width="220"
    >
      <v-btn class="seach_btn" color="primary" depressed @click="search">
        <v-icon size="18">mdi-magnify</v-icon>
        搜索
      </v-btn>
      <v-btn
        v-if="(!$vuetify.breakpoint.xs && limitSize !== 1) || isFolded"
        class="seach_btn ml-3"
        outlined
        color="primary"
        depressed
        @click="reset"
        width="60"
        min-width="60"
      >
        重置
      </v-btn>
      <v-btn
        v-if="!isFolded && spreadable"
        text
        class="ml-2 px-1"
        color="primary"
        @click="isFolded = true"
      >
        <span>展开</span>
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
      <v-btn
        v-else-if="spreadable"
        text
        class="ml-2 px-1"
        color="primary"
        @click="isFolded = false"
      >
        <span>折叠</span>
        <v-icon>mdi-chevron-up</v-icon>
      </v-btn>
    </x-filter-item>
    <!-- <v-col cols="12" sm="2" class="d-flex pl-0"></v-col> -->
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator'

@Component({})
export default class XFilter extends Vue {
  @PropSync('syncIsTwoLine')
  isTowLine!: boolean

  @Prop({ default: 1 })
  showBtnSize?: any // 多少个显示折叠/展开

  $refs!: {
    filter: HTMLFormElement
    searchFilter: HTMLFormElement
  }

  limitSize = 5
  isFolded = false

  get XFClass() {
    const obj: any = {
      spread: this.spreadable,
      active: this.isFolded
    }
    obj['limit' + this.limitSize] = true
    return obj
  }

  spreadable = false
  setSpreadable() {
    const def: any = this.$slots.default
    const length = def.length || 1
    this.spreadable = length > this.limitSize
  }

  async getLimit() {
    let totalWidth = this.$refs.searchFilter.$el.clientWidth
    const slots: any[] = this.$slots.default || []
    for (let idx = 0; idx < slots.length; idx++) {
      const elm = slots[idx].elm

      totalWidth += Number(elm.dataset?.width)
    }

    await this.$emit('calculateIsTwoLine', totalWidth)
    let limitSize = 1
    const boxWidth = this.$refs.filter.clientWidth
    totalWidth = this.$refs.searchFilter.$el.clientWidth
    for (let idx = 0; idx < slots.length; idx++) {
      const elm = slots[idx].elm
      if (elm.dataset?.width) {
        totalWidth += Number(elm.dataset?.width)
      }
      if (boxWidth > totalWidth) {
        limitSize = idx + 1
      } else {
        break
      }
    }
    if (boxWidth > totalWidth) limitSize = slots.length
    if (slots.length <= this.showBtnSize) limitSize = this.showBtnSize
    if (this.$vuetify.breakpoint.xs) limitSize = 1
    this.limitSize = limitSize || 1
    this.setSpreadable()
    // this.spreadable = totalWidth > this.filter.offsetWidth
  }

  async mounted() {
    await window.addEventListener('resize', this.getLimit)
    this.getLimit()
  }

  destroyed() {
    window.removeEventListener('resize', this.getLimit)
  }

  search() {
    this.$emit('search')
  }

  reset() {
    this.$emit('reset')
  }
}
</script>
<style lang="scss" scope>
.seach_btn {
  //height: 40px !important;
}

.x_filter {
  width: 100%;
  overflow-x: hidden;
  //margin-bottom: 7px;
  flex-wrap: nowrap;
  &.active {
    flex-wrap: wrap;

    > .xf_item {
      flex-grow: 0;
    }
  }
}

@for $i from 1 through 10 {
  .x_filter.limit#{$i} {
    > .xf_item:nth-child(n + #{$i + 1}) {
      display: none;
    }

    &.active > .xf_item:nth-child(n + #{$i + 1}) {
      display: block;
    }
  }
  .xf_item.no_hide {
    display: flex !important;
  }
}

.x_filter.limit1 {
  > .xf_item {
    min-width: calc(100% - 150px) !important;
  }

  > .xf_item.no_hide {
    min-width: 150px !important;
    width: 150px;
  }

  &.active {
    > .xf_item {
      min-width: 100% !important;
    }

    > .xf_item.no_hide {
      min-width: 100% !important;
      width: 100%;
    }
  }
}
</style>
