<template>
  <x-page class fluid>
    <x-left-right-page :sync-show-bottom.sync="showBottom">
      <template slot="left-panel">
        <v-toolbar flat>
          <x-text-field hide-details maxlength="50" label="名称" v-model="searchnm" @input="searchList"></x-text-field>
        </v-toolbar>
        <v-list-item-group v-model="enableItem" color="primary" dense>
          <v-list-item dense v-for="type in typeArr" :key="type.id" @click="clickType(type)">
            <v-list-item-content>
              <v-list-item-title v-text="type.title"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action dense></v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </template>
      <template slot="right-panel">
        <x-table-view :headers="headers" :page-data="pageData" :page-params.sync="pageParams" ref="tableView"
          :do-search="doSearch">
          <template slot="actions">
            <v-btn color="primary" class="ml-3" depressed @click="add">
              <i class="icon i_add"></i>新增
            </v-btn>
          </template>
          <template slot="disable" slot-scope="scope">
            <v-switch color="primary" v-model="scope.item.disable" inset :true-value="tValue" :false-value="fValue"
              @change="changeStatus(scope.item)"></v-switch>
          </template>
          <template slot="ctrl" slot-scope="scope">
            <v-btn small color="primary" outlined class="my-1 mr-2" @click="edit(scope.item)">
              编辑
            </v-btn>
          </template>
        </x-table-view>
      </template>
    </x-left-right-page>
    <dic-dialog :sync-is-show.sync="DicDialog.isShow" :sync-mode.sync="DicDialog.mode" :sync-id.sync="DicDialog.id"
      :sync-hide-divider.sync="DicDialog.hideDivider" :sync-show-data="DicDialog.data" v-if="DicDialog.isShow"
      @search="searchTwo">
    </dic-dialog>
  </x-page>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import XLeftRightPage from '@/components/XLeftRightPage.vue'
import * as DicApi from '@/api/DicApi'
import { PageMode } from '@/components/PageMode'
import DicDialog from './DicDialog.vue'

@Component({
  components: {
    XLeftRightPage,
    DicDialog
  }
})
export default class DicPage extends Vue {
  showBottom = false
  enableItem = 0 // 选中的二级类目
  chooseItem: any = {} // 选中的一类对象
  typeArr: any = [] // 展示的二类
  searchnm = ''
  tValue = false
  fValue = true
  headers = [
    { text: '序号', sortable: false, value: 'code' },
    { text: '名称', sortable: false, value: 'title' },
    {
      text: '是否启用',
      sortable: false,
      value: 'disable',
      slotName: 'item.disable'
    },
    {
      text: '操作',
      sortable: false,
      value: 'ctrl',
      slotName: 'item.ctrl'
    }
  ]

  DicDialog: any = {
    data: {},
    isShow: false,
    mode: PageMode.ADD,
    id: null,
    hideDivider: false
  }

  pageParams: any = {
    sortBy: 'code',
    sortDesc: false,
    pageIndex: 1,
    pageSize: 10
  }

  pageData: any = {
    content: []
  }

  pageShow = {
    showRightTitle: false,
    showLeftTitle: false,
    height: '85vh'
  }

  created() {
    this.getEnum()
    this.enableItem = 0
  }

  async doSearch() {
    this.pageData = this.getEnum()
  }

  // 初始化展示
  async getEnum() {
    // 获取tab列表
    this.typeArr = await DicApi.getAllDictType()
    sessionStorage.setItem('DICLIST', JSON.stringify(this.typeArr))
    // 获取右侧table

    this.chooseItem = this.typeArr[0]
    this.pageParams.id = this.pageParams.id || this.typeArr[0].id
    this.pageData = await DicApi.getPage(this.pageParams)
  }

  searchList() {
    const list: any = sessionStorage.getItem('DICLIST')
    const arr: any = JSON.parse(list)
    if (
      this.searchnm === null ||
      this.searchnm === undefined ||
      this.searchnm === ''
    ) {
      this.typeArr = arr
    } else {
      const seaNm = this.searchnm
      // this.typeArr = [];
      this.typeArr = arr.filter(function (item: any, index: number, array: []) {
        // 元素值，元素的索引，原数组。
        return item.title.includes(seaNm)
      })
      this.pageData = {}
    }
  }

  async changeStatus(item: any) {
    const _this = this
    this.$confirm({
      content: `是否确定${item.disable ? '禁用' : '启用'}`,
      confirm: async () => {
        await DicApi.updateStatus(item)
        this.$info(`${item.disable ? '禁用' : '启用'}成功`)
      }, cancel: () => {
        item.disable = !item.disable
      }
    })
  }

  async searchTwo() {
    this.pageData = await DicApi.getPage(this.pageParams)
  }

  add() {
    this.DicDialog.data = {
      dictTypeId: this.chooseItem.id,
      dictTypeNm: this.chooseItem.title
    }
    this.DicDialog.mode = PageMode.ADD
    this.DicDialog.isShow = true
  }

  edit(item: any) {
    item.dictTypeId = this.chooseItem.id
    item.dictTypeNm = this.chooseItem.title
    this.DicDialog.data = item
    this.DicDialog.mode = PageMode.EDIT
    this.DicDialog.isShow = true
  }

  // 点击类别列表
  async clickType(item: any) {
    this.showBottom = false
    this.chooseItem = item
    this.pageParams.pageIndex = 1
    this.pageParams.pageSize = 10
    this.pageParams.id = item.id
    this.pageData = await DicApi.getPage(this.pageParams)
  }
}
</script>
<style scoped>

</style>
