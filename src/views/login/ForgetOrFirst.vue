<template>
  <x-page>
    <v-row>
      <v-col cols="11"></v-col>
      <v-col cols="1">
        <v-btn color="primary" @click="goLogin"> 返回首页 </v-btn>
      </v-col>
    </v-row>
    <div class="all">
      <div></div>
      <v-stepper v-model="e1">
        <v-stepper-header>
          <v-stepper-step :complete="e1 > 1" step="1">
            验证身份
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="e1 > 2" step="2">
            设置新密码
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="3" elevation="0">
            完成
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1" elevation="0">
            <div class="stePanel">
              <v-row>
                <v-col cols="4"></v-col>
                <v-col cols="4">
                  <v-text-field
                    label="请输入手机号码"
                    outlined
                    counter="11"
                    v-model="forgetForm.phone"
                    :rules="[rules.required, rules.telephone]"
                    prepend-inner-icon="mdi-cellphone-basic"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4"></v-col>
                <v-col cols="4">
                  <v-text-field
                    label="请输入短信验证码"
                    :rules="[rules.required]"
                    outlined
                    autocomplete="off"
                    v-model.trim="forgetForm.code"
                    prepend-inner-icon="mdi-android-messages"
                  >
                    <template slot="append">
                      <div class="btnpanel" v-if="status === '0'">
                        <v-btn text depressed color="primary" @click="clickf"
                          >发送验证码
                        </v-btn>
                      </div>
                      <div class="btnpanel" v-if="status === '1'">
                        <v-btn text depressed>
                          {{ btnTitle }}
                        </v-btn>
                      </div>
                      <div
                        class="btnpanel"
                        v-if="status === '2'"
                        @click="clickf"
                      >
                        <v-btn text depressed color="primary"
                          >重发验证码
                        </v-btn>
                      </div>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
            </div>
            <div style="text-align: center;">
              <v-btn color="primary" @click="gotoTwwo" width="200">
                下一步
              </v-btn>
            </div>
          </v-stepper-content>
          <v-stepper-content step="2">
            <div class="stePanel">
              <v-row>
                <v-col cols="4"></v-col>
                <v-col cols="4">
                  <v-text-field
                    label="登录账号"
                    prop="username"
                    outlined
                    v-model="forgetForm.phone"
                    disabled
                    prepend-inner-icon="mdi-account"
                    :rules="[rules.required]"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4"></v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="forgetForm.password1"
                    outlined
                    maxlength="16"
                    counter="16"
                    label="新密码"
                    autocomplete="off"
                    :type="isShowPwd ? 'text' : 'password'"
                    prepend-inner-icon="mdi-lock"
                    :append-icon="isShowPwd ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.password, rules.required]"
                    @keyup.native="value = value.replace(/[^a-z0-9_]/g, '')"
                    @blur="capsTooltip = false"
                    @click:append="isShowPwd = !isShowPwd"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4"></v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="forgetForm.password2"
                    outlined
                    label="确认密码"
                    autocomplete="off"
                    :type="isShowPwd ? 'text' : 'password'"
                    prepend-inner-icon="mdi-lock"
                    :append-icon="isShowPwd ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[
                      rules.password,
                      rules.required,
                      rules.passwordConfirm(
                        forgetForm.password1,
                        forgetForm.password2
                      )
                    ]"
                    @keyup.native="value = value.replace(/[^a-z0-9_]/g, '')"
                    @blur="capsTooltip = false"
                    @click:append="isShowPwd = !isShowPwd"
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
            <div style="text-align: center;">
              <v-btn @click="e1 = 1" style="margin-right: 20px;" width="200">
                上一步
              </v-btn>
              <v-btn color="primary" @click="goToThree" width="200">
                下一步
              </v-btn>
            </div>
          </v-stepper-content>

          <v-stepper-content step="3">
            <div class="stePanel">
              <v-icon color="green" x-large>mdi-checkbox-marked-circle</v-icon>
              <h1>新密码设置完成</h1>
            </div>
            <div style="text-align: center;">
              <v-btn
                width="200"
                color="primary"
                style="margin-right: 20px;"
                @click="goLogin"
              >
                返回首页
              </v-btn>
            </div>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </div>
  </x-page>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ValidateRules } from "@/utils/ValidateRules";
import * as ForgetApi from "@/api/ForgetApi";
import crypto from "crypto";
@Component({
  components: {}
})
export default class ForgetOrFirst extends Vue {
  // 0:展示发送验证码，1展示60s倒计时，2：展示重新发送
  status = "0";
  btnTitle = "";
  isShowPwd: boolean = false;
  e1 = 1;
  rules = ValidateRules;
  elevation = 0;
  forgetForm: any = {
    phone: "",
    code: " ",
    id: "",
    confirmPassword: "",
    newPassword: ""
  };
  password(value: string) {
    const pattern = /^(?![^a-zA-Z]+$)(?!\D+$)/;
    return pattern.test(value) && value.length > 7;
  }

  async gotoTwwo() {
    if (!this.forgetForm.phone) {
      return this.$info("手机号不可为空");
    }
    if (!this.forgetForm.code.trim()) {
      return this.$info("请输入验证码");
    }
    await ForgetApi.authentication(this.forgetForm.phone, this.forgetForm.code);
    this.e1 = 2;
  }
  async goToThree() {
    if (!this.forgetForm.phone) {
      return this.$info("手机号不可为空");
    }
    if (!this.forgetForm.password1) {
      return this.$info("密码不为空");
    }
    if (!this.forgetForm.password2) {
      return this.$info("确认密码不为空");
    }
    if (this.forgetForm.password1 !== this.forgetForm.password2) {
      return this.$info("密码不一致");
    }
    if (!this.password(this.forgetForm.password1)) {
      return this.$info("密码格式不正确，必须为8-16数字＋字母的组合");
    }
    if (!this.password(this.forgetForm.password2)) {
      return this.$info("密码格式不正确，必须为8-16数字＋字母的组合");
    }
    const password_1 = crypto
      .createHash("md5")
      .update(this.forgetForm.password1)
      .digest("hex");
    const password_2 = crypto
      .createHash("md5")
      .update(this.forgetForm.password2)
      .digest("hex");
    await ForgetApi.updatePassword(
      this.forgetForm.phone,
      password_1,
      password_2
    )
    this.e1 = 3
  }
  async clickf() {
    if (!this.forgetForm.phone) return this.$info("请输入手机号");
    this.status = "1";
    this.validateBtn();
    await ForgetApi.getCaptchaByPhone(this.forgetForm.phone);
  }
  async goLogin() {
    this.$router.push({
      path: "/Login"
    });
  }
  validateBtn() {
    //倒计时
    this.btnTitle = "60秒后重试";
    let time = 59;
    let timer = setInterval(() => {
      if (time == 0) {
        clearInterval(timer);
        this.status = "2";
      } else {
        this.btnTitle = time + "秒后重试";
        time--;
      }
    }, 1000);
  }
}
</script>
<style scoped>
.stePanel {
  height: 400px;
  padding: auto;
  margin: auto;
}
.btnpanel {
  position: absolute;
  left: auto;
  right: 0;
  top: 9px;
}
.all {
  text-align: center;
  width: 70%;
  margin: 100px auto;
}
</style>
