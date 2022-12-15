<template>
  <x-dialog
    ref="dialog"
    :loading="loading"
    :sync-is-show.sync="isShow"
    @submit="submit"
    :width="500"
    :hide-divider="hideDivider"
    :title="mode.toString() + '配置'"
  >
    <template>
      <v-form ref="form" lazy-validation>
        <v-row dense>
          <v-col cols="12">
            <x-text-field
              maxlength="50"
              counter="50"
              label="所属分类"
              v-model="model.dictTypeNm"
              :required="true"
              readonly
            ></x-text-field>
          </v-col>
          <v-col cols="12">
            <x-text-field
              maxlength="50"
              counter="50"
              label="名称"
              v-model="model.title"
              :required="true"
            ></x-text-field>
          </v-col>
        </v-row>
      </v-form>
    </template>
  </x-dialog>
</template>
<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator'
import XDialog from '@/components/XDialog.vue'
import { PageMode } from '@/components/PageMode'
import { ValidateRules } from '@/utils/ValidateRules'
import * as DicApi from '@/api/DicApi'

@Component({
  components: { XDialog }
})
export default class DicDialog extends Vue {
  @PropSync('syncShowData')
  showData!: any

  @PropSync('syncIsShow')
  isShow!: boolean

  @PropSync('syncHideDivider')
  hideDivider?: boolean

  @PropSync('syncId')
  id!: number

  @PropSync('syncMode')
  mode!: PageMode

  $refs!: {
    dialog: XDialog
    form: HTMLFormElement
  }

  rules = ValidateRules
  loading = true
  allBigArr: any = []
  model: any = {}

  async mounted() {
    this.model = this.showData
  
    if (this.mode !== PageMode.ADD) {
      this.model = JSON.parse(JSON.stringify(this.showData))
      // this.model = await RoleApi.getById(this.id);
    }
    this.loading = false
  }

  async submit() {
    if (!this.$refs.form.validate()) return
    if (this.mode === PageMode.ADD) {
      const add = {
        dictTypeId: this.model.dictTypeId,
        title: this.model.title
      }
      await DicApi.add(add)
    } else {
      await DicApi.update(this.model)
    }
    this.$info(this.mode.toString() + '成功')
    this.$emit('search')
    this.$refs.dialog.hide()
  }
}
</script>
