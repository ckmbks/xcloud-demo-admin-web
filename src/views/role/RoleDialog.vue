<template>
  <x-dialog
    ref="dialog"
    :loading="loading"
    :sync-is-show.sync="isShow"
    :width="1200"
    :title="mode.toString() + '角色'"
    @submit="submit"
  >
    <template>
      <v-form ref="form" lazy-validation>
        <v-col cols="12" class="pa-0">
          <x-text-field
            maxlength="20"
            counter="20"
            v-model="model.name"
            label="角色名称"
            :rules="[rules.required]"
          ></x-text-field>
        </v-col>
        <v-col cols="12" class="pa-0">
          <x-text-field
            maxlength="100"
            counter="100"
            v-model="model.remark"
            label="角色说明"
          ></x-text-field>
        </v-col>
        <v-radio-group
          class="mt-0"
          hide-details
          v-model="model.roleAuth.admin"
        >
          <v-radio label="系统管理员" :value="true"/>
          <v-radio label="普通用户" :value="false"/>
        </v-radio-group>
        <v-tabs v-show="model.roleAuth.admin === false">
          <v-tab>功能权限</v-tab>
          <v-tab-item>
            <v-sheet class="pt-2">
              <v-btn color="primary" class="ml-3" depressed @click="$refs.treeview.updateAll(true)">全部展开</v-btn>
              <v-btn color="primary" class="ml-3" depressed @click="$refs.treeview.updateAll(false)">全部折叠</v-btn>
            </v-sheet>
            <v-treeview
              v-model="menusCheck"
              hoverable
              selected-color="primary"
              item-children="children"
              item-key="id"
              item-text="name"
              :items="menus"
              selectable
              ref="treeview"
              @input="treeChange"
            >
              <template v-slot:label="{ item }">
                <div class="d-flex align-center">
                  {{ item.name }}
                  <div class="mx-2" v-if="item.buttons.length">--</div>
                  <div class="d-flex flex-wrap">
                    <div :key="v.id" v-for="v in item.buttons" class="mr-2">
                      <v-checkbox
                        hide-details
                        :label="v.name"
                        :value="v.id"
                        v-model="btnsCheck"
                      >
                      </v-checkbox>
                    </div>
                  </div>
                </div>
              </template>
            </v-treeview>
          </v-tab-item>
        </v-tabs>
      </v-form>
    </template>
  </x-dialog>
</template>
<script lang="ts">
import { Component, PropSync, Vue, Watch } from 'vue-property-decorator'
import XDialog from '@/components/XDialog.vue'
import * as RoleApi from '@/api/RoleApi'
import { PageMode } from '@/components/PageMode'
import { ValidateRules } from '@/utils/ValidateRules'
import { asyncRoutesTree } from '@/router/index'

@Component({
  components: { XDialog }
})
export default class RoleDialog extends Vue {
  @PropSync('syncIsShow')
  isShow!: boolean

  @PropSync('syncId')
  id!: number

  @PropSync('syncMode')
  mode!: PageMode

  $refs!: {
    dialog: XDialog
    form: HTMLFormElement
  }

  isAll = true
  rules = ValidateRules
  loading = true
  model: any = {
    name: '',
    remark: '',
    roleAuth: {
      admin: true,
      menuIds: []
    },
    roleDataAuthDTO: {
      dataAuthAllCustomer: true,
      patientSourceIds: []
    }
  }

  menus: any = []
  dataRoles: any = []
  @Watch('isAll')
  change(val: any) {
    this.$set(this.model.roleAuth, 'admin', val)
    this.$set(this.model.roleDataAuthDTO, 'dataAuthAllCustomer', val)
  }

  get btnMap() {
    const map: any = {}
    this.btnsCheck.forEach((item: number) => {
      map[item] = item
    })
    return map
  }

  handleAllCheck(e: any, ary: any) {
    if (e) {
      ary.forEach((item: any) => {
        if (!this.btnsCheck.some((v: number) => v === item.id)) {
          this.btnsCheck.push(item.id)
        }
      })
    } else {
      ary.forEach((item: any) => {
        const i = this.btnsCheck.findIndex((v) => v === item.id)
        this.btnsCheck.splice(i, 1)
      })
    }
  }

  isCheckAll(ary: any) {
    let bol = true
    ary.forEach((item: any) => {
      if (!this.btnMap[item.id]) {
        bol = false
      }
    })
    return bol
  }

  isIndeterminate(ary: any) {
    let bol = false
    ary.forEach((item: any) => {
      if (this.btnMap[item.id]) {
        bol = true
      }
    })
    if (this.isCheckAll(ary)) {
      return false
    }
    return bol
  }

  menusCheck: number[] = []
  btnsCheck: number[] = []
  tempMenusCheck: number[] = []
  flatMenus: any = []
  menuIds: number[] = []
  btnIds: number[] = []
  getFlatMenus() {
    const rec = (arr: any) => {
      arr.forEach((v: any) => {
        this.flatMenus.push(v)
        if (v.children && v.children.length) {
          rec(v.children)
        }
      })
    }
    rec(this.menus)
  }

  // 自动勾选/反选按钮权限
  autoChangeBtns(difference: any, check: boolean = true) {
    const s = new Set(difference)
    this.flatMenus.forEach((item: any) => {
      if (s.has(item.id)) {
        if (check) {
          this.btnsCheck = Array.from(
            new Set([...this.btnsCheck, ...item.buttons.map((v: any) => v.id)])
          )
        } else {
          const ary = item.buttons.map((v: any) => v.id)
          this.btnsCheck = this.difference(this.btnsCheck, ary)
        }
      }
    })
  }

  treeChange(e: number[]) {
    if (e.length > this.tempMenusCheck.length) {
      const difference = this.difference(e, this.tempMenusCheck)
      this.autoChangeBtns(difference, true)
    } else if (e.length < this.tempMenusCheck.length) {
      const difference = this.difference(this.tempMenusCheck, e)
      this.autoChangeBtns(difference, false)
    }
    this.tempMenusCheck = JSON.parse(JSON.stringify(e))
  }

  getIds() {
    const rec = (menus: any) => {
      menus.forEach((item: any) => {
        if (item.children && item.children.length) {
          rec(item.children)
        }
        this.menuIds.push(item.id)
        if (item.buttons && item.buttons.length) {
          item.buttons.forEach((btn: any) => {
            this.btnIds.push(btn.id)
          })
        }
      })
    }
    rec(this.menus)
  }

  //  求交集
  intersection = (a: number[], b: number[]): number[] => {
    const s = new Set(b)
    return [...new Set(a)].filter((x) => s.has(x))
  }

  // 求差集
  difference = (a: number[], b: number[]): number[] => {
    return a.concat(b).filter((v) => a.includes(v) && !b.includes(v))
  }

  getCheckIds(check: any) {
    this.btnsCheck = this.intersection(check, this.btnIds)
    this.menusCheck = this.intersection(check, this.menuIds)
    this.tempMenusCheck = JSON.parse(JSON.stringify(this.menusCheck))
  }

  async mounted() {
    // this.menus = await RoleApi.getSystemMenus()
    this.menus = asyncRoutesTree()
    this.getFlatMenus()
    this.getIds()
    this.getTreeData()

    if (this.mode !== PageMode.ADD) {
      this.model = await RoleApi.getById(this.id)
      const checkList: number[] = JSON.parse(
        JSON.stringify(this.model.roleAuth.menuIds)
      )
      this.getCheckIds(checkList)
    }
    this.loading = false
  }

  async getTreeData() {
    const items = await SourceApi.getAll()
    this.dataRoles = this.formmat(
      JSON.parse(JSON.stringify(items)),
      'parentId',
      'id',
      'children'
    )
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

  async submit() {
    if (!this.$refs.form.validate()) return
    const ary = Array.from(new Set([...this.menusCheck, ...this.btnsCheck]))
    this.model.roleAuth.menuIds = JSON.parse(JSON.stringify(ary))
    console.log(this.model)

    if (
      this.model.roleAuth.admin === false &&
      this.model.roleDataAuthDTO.dataAuthAllCustomer === false &&
      this.model.roleDataAuthDTO.patientSourceIds.length === 0
    ) {
      return this.$error('请选择C端用户管理数据权限')
    }

    if (this.mode === PageMode.ADD) {
      await RoleApi.add(this.model)
    } else {
      await RoleApi.update(this.model)
    }

    this.$info(this.mode.toString() + '成功')
    this.$emit('search')
    this.$refs.dialog.hide()
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
::v-deep .v-input--selection-controls {
  margin-top: 0;
  padding-top: 0;
}

.all-check {
  ::v-deep .theme--light.v-icon {
    color: #089dad;
  }
}
</style>
