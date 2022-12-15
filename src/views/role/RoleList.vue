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
        <v-btn color="primary" class="ml-3" depressed @click="add">
          <i class="icon i_add"></i>新增角色
        </v-btn>
        <v-btn color="primary" class="ml-3" depressed @click="exportExcel">
          <i class="icon i_down"></i>导出
        </v-btn>
      </template>
      <template slot="searchParam">
        <x-filter-item>
          <x-text-field
            hide-details
            v-model="pageParams.name"
            label="名称"
            @change="search"
          ></x-text-field>
        </x-filter-item>
      </template>
      x
      <template slot="ctrl" slot-scope="scope">
        <v-btn
          small
          color="primary"
          outlined
          class="my-1 mr-2"
          @click="edit(scope.item)"
          >编辑</v-btn
        >
        <v-btn
          small
          color="primary"
          outlined
          class="my-1 mr-2"
          @click="showEnableDialog(scope.item)"
        >
          {{ scope.item.disable ? '启用' : '禁用' }}
        </v-btn>
        <v-btn
          small
          color="primary"
          outlined
          class="my-1 mr-2"
          @click="del(scope.item)"
          >删除</v-btn
        >
      </template>
    </x-table-view>
    <role-dialog
      :sync-is-show.sync="roleDialog.isShow"
      :sync-mode.sync="roleDialog.mode"
      :sync-id.sync="roleDialog.id"
      v-if="roleDialog.isShow"
      @search="search"
    >
    </role-dialog>
  </x-page>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import RoleDialog from './RoleDialog.vue'
import * as RoleApi from '@/api/RoleApi'
import XTableView from '@/components/table/XTableView.vue'
import { PageMode } from '@/components/PageMode'
import { downloadFile, getExportFields } from '@/utils/FileUtil'

@Component({
  components: { RoleDialog }
})
export default class RoleList extends Vue {
  headers = [
    { text: '角色名称', value: 'name' },
    { text: '角色说明', value: 'remark' },
    { text: '状态', sortable: false, value: 'status' },
    {
      text: '操作',
      sortable: false,
      fixed: 'right',
      value: 'ctrl',
      slotName: 'item.ctrl'
    }
  ]

  pageParams: any = {
    pageIndex: 1,
    pageSize: 10
  }

  pageData: any = {}

  async doSearch() {
    this.pageData = await RoleApi.getPage(this.pageParams)
  }

  search() {
    this.$refs.tableView.search()
  }

  $refs!: {
    tableView: XTableView
  }

  roleDialog: any = {
    isShow: false,
    mode: PageMode.ADD,
    id: null
  }

  add() {
    this.roleDialog.mode = PageMode.ADD
    this.roleDialog.isShow = true
  }

  del(item: any) {
    const _this = this
    this.$confirm({
      content: '确认删除？该操作无法撤销！',
      confirm: async () => {
        await RoleApi.del(item.id)
        _this.$info('删除成功')
        _this.search()
      }
    })
  }

  edit(item: any) {
    this.roleDialog.mode = PageMode.EDIT
    this.roleDialog.id = item.id
    this.roleDialog.isShow = true
  }

  async exportExcel(item: any) {
    this.pageParams.exportFields = getExportFields(this.headers)
    downloadFile(this, RoleApi.exportExcel, this.pageParams)
    // let data = await RoleApi.exportExcel(this.pageParams);
    // console.log(data)
    // let nowDate = moment(new Date()).format('YYYYMMDD');
    // download(data, nowDate + "项目列表.xlsx");
  }

  showEnableDialog(item: any) {
    const _this = this
    if (item.disable) {
      this.$confirm({
        content: '是否确定启用',
        confirm: async () => {
          await RoleApi.enable(item.id)
          this.$info('启用成功')
          _this.search()
        }
      })
    } else {
      this.$confirm({
        content: '是否确定禁用',
        confirm: async () => {
          await RoleApi.disable(item.id)
          this.$info('禁用成功')
          _this.search()
        }
      })
    }
  }
}
</script>
