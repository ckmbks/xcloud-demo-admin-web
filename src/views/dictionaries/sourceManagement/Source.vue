<template>
  <x-page class fluid>
    <v-sheet outlined class="sheet">
      <v-card flat width="100%">
        <v-row class="py-4 px-4">
          <v-btn color="primary" depressed @click="add(1)">
            <i class="icon i_add"></i>新增一级来源
          </v-btn>
        </v-row>
        <v-treeview
          hoverable
          activatable
          :items="trees"
          :open="openItems"
          item-key="id"
          item-text="title"
          item-children="children"
        >
          <template #append="{ item }">
            <!-- <v-icon class="mr-2" v-if="item.level === 1">mdi-plus</v-icon> -->
            <!-- <v-icon
              class="mr-2"
              v-if="item.level === 2"
              @click="addItem(item, 2)"
              >mdi-plus</v-icon
            > -->
            <!-- <v-icon class="mr-2">mdi-square-edit-outline</v-icon> -->
            <!-- <v-icon class="mr-2" v-if="!item.disable" @click="banItem(item)"
              >mdi-cancel</v-icon
            >
            <v-icon class="mr-2" v-if="item.disable" @click="banItem(item)"
              >mdi-play-circle-outline</v-icon
            >
            <v-icon>mdi-trash-can-outline</v-icon> -->

            <v-btn
              small
              v-if="item.level === 1"
              color="primary"
              outlined
              class="my-1 mr-2"
              @click="addItem(item, 1)"
              >新增</v-btn
            >
            <v-btn
              small
              v-if="item.level === 2"
              @click="addItem(item, 2)"
              color="primary"
              outlined
              class="my-1 mr-2"
              >新增</v-btn
            >
            <v-btn
              small
              color="primary"
              outlined
              class="my-1 mr-2"
              @click="editItem(item)"
              >编辑</v-btn
            >
            <v-btn
              small
              color="primary"
              outlined
              class="my-1 mr-2"
              @click="deleteItem(item)"
              >删除</v-btn
            >
            <v-btn
              small
              color="primary"
              outlined
              class="my-1 mr-2"
              @click="banItem(item)"
              >{{ item.disable ? '启用' : '禁用' }}</v-btn
            >
            <v-btn
              small
              color="primary"
              outlined
              class="my-1 mr-2"
              @click="changeROI(item)"
              >{{ item.roiDisable ? '开启ROI' : '关闭ROI' }}</v-btn
            >
          </template>
        </v-treeview>
      </v-card>
    </v-sheet>
    <source-dialog
      v-if="sources.isShow"
      :sync-is-show.sync="sources.isShow"
      :sync-mode.sync="sources.mode"
      :sync-id.sync="sources.id"
      :sync-hide-divider.sync="sources.hideDivider"
      :sync-show-data="sources.data"
      :sync-title-level.sync="sources.title"
      @search="getTreeData"
    ></source-dialog>
    <x-dialog
      ref="dialog"
      :width="600"
      :title="dialogs.title"
      :sync-is-show.sync="isShowDialog"
      @submit="confirm(dialogs)"
      @cancel="cancel"
    >
      <div>{{ dialogs.text }}</div>
    </x-dialog>
  </x-page>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { PageMode } from '@/components/PageMode'
import * as SourceApi from '@/api/uiineeDic/Source'
import SourceDialog from './SourceDialog.vue'

@Component({
  components: { SourceDialog }
})
export default class Source extends Vue {
  trees: any = []

  items: any = []
  openItems: any = []
  sources: any = {
    data: {},
    id: null,
    title: '',
    isShow: false,
    hideDivider: false,
    mode: PageMode.ADD
  }

  isShowDialog: any = false
  dialogs: any = {
    type: 'ban',
    title: '禁用',
    text: '您确认禁用该来源吗？'
  }

  created() {
    this.getTreeData()
  }

  async getTreeData() {
    this.items = await SourceApi.getAll()
    this.trees = this.formmat(
      JSON.parse(JSON.stringify(this.items)),
      'parentId',
      'id',
      'children'
    )
  }

  addItem(item: any, num: any) {
    const params: any = {
      level: item.level + 1,
      title: '',
      parentId: item.id
    }
    this.add(params, num)
  }

  add(item: any, num: any) {
    this.sources.mode = PageMode.ADD
    if (item === 1) {
      this.sources.data = {
        level: 1,
        title: '',
        parentId: 0
      }
      this.sources.title = '一级来源'
    } else {
      this.sources.title = num === 1 ? '二级来源' : '三级来源'
      this.sources.data = item
    }
    this.sources.isShow = true
  }

  changeROI(item: any) {
    this.dialogs = {
      type: 'ROI',
      id: item.id,
      disable: item.roiDisable ? 0 : 1,
      title: item.roiDisable ? '开启' : '关闭',
      text: item.roiDisable ? '您确认开启ROI吗' : '您确认关闭ROI吗？'
    }
    this.isShowDialog = true
  }

  banItem(item: any) {
    this.dialogs = {
      type: 'ban',
      id: item.id,
      disable: item.disable ? 0 : 1,
      title: item.disable ? '启用' : '禁用',
      text: item.disable ? '您确认启用该来源吗' : '您确认禁用该来源吗？'
    }
    this.isShowDialog = true
  }

  editItem(item: any) {
    console.log('item=', item)
    if (item.level === 1) this.sources.title = '一级来源'
    if (item.level === 2) this.sources.title = '二级来源'
    if (item.level === 3) this.sources.title = '三级来源'
    this.sources.mode = PageMode.EDIT
    this.sources.isShow = true
    this.sources.data = item
  }

  deleteItem(item: any) {
    this.dialogs = {
      type: 'del',
      id: item.id,
      title: '删除',
      text: '您确认删除该来源吗？'
    }
    if (item.children && item.children.length) {
      this.$info('层级下有挂载数据不可直接删除哦')
      return
    }
    this.isShowDialog = true
  }

  async confirm(item: any) {
    this.isShowDialog = false
    if (item.type === 'ban') {
      const request: any = {
        id: item.id,
        disable: item.disable
      }
      await SourceApi.ban(request)
      const msg: any = item.disable ? '禁用成功' : '启用成功'
      this.$info(msg)
    } else if (item.type === 'ROI') {
      console.log(item)
      const request: any = {
        id: item.id,
        disable: !!item.disable
      }
      await SourceApi.updateRoiDisable(request)
    } else {
      await SourceApi.del(item.id)
      this.$info('删除成功')
    }
    this.getTreeData()
  }

  cancel() {
    this.isShowDialog = false
  }

  formmat(arrayList: any, pidStr: any, idStr: any, childrenStr: any) {
    const listOjb: any = {} // 用来储存{key: obj}格式的对象
    const treeList: any = [] // 用来储存最终树形结构数据的数组
    // 将数据变换成{key: obj}格式，方便下面处理数据
    for (let i = 0; i < arrayList.length; i++) {
      listOjb[arrayList[i][idStr]] = arrayList[i]
    }
    // 根据pid来将数据进行格式化
    for (let k = 0; k < arrayList.length; k++) {
      // 判断父级是否存在
      const hasParent = listOjb[arrayList[k][pidStr]]
      if (hasParent) {
        // 如果有没有父级children字段，就创建一个children字段
        !hasParent[childrenStr] && (hasParent[childrenStr] = [])
        // 在父级里插入子项
        hasParent[childrenStr].push(arrayList[k])
      } else {
        // 如果没有父级直接插入到最外层
        treeList.push(arrayList[k])
      }
    }
    return treeList
  }
}
</script>
<style scoped></style>
