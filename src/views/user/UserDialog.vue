<template>
  <x-dialog
    ref="dialog"
    :loading="loading"
    :sync-is-show.sync="isShow"
    :width="600"
    :title="mode.toString() + '用户'"
    @submit="submit"
  >
    <v-form ref="form" lazy-validation>
      <v-row>
        <v-col cols="12" sm="12">
          <x-text-field
            maxlength="20"
            counter="20"
            v-model="model.name"
            label="姓名"
            :required="true"
          ></x-text-field>
        </v-col>
        <v-col cols="12" sm="12">
          <x-text-field
            maxlength="11"
            counter="11"
            :disabled="mode !== '新增'"
            :rules="[rules.mobile]"
            v-model="model.phone"
            :required="true"
            label="手机号"
          ></x-text-field>
        </v-col>
        <v-col cols="12" sm="12">
          <x-password-field
            autocomplete="new-password"
            maxlength="16"
            counter="16"
            :required="mode === '新增'"
            v-model="model.inputPassword"
            :label="mode === '新增' ? '密码' : '密码放空表示不修改密码'"
            placeholder="8-16数字＋字母的组合"
            :rules="[rules.password]"
          ></x-password-field>
        </v-col>
        <v-col cols="12" sm="12">
          <x-text-field
            maxlength="50"
            counter="50"
            v-model="model.email"
            :rules="[rules.email]"
            label="邮箱"
          ></x-text-field>
        </v-col>
        <v-col cols="12">
          <x-select
            clearable
            hide-details
            :multiple="true"
            :chips="true"
            v-model="model.roleIds"
            :items="roles"
            item-text="name"
            item-value="id"
            label="角色"
          ></x-select>
        </v-col>
      </v-row>
    </v-form>
  </x-dialog>
</template>
<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator'
import XDialog from '@/components/XDialog.vue'
import * as UserApi from '@/api/UserApi'
import * as RoleApi from '@/api/RoleApi'
import { PageMode } from '@/components/PageMode'
import { ValidateRules } from '@/utils/ValidateRules'
import crypto from 'crypto'

@Component({
  components: { XDialog }
})
export default class UserDialog extends Vue {
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

  rules = ValidateRules
  loading = true
  model: any = {
    name: '',
    inputPassword: '',
    password: '',
    phone: '',
    email: '',
    roleIds: []
  }

  roles: any = []

  async mounted() {
    this.roles = await RoleApi.getOptionList()
    if (this.mode != PageMode.ADD) {
      this.model = await UserApi.getById(this.id)
    }
    this.loading = false
  }

  async submit() {
    if (!this.$refs.form.validate()) return
    if (
      this.model.inputPassword !== null &&
      this.model.inputPassword !== '' &&
      this.model.inputPassword !== undefined
    ) {
      const password = crypto
        .createHash('md5')
        .update(this.model.inputPassword)
        .digest('hex')
      this.model.password = password
    }
    if (this.mode == PageMode.ADD) {
      await UserApi.add(this.model)
    } else {
      await UserApi.update(this.model)
    }

    this.$info(this.mode.toString() + '成功')
    this.$emit('search')
    this.$refs.dialog.hide()
  }
}
</script>
