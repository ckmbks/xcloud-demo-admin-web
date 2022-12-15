<template>
  <x-page class fluid>
    <x-table-view
      :headers="headers"
      :page-data="pageData"
      :page-params.sync="pageParams"
      :do-search="doSearch"
      ref="tableView"
    >
      <template slot="actions">
        <v-btn color="primary" class="ml-3" depressed @click="exportExcel">
          <i class="icon i_down"></i>导出
        </v-btn>
      </template>
      <template slot="searchParam">
        <x-filter-item>
          <x-select
            dense
            outlined
            clearable
            hide-details
            v-model="pageParams.type"
            :items="types"
            item-text="name"
            item-value="index"
            label="操作业务"
            @change="search"
          ></x-select>
        </x-filter-item>
        <x-filter-item>
          <x-text-field
            hide-details
            v-model="pageParams.operationType"
            label="操作类型"
            @change="search"
          ></x-text-field>
        </x-filter-item>
        <x-filter-item>
          <x-text-field
            hide-details
            v-model="pageParams.businessKey"
            label="操作对象"
            @change="search"
          ></x-text-field>
        </x-filter-item>
        <x-filter-item width="280">
          <x-date-picker-range
            :sync-start-date.sync="pageParams.beginCreateTime"
            :sync-end-date.sync="pageParams.endCreateTime"
            label="操作时间"
            @change="search"
          ></x-date-picker-range>
        </x-filter-item>
        <x-filter-item>
          <x-text-field
            hide-details
            v-model="pageParams.content"
            label="操作内容"
            @change="search"
          ></x-text-field>
        </x-filter-item>
        <x-filter-item>
          <x-text-field
            hide-details
            v-model="pageParams.creatorName"
            label="操作人"
            @change="search"
          ></x-text-field>
        </x-filter-item>
      </template>
      x
      <template slot="content" slot-scope="scope">
        <template v-for="item in getContentDetails(scope.item)">
          <div>{{ item.toString() }}</div>
        </template>
      </template>
    </x-table-view>
  </x-page>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import XTableView from '@/components/table/XTableView.vue'
import OperationLogApi from '@/api/OperationLogApi'
import { downloadFile, getExportFields } from '@/utils/FileUtil'

@Component({
  components: {}
})
export default class OperationLogList extends Vue {
  headers = [
    { text: '操作业务', value: 'typeName' },
    { text: '操作类型', value: 'operationType' },
    { text: '操作对象', value: 'businessKey' },
    { text: '操作内容', value: 'content', slotName: 'item.content' },
    { text: '操作人', value: 'creatorName' },
    { text: '操作时间', value: 'createTime' },
    { text: '操作ip', value: 'creatorIp' }
  ]

  pageParams: any = {
    pageIndex: 1,
    pageSize: 10
  }

  pageData: any = {}
  types: any[] = []

  async created() {
    this.types = await OperationLogApi.getTypes()
  }

  async doSearch() {
    this.pageData = await OperationLogApi.page(this.pageParams)
  }

  search() {
    this.$refs.tableView.search()
  }

  $refs!: {
    tableView: XTableView
  }

  async exportExcel(item: any) {
    this.pageParams.exportFields = getExportFields(this.headers)
    downloadFile(this, OperationLogApi.exportExcel, this.pageParams)
  }

  getContentDetails(item: any): string[] {
    const content: any[] = JSON.parse(item.content)
    let result: any[] = []
    for (const key in content[0]) {
      if (content.length > 1) {
        result.push(key + "：" + content[0][key] + "【修改为】" + content[1][key])
      } else {
        result.push(key + "：" + content[0][key])
      }
    }
    return result
  }
}
</script>
