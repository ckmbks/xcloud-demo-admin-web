<template>
  <div class="bg-area v_table_view_box">
    <v-sheet ref="topArea" :class="isTwoLine ? '' : 'd-flex'">
      <x-filter
        class="pt-3"
        @search="search"
        @calculateIsTwoLine="calculateIsTwoLine"
        v-if="$scopedSlots.searchParam"
        :showBtnSize="showBtnSize"
        @reset="resetSearch"
        :sync-is-two-line.sync="isTwoLine"
      >
        <slot name="searchParam" />
      </x-filter>
      <v-spacer></v-spacer>
      <v-sheet
        v-if="$scopedSlots.actions"
        :class="isTwoLine ? 'd-flex' : 'pt-3 d-flex'"
      >
        <v-spacer></v-spacer>
        <v-sheet
          ref="actions"
          class="d-inline-flex pb-3 align-center justify-end"
        >
          <slot name="actions" />
        </v-sheet>
      </v-sheet>
    </v-sheet>
    <v-data-table
      ref="table"
      v-model="selectArr"
      :headers="tableHeaders"
      :options.sync="options"
      :items="pageData.searchResults"
      :height="height"
      hide-default-footer
      fixed-header
      :must-sort="disableSort"
      :disable-sort="disableSort"
      :multi-sort="sort"
      class="border-noShadow mx-3"
      :class="{
        'show-left-fixed': leftFixed,
        'show-right-fixed': rightFixed
      }"
      :show-expand="showExpand"
      :expanded.sync="expanded"
      @input="changSelected"
      @item-selected="selectItem"
      @toggle-select-all="selectAll"
      @update:sort-desc="updateSortDesc"
      :loading="loading"
      :show-select="isSelect"
      loading-text="加载中，请稍等..."
      :items-per-page="999999"
      :item-key="itemKey"
      v-bind="$attrs"
    >
      <template
        v-for="ele in tableHeaders"
        v-slot:[ele.slotName]="{ item, index }"
      >
        <slot
          v-if="ele.slotName"
          :name="ele.value"
          :item="item"
          :index="index"
        />
      </template>
      <template
        v-if="$scopedSlots.item || $slots.item"
        v-slot:item="{ item, headers, index }"
      >
        <slot name="item" :item="item" :headers="headers" :index="index" />
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <slot name="expanded-item" :item="item" :headers="headers" />
      </template>
      <template v-slot:top>
        <slot name="top"></slot>
      </template>
      <template v-slot:footer>
        <slot name="footer"></slot>
      </template>
    </v-data-table>
    <v-sheet
      class="d-flex justify-center align-center py-3"
      v-if="!isPageHide && pageData.totalElements"
    >
      <v-sheet
        v-if="!simplePagination"
        class="d-none d-md-flex align-center pr-5"
      >前往
        <v-text-field
          class="pagination-form samll-form-item mx-2"
          style="width: 70px"
          v-model="stringPageIndex"
          type="number"
          dense
          hide-details
          solo
          flat
          @change="gotoPageIndex"
        />
        页
      </v-sheet>
      <v-sheet>
        <v-pagination
          v-model="syncPageParams.pageIndex"
          :length="pageData.totalPages"
          :page="syncPageParams.pageIndex"
          @next="refresh"
          @previous="refresh"
          @input="refresh"
          class="tablePagnination"
          :total-visible="simplePagination ? '5' : '5'"
        />
      </v-sheet>
      <v-sheet
        v-if="!simplePagination"
        class="d-none d-md-block pl-5 pr-2"
        style="text-align: right"
      >共{{ pageData.totalElements }}条
      </v-sheet>
      <v-sheet
        v-if="!simplePagination"
        class="d-none d-md-block pr-0"
        width="120"
      >
        <v-select
          dense
          hide-details
          :items="pageSizes"
          v-model="syncPageParams.pageSize"
          @change="pageSizeChange"
          solo
          flat
          class="pagination-form samll-form-item"
        ></v-select>
      </v-sheet>
    </v-sheet>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, PropSync, Vue } from 'vue-property-decorator'
import IPageData from '@/components/table/IPageData'
import IPageParams from '@/components/table/IPageParams'
@Component({
  // components: { DataFilter },
})
export default class XTableView extends Vue {
  mounted() {
    this.$nextTick(() => {
      // 判断是否有横向滚动条
      const tableDom = this.tableDom
      if (tableDom && this.hasFixedCol) {
        tableDom.addEventListener('scroll', this.tableScrollListener)
      }
    })

    this.refresh()
    this.resetPageParams = { ...this.syncPageParams }
  }

  tableScrollListener(e: any) {
    this.cellFixedEvent(e.target)
  }

  cellFixedEvent(dom: any) {
    if (!this.hasFixedCol)
      return
    // 横向滚动条触顶
    if (dom.scrollLeft > 0) {
      this.leftFixed = true
    } else {
      this.leftFixed = false
    }
    // 横向滚动条触底
    if (dom.scrollLeft === dom.scrollWidth - dom.clientWidth) {
      this.rightFixed = false
    } else {
      this.rightFixed = true
    }
  }

  beforeDestroy() {
    const tableDom = this.tableDom
    if (tableDom && this.hasFixedCol) {
      tableDom.removeEventListener('scroll', this.tableScrollListener)
    }
  }

  get tableDom(){
    return this.$refs.table.$el.getElementsByClassName(
      'v-data-table__wrapper'
    )[0]
  }

  @Prop({ default: [] })
  headers!: Array<any>

  leftFixed: boolean = false
  rightFixed: boolean = false
  hasFixedCol: boolean = false

  get tableHeaders() {
    const ary: any[] = []
    let countFixedLeft = 0
    let countFixedRight = 0
    this.headers.forEach((item: any) => {
      if (item.fixed && !this.hasFixedCol) {
        this.hasFixedCol = true
      }
      if (item.fixed === 'left') countFixedLeft++
      if (countFixedLeft > 1) {
        throw Error('left fixed column can only be set once ')
      }
      if (item.fixed === 'right') countFixedRight++
      if (countFixedRight > 1) {
        throw Error('right fixed column can only be set once ')
      }
      const obj = item.fixed
        ? {
          ...item,
          class: `fixed-${item.fixed} ${item.class || ''}`,
          cellClass: `fixed-${item.fixed} ${item.cellClass || ''}`
        }
        : {
          ...item
        }
      if (!item.hide) ary.push(obj)
    })
    return ary
  }

  @Prop({ default: false })
  sort?: boolean

  @Prop({ default: false })
  disableSort?: boolean

  @Prop({ default: false })
  isPageHide?: boolean

  @Prop({ default: false })
  isSelect?: boolean

  @Prop({ default: false })
  showExpand?: boolean

  @PropSync('isExpanded')
  expanded?: any

  @PropSync('selectableArr')
  selectArr?: any[]

  @Prop({ default: undefined })
  height?: number | string

  @Prop({ default: 'xhId' })
  itemKey?: any

  isTwoLine = false

  $refs!: {
    actions: HTMLFormElement
    topArea: HTMLFormElement
    table: HTMLFormElement
  }

  calculateIsTwoLine(totalWidth: number) {
    const actionsWidth: number = this.$refs.actions
      ? this.$refs.actions.$el.clientWidth
      : 0
    const topAreaWidth: number = this.$refs.topArea
      ? this.$refs.topArea.$el.clientWidth
      : 0
    this.isTwoLine = actionsWidth + totalWidth > topAreaWidth
  }

  @Prop()
  pageData!: IPageData

  @Prop()
  doSearch?: () => void

  @Prop()
  resetCondtiion?: () => void

  @PropSync('pageParams')
  syncPageParams!: IPageParams

  @Prop({ default: false })
  simplePagination?: boolean

  @Prop({ default: 5 })
  showBtnSize?: any // 多少个显示折叠/展开

  loading = false
  options: any = {}
  resetPageParams!: IPageParams
  pageSizes = [
    { text: '5条/页', value: 5 },
    { text: '10条/页', value: 10 },
    { text: '20条/页', value: 20 },
    { text: '50条/页', value: 50 }
  ]

  async resetSearch() {
    if (this.resetCondtiion && typeof this.resetCondtiion === 'function') {
      this.resetCondtiion()
    } else {
      this.syncPageParams = { ...this.resetPageParams }
      await this.refresh()
    }
  }

  public async search(unResetPageIndex = false) {
    if (!unResetPageIndex) {
      this.syncPageParams.pageIndex = 1
      this.stringPageIndex = '1'
    }
    await this.refresh()
  }

  public async refresh() {
    try {
      this.loading = true
      if (
        this.syncPageParams.pageIndex < 1 ||
        this.syncPageParams.pageIndex > this.pageData.totalPages
      ) {
        this.syncPageParams.pageIndex = 1
        this.stringPageIndex = '1'
      }
      if (undefined !== this.doSearch) await this.doSearch()
      const tableDom = this.tableDom
      this.cellFixedEvent(tableDom)
      // await this.$vuetify.goTo(0)
    } catch (e) {
      console.log(e)
      throw e
    } finally {
      this.loading = false
    }
  }

  // 默认只允许单行排序
  updateSortDesc(sortDesc: boolean[]) {
    if (this.options.sortBy.length === 0) {
      this.syncPageParams.sortBy = ''
    } else {
      this.syncPageParams.sortBy = this.options.sortBy[0]
      this.syncPageParams.sortDesc = this.options.sortDesc[0]
    }
    this.search()
  }

  stringPageIndex = '1'

  @Watch('pageParams.pageIndex')
  watchPageIndex(value: number) {
    this.stringPageIndex = String(value)
  }

  changSelected(item: any) {
    this.$emit('selectData', item)
  }

  pageSizeChange() {
    this.syncPageParams.pageIndex = 1
    this.refresh()
  }

  gotoPageIndex() {
    this.syncPageParams.pageIndex = Number(this.stringPageIndex)
    this.refresh()
  }

  @Watch('selectArr')
  showSelected() {
    this.$emit('getSelected', this.selectArr)
  }

  selectList: any = {}

  selectChange() {
    const items = []
    for (const key in this.selectList) {
      if (Object.prototype.hasOwnProperty.call(this.selectList, key)) {
        const item = this.selectList[key]
        items.push(item)
      }
    }
    this.$emit('selectChange', { items })
  }

  selectItem(val: any) {
    this.$emit('selectItem', val)
    const itemKey = this.itemKey
    if (typeof val === 'object' && val.item) {
      const item: any = val.item
      if (this.selectList[item[itemKey]]) {
        delete this.selectList[item[itemKey]]
      } else {
        this.selectList[item[itemKey]] = item
      }
    }
    this.selectChange()
  }

  selectAll(val: any) {
    this.$emit('selectAll', val)
    if (typeof val === 'object' && val.items && val.value) {
      const list: any = {}
      const itemKey = this.itemKey
      for (const key in val.items) {
        if (Object.prototype.hasOwnProperty.call(val.items, key)) {
          const item = val.items[key]
          list[item[itemKey]] = item
        }
      }
      this.selectList = list
      this.selectChange()
    } else if (typeof val === 'object' && !val.value) {
      this.selectList = []
      this.selectChange()
    }
  }
}
</script>
<style lang="scss">
.v_table_view_box > div.v-data-table.border-noShadow.mx-3 {
  margin: 0 !important;
}
.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
<style lang="scss" scoped>
.seach_btn {
  height: 40px !important;
  line-height: 40px;
}

.pagination-form {
  border: 1px solid #dcdfe6;
  font-size: 1rem;
  height: 32px;
  line-height: 32px;
  overflow-y: hidden;
  position: relative;
  padding-top: 2.1px; //line-height 不起作用 粗暴处理
}
</style>
<style lang="scss">
.pagination-form.v-text-field.v-text-field--solo.v-input--dense
> .v-input__control {
  min-height: 0px;
}

.pagination-form.v-text-field.v-text-field--solo .v-input__control input {
  //去掉箭头
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }
  // -moz-appearance: textfield;
}

.tablePagnination .v-pagination__navigation,
.tablePagnination .v-pagination__item {
  box-shadow: none;
  border: 1px solid #dcdfe6;
}
.v-data-table__wrapper > table > tbody > tr:hover td {
  background-color: #eee;
}
</style>
<style lang="scss" scoped>
::v-deep .show-right-fixed .fixed-right {
  position: sticky;
  right: 0;
  box-shadow: -5px 0px 10px -5px rgba(0, 0, 0, 0.12);
  background-color: #fff;
}

::v-deep .show-right-fixed .fixed-right:before {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 1px;
  background: rgba(0, 0, 0, 0.12);
  content: '';
}

::v-deep .show-left-fixed .fixed-left {
  position: sticky;
  left: 0;
  box-shadow: 5px 0px 10px -5px rgba(0, 0, 0, 0.12);
  background-color: #fff;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  z-index: 3 !important;
}

::v-deep .show-left-fixed .fixed-left:after {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 1px;
  background: rgba(0, 0, 0, 0.12);
  content: '';
}
</style>
