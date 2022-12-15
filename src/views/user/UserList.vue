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
          <i class="icon i_add"></i>新增用户
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
            label="姓名"
            @change="search"
          ></x-text-field>
        </x-filter-item>
        <x-filter-item>
          <x-text-field
            hide-details
            v-model="pageParams.phone"
            label="手机号"
            @change="search"
          ></x-text-field>
        </x-filter-item>
        <x-filter-item width="300">
          <x-autocomplete
            multiple
            hide-details
            :items="roleList"
            item-text="name"
            item-value="id"
            v-model="pageParams.roleIds"
            label="角色"
            @change="search"
          ></x-autocomplete>
        </x-filter-item>
      </template>
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
      </template>
    </x-table-view>
    <user-dialog
      :sync-is-show.sync="userDialog.isShow"
      :sync-mode.sync="userDialog.mode"
      :sync-id.sync="userDialog.id"
      v-if="userDialog.isShow"
      @search="search"
    >
    </user-dialog>
  </x-page>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import UserDialog from './UserDialog.vue'
import * as UserApi from '@/api/UserApi'
import * as RoleApi from '@/api/RoleApi'
import XTableView from '@/components/table/XTableView.vue'
import { PageMode } from '@/components/PageMode'
import { download, downloadFile, getExportFields } from '@/utils/FileUtil'

@Component({
  components: { UserDialog }
})
export default class UserList extends Vue {
  headers = [
    { text: '姓名', value: 'name' },
    { text: '手机号', value: 'phone' },
    { text: '角色', value: 'roles', sortable: false },
    { text: '创建时间', value: 'createTime' },
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
    name: '',
    pageIndex: 1,
    pageSize: 10
  }
  pageData: any = {}
  roleList: any[] = []

  async mounted() {
    this.roleList = await RoleApi.getOptionList();
  }

  async doSearch() {
    this.pageData = await UserApi.getPage(this.pageParams)
  }

  search() {
    this.$refs.tableView.search()
  }

  $refs!: {
    tableView: XTableView
  }

  userDialog: any = {
    isShow: false,
    mode: PageMode.ADD,
    id: null
  }

  add() {
    this.userDialog.mode = PageMode.ADD
    this.userDialog.isShow = true
  }

  edit(item: any) {
    this.userDialog.mode = PageMode.EDIT
    this.userDialog.id = item.id
    this.userDialog.isShow = true
  }

  async exportExcel(item: any) {
    this.pageParams.exportFields = getExportFields(this.headers)
    downloadFile(this, UserApi.exportExcel, this.pageParams)
  }

  showEnableDialog(item: any) {
    let _this = this
    if (item.disable) {
      this.$confirm({
        content: '是否确定启用',
        confirm: async () => {
          await UserApi.enable(item.id)
          this.$info('启用成功')
          _this.search()
        }
      })
    } else {
      this.$confirm({
        content: '是否确定禁用',
        confirm: async () => {
          await UserApi.disable(item.id)
          this.$info('禁用成功')
          _this.search()
        }
      })
    }
  }
}
</script>
