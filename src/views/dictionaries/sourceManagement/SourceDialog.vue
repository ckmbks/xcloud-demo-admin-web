<template>
  <x-dialog
    ref="dialog"
    :width="500"
    :loading="loading"
    :hide-divider="hideDivider"
    :sync-is-show.sync="isShow"
    :title="mode.toString() + titleLevel"
    @submit="submit"
    @cancel="cancel"
  >
    <template>
      <v-form ref="form" lazy-validation>
        <v-row dense>
          <v-col cols="12">
            <x-text-field
              maxlength="20"
              counter="20"
              label="来源名称"
              v-model="model.title"
              :required="true"
            ></x-text-field>
          </v-col>
          <v-col cols="12">
            <v-radio-group row class="pb-0" v-model="model.roiDisable">
              <template v-slot:label>
                <label class="label-width"
                  ><span class="require-star mr-2">*</span
                  >是否开启ROI汇总:</label
                >
              </template>
              <v-radio class="radio-width" label="关闭" :value="true"></v-radio>
              <v-radio
                class="radio-width"
                label="开启"
                :value="false"
              ></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </v-form>
    </template>
  </x-dialog>
</template>
<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator'
import * as SourceApi from '@/api/uiineeDic/Source'
import XDialog from '@/components/XDialog.vue'
import { PageMode } from '@/components/PageMode'

@Component({
  components: { XDialog }
})
export default class SourceDialog extends Vue {
  @PropSync('syncShowData')
  showData!: any

  @PropSync('syncIsShow')
  isShow!: boolean

  @PropSync('syncId')
  id!: number

  @PropSync('syncHideDivider')
  hideDivider?: boolean

  @PropSync('syncTitleLevel')
  titleLevel?: any

  @PropSync('syncMode')
  mode!: PageMode

  $refs!: {
    dialog: XDialog
    form: HTMLFormElement
  }

  model: any = {
    title: '',
    roiDisable: true
  }

  loading = true

  async mounted() {
    this.model = this.showData
    if (this.mode === PageMode.ADD) {
      this.model.title = ''
      this.model.roiDisable = true
    }
    this.loading = false
  }

  async submit() {
    if (!this.$refs.form.validate()) return

    if (this.mode === PageMode.ADD) {
      await SourceApi.add(this.model)
    } else {
      await SourceApi.update(this.model)
    }
    this.$info(this.mode.toString() + '成功')
    this.$emit('search')
    this.$refs.dialog.hide()
  }

  cancel() {
    this.$emit('search')
    this.$refs.dialog.hide()
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/global.scss';
</style>
