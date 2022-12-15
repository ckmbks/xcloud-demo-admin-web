<template>
  <v-dialog v-model="isShow" scrollable width="500" id="ResetPassword">
    <v-skeleton-loader :loading="loading" type="article, actions">
      <v-card>
        <v-card-title class="text-left pb-4">修改密码</v-card-title>
        <v-divider />

        <v-card-text>
          <v-form ref="form" class="login-form" lazy-validation>
            <x-text-field v-model="userNo" label="用户账号" readonly :clearable="false" />
            <x-text-field
              v-model="model.oldPassword"
              label="当前密码"
              counter="25"
              maxlength="25"
              :required="true"
              :type="isShowPwd1 ? 'text' : 'password'"
              :append-icon="isShowPwd1 ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="isShowPwd1 = !isShowPwd1"
              :rules="[rules.required]"
            />
            <x-text-field
              v-model="model.newPassword"
              label="新密码"
              :required="true"
              :type="isShowPwd2 ? 'text' : 'password'"
              :append-icon="isShowPwd2 ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="isShowPwd2 = !isShowPwd2"
              counter="16"
              maxlength="16"
              :rules="[rules.required, rules.password]"
            />
            <x-text-field
              v-model="passwordConfirm"
              label="确认新密码"
              :required="true"
              type="password"
              counter="16"
              maxlength="16"
              :rules="[
                rules.passwordConfirm(model.newPassword, passwordConfirm)
              ]"
            />
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" outlined @click.stop="isShow = false"
          >取消
          </v-btn>
          <v-btn depressed color="primary" @click="resetSubmit">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-skeleton-loader>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator'
import { ValidateRules } from '@/utils/ValidateRules'
import { UserModule } from '@/store/modules/user'
import crypto from 'crypto'

@Component({
  components: {}
})
export default class ResetPassword extends Vue {
  model: any = {
    oldPassword: '',
    newPassword: ''
  }

  passwordConfirm = ''
  userNo = ''
  loading: boolean = true
  rules = ValidateRules
  isShowPwd1: boolean = false
  isShowPwd2: boolean = false

  $refs!: {
    form: HTMLFormElement
  }

  async created() {
    this.userNo = UserModule.userNo
    this.loading = false
  }

  @PropSync('isShowResetPassword')
  public isShow!: boolean

  @Prop()
  id!: number

  async resetSubmit() {
    if (!this.$refs.form.validate()) return
    const oldPwd = crypto
      .createHash('md5')
      .update(this.model.oldPassword)
      .digest('hex')
    const newPwd = crypto
      .createHash('md5')
      .update(this.model.newPassword)
      .digest('hex')
    console.log(newPwd)
    await UserModule.modifyMyPassword({
      oldPassword: oldPwd,
      newPassword: newPwd
    })
    this.$info('修改成功')
    this.isShow = false
  }
}
</script>
