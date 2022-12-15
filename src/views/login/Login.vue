<template>
  <div class="login-container">
    <div class="login-left">
      <div class="logo">
        <v-img
          class="img"
          height="116px"
          width="256px"
          src="~@/assets/images/login/logo-big.png"
        ></v-img>
      </div>
      <div class="lun">
        <v-carousel
          cycle
          :show-arrows="false"
          hide-delimiter-background
          height="260"
          style="border-radius: 20px"
          v-model="lunVal"
        >
          <v-carousel-item
            v-for="(item, i) in items"
            :key="i"
            :src="item.src"
          ></v-carousel-item>
        </v-carousel>
        <div class="text">
          <p class="p1">{{ t1 }}</p>
          <p class="p2">{{ t2 }}</p>
        </div>
      </div>
      <div class="foot">
        <div class="msg">Copyright ©2021 All rights reserved by UIINEE</div>
      </div>
    </div>
    <div class="login-wrap">
      <div class="m-title">
        <v-img
          class="img"
          height="116px"
          width="256px"
          src="~@/assets/images/login/logo-big.png"
        ></v-img>
      </div>
      <v-form ref="loginForm" class="login-form" lazy-validation>
        <div class="title-container">
          <div class="title1">开始使用</div>
          <div class="title2">Hello,欢迎登录后台</div>
        </div>
        <div class="input">
          <v-text-field
            prop="username"
            v-model="loginForm.username"
            append-icon="mdi-account"
            :rules="[rules.required]"
          ></v-text-field>

          <v-text-field
            prop="password"
            v-model="loginForm.password"
            :type="isShowPwd ? 'text' : 'password'"
            append-icon="mdi-lock"
            :rules="[rules.required]"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @click:append="isShowPwd = !isShowPwd"
          ></v-text-field>
          <div class="msg-wrap">
            <v-text-field
              prop="msgcode"
              v-model="loginForm.msgcode"
              label="请输入验证码"
              :rules="[rules.required]"
              @keyup.enter.native="handleLogin"
            ></v-text-field>
            <img
              height="56px"
              src="msgImg"
              alt="验证码"
              @click="_initMsgCode"
            />
          </div>
          <div class="forget">
            <v-btn text color="#3BBACD" @click="goToForget"
              >忘记密码/首次登录
            </v-btn>
          </div>
          <div>
            <v-btn
              rounded
              :loading="loading"
              depressed
              class="login-btn"
              color="#3BBACD"
              @click.native.prevent="handleLogin"
              >登录
            </v-btn>
          </div>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
// import { Route } from 'vue-router'
import { Dictionary } from 'vue-router/types/router'
import * as AccountApi from '@/api/AccountApi'
import { UserModule } from '@/store/modules/user'
import { ValidateRules } from '@/utils/ValidateRules'
import crypto from 'crypto'
import { SettingsModule } from '@/store/modules/settings'

@Component({
  name: 'Login',
  components: {}
})
export default class login extends Vue {
  public $refs: any
  rules = ValidateRules
  isShowPwd: boolean = false

  loginForm = {
    username: '',
    password: '',
    msgcode: ''
  }

  lunVal = 0
  t1 = '来到你的城市为你献上倾城笑容'
  t2 =
    '所有人都喜欢美好的东西，包括牙齿。一口美牙，不仅是一个人的特点，更是一张自信的名片。争取让所有人都能够拥有这般自信，这也是优梨美牙存在的意义。'

  items = [
    // {
    //   src: require('@/assets/images/login/pic1.png')
    // },
    {
      src: require('@/assets/images/login/pic2.png')
    }
  ]

  loading: boolean = false
  capsTooltip: boolean = false
  redirect?: string
  otherQuery: Dictionary<string> = {}
  msgImg: string = ''
  @Watch('lunVal')
  valueChange(val: any) {
    // if (val === 0) {
    //   this.t1 = '优梨美牙厦门旗舰店盛大开业'
    //   this.t2 =
    //     '从初露锋芒到品牌建立，我们翘首以盼，网红牙科优梨甜美登鹭。 优梨美牙品牌发布暨完美大使全国招商会圆满落幕，予以新岁无限明媚。'
    // }
    if (val === 0) {
      this.t1 = '来到你的城市为你献上倾城笑容'
      this.t2 =
        '所有人都喜欢美好的东西，包括牙齿。一口美牙，不仅是一个人的特点，更是一张自信的名片。争取让所有人都能够拥有这般自信，这也是优梨美牙存在的意义。'
    }
  }

  created() {
    this._initMsgCode()
  }

  async _initMsgCode() {
    const data: any = await AccountApi.getImageCaptcha()
    this.msgImg = data.image
  }

  get SettingsModule() {
    return SettingsModule
  }

  checkCapslock(e: KeyboardEvent) {
    const { key } = e
    this.capsTooltip =
      key !== undefined &&
      key !== null &&
      key.length === 1 &&
      key >= 'A' &&
      key <= 'Z'
  }

  async goToForget() {
    this.$router.push({
      path: '/ForgetOrFirst'
    })
  }

  async handleLogin() {
    if (this.$refs.loginForm.validate()) {
      // 获取登录后的用户信息
      const password = crypto
        .createHash('md5')
        .update(this.loginForm.password)
        .digest('hex')
      const userLoginForm = {
        account: this.loginForm.username,
        password: password,
        code: this.loginForm.msgcode
      }

      this.loading = true
      UserModule.Login(userLoginForm)
        .then((data: any) => {
          // 前端有回调地址跳转前端的回调地址，没有就跳后端给的回调地址
          const href: any = this.$route.query.redirect || '/xclouddemoadmin'
          location.href = href
        })
        .catch(() => {
          this._initMsgCode()
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 2560px) {
  .login-container {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: url('~@/assets/images/login/background.png') no-repeat center
      center;
    // background-size: cover;
    display: flex;
    .login-left {
      // width: 240pt;
      width: 480px;
      height: 100%;
      background: #ffffff url('~@/assets/images/login/leftbackground.png')
        no-repeat top center;
      background-size: 100% 100%;
      text-align: center;
      .logo {
        width: 100%;
        .img {
          margin: 80px auto 40px 50px;
        }
      }
      .lun {
        width: 370px;
        margin: auto;
        border-radius: 20px;
        .text {
          color: white;
          padding-top: 20px;
          .p1 {
            font-size: 18px;
          }
          .p2 {
            font-size: 12px;
          }
        }
      }
      .foot {
        position: absolute;
        bottom: 10px;
        width: 440px;

        .msg {
          font-size: 12px;
          color: #ffffff;
          text-align: center;
        }
      }
    }
    .login-wrap {
      display: flex;
      width: 67%;
      text-align: center;
      margin: auto 0;
    }

    .login-form {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      width: 100%;
      margin: auto 15vw;

      .login-btn {
        font-size: 20px;
        width: 170px;
        height: 50px;
        color: #ffffff;
      }
      .input {
        width: 350px;
        margin: auto;
        text-align: center;
      }

      .title-container {
        position: relative;
        width: 600px;
        margin: auto;

        .title1 {
          font-size: 35px;
          color: #262b40;
          margin: 0px auto 10px auto;
          text-align: center;
        }
        .title2 {
          font-size: 50px;
          color: #262b40;
          margin: 0px auto 40px auto;
          text-align: center;
        }
      }

      .msg-wrap {
        display: flex;
      }

      .msgDiv {
        flex: 1;
      }

      .msg-wrap > img {
        margin: 0 0 22px 20px;
        cursor: pointer;
      }
    }

    .pc-title {
      flex: 1;
      color: #bb1c2c;
      height: max-content;
      // margin-top: 178px;

      .zh-title {
        width: 100%;
        margin-bottom: 80px;
        font-size: 26px;
        text-align: center;
        font-weight: bold;
      }

      .en-title {
        width: 100%;
        margin-bottom: 48px;
        font-size: 18px;
        text-align: center;
      }

      .point-text {
        width: 100%;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
      }
    }

    .m-title {
      display: none;
    }
  }
  .forget {
    width: 100%;
    text-align: end;
    margin-top: -30px;
    margin-right: -10px;
    margin-bottom: 20px;
  }
}
@media screen and (max-width: 1920px) {
  .login-container {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: url('~@/assets/images/login/background.png') no-repeat center
      center;
    // background-size: cover;
    display: flex;
    .login-left {
      // width: 240pt;
      width: 480px;
      height: 100%;
      background: #ffffff url('~@/assets/images/login/leftbackground.png')
        no-repeat top center;
      background-size: 100% 100%;
      text-align: center;
      .logo {
        width: 100%;
        .img {
          margin: 80px auto 40px 50px;
        }
      }
      .lun {
        width: 370px;
        margin: auto;
        border-radius: 20px;
        .text {
          color: white;
          padding-top: 20px;
          .p1 {
            font-size: 18px;
          }
          .p2 {
            font-size: 12px;
          }
        }
      }
      .foot {
        position: absolute;
        bottom: 10px;
        width: 440px;

        .msg {
          font-size: 12px;
          color: #ffffff;
          text-align: center;
        }
      }
    }
    .login-wrap {
      display: flex;
      width: 67%;
      text-align: center;
      margin: auto 0;
    }

    .login-form {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      width: 100%;
      margin: auto 15vw;

      .login-btn {
        font-size: 20px;
        width: 170px;
        height: 50px;
        color: #ffffff;
      }
      .input {
        width: 350px;
        margin: auto;
        text-align: center;
      }

      .title-container {
        position: relative;
        width: 600px;
        margin: auto;

        .title1 {
          font-size: 35px;
          color: #262b40;
          margin: 0px auto 10px auto;
          text-align: center;
        }
        .title2 {
          font-size: 50px;
          color: #262b40;
          margin: 0px auto 40px auto;
          text-align: center;
        }
      }

      .msg-wrap {
        display: flex;
      }

      .msgDiv {
        flex: 1;
      }

      .msg-wrap > img {
        margin: 0 0 22px 20px;
        cursor: pointer;
      }
    }

    .pc-title {
      flex: 1;
      color: #bb1c2c;
      height: max-content;
      // margin-top: 178px;

      .zh-title {
        width: 100%;
        margin-bottom: 80px;
        font-size: 26px;
        text-align: center;
        font-weight: bold;
      }

      .en-title {
        width: 100%;
        margin-bottom: 48px;
        font-size: 18px;
        text-align: center;
      }

      .point-text {
        width: 100%;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
      }
    }

    .m-title {
      display: none;
    }
  }
  .forget {
    width: 100%;
    text-align: end;
    margin-top: -30px;
    margin-right: -10px;
    margin-bottom: 20px;
  }
}
@media screen and (max-width: 1440px) {
  .login-container {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: url('~@/assets/images/login/background.png') no-repeat center
      center;
    // background-size: cover;
    display: flex;
    .login-left {
      // width: 240pt;
      width: 480px;
      height: 100%;
      background: #ffffff url('~@/assets/images/login/leftbackground.png')
        no-repeat top center;
      background-size: 100% 100%;
      text-align: center;
      .logo {
        width: 100%;
        .img {
          margin: 80px auto 40px 50px;
        }
      }
      .lun {
        width: 370px;
        margin: auto;
        border-radius: 20px;
        .text {
          color: white;
          padding-top: 20px;
          .p1 {
            font-size: 18px;
          }
          .p2 {
            font-size: 12px;
          }
        }
      }
      .foot {
        position: absolute;
        bottom: 10px;
        width: 440px;

        .msg {
          font-size: 12px;
          color: #ffffff;
          text-align: center;
        }
      }
    }
    .login-wrap {
      display: flex;
      width: 67%;
      text-align: center;
      margin: auto 0;
    }

    .login-form {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      width: 100%;
      margin: auto 15vw;

      .login-btn {
        font-size: 20px;
        width: 170px;
        height: 50px;
        color: #ffffff;
      }
      .input {
        width: 350px;
        margin: auto;
        text-align: center;
      }

      .title-container {
        position: relative;
        width: 600px;
        margin: auto;

        .title1 {
          font-size: 35px;
          color: #262b40;
          margin: 0px auto 10px auto;
          text-align: center;
        }
        .title2 {
          font-size: 50px;
          color: #262b40;
          margin: 0px auto 40px auto;
          text-align: center;
        }
      }

      .msg-wrap {
        display: flex;
      }

      .msgDiv {
        flex: 1;
      }

      .msg-wrap > img {
        margin: 0 0 22px 20px;
        cursor: pointer;
      }
    }

    .pc-title {
      flex: 1;
      color: #bb1c2c;
      height: max-content;
      // margin-top: 178px;

      .zh-title {
        width: 100%;
        margin-bottom: 80px;
        font-size: 26px;
        text-align: center;
        font-weight: bold;
      }

      .en-title {
        width: 100%;
        margin-bottom: 48px;
        font-size: 18px;
        text-align: center;
      }

      .point-text {
        width: 100%;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
      }
    }

    .m-title {
      display: none;
    }
  }
  .forget {
    width: 100%;
    text-align: end;
    margin-top: -30px;
    margin-right: -10px;
    margin-bottom: 20px;
  }
}
@media screen and (max-width: 768px) {
  .login-container {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: #ffffff url('~@/assets/images/login/background.png') no-repeat
      top center;
    background-size: 100% 100%;

    .login-left {
      display: none;
      min-width: 240pt;
      margin: 0 auto;
      background: #ffffff url('~@/assets/images/login/leftbackground.png')
        no-repeat top center;
      background-size: 100% auto;
    }
    .login-wrap {
      width: 666pt;
      margin: 0 auto;
    }

    .login-form {
      width: 100%;
      margin: auto;
      transform: scale(0.8);
      .title-container {
        position: relative;
        width: 100%;
        margin: auto;
        .title1 {
          font-size: 30px;
          color: #262b40;
          margin: 0px auto 10px auto;
          text-align: center;
        }
        .title2 {
          font-size: 40px;
          color: #262b40;
          margin: 0px auto 40px auto;
          text-align: center;
        }
      }

      .msg-wrap > img {
        width: 34%;
        height: 50px;
        margin: 0 0 22px 10px;
      }
    }

    .m-title {
      position: absolute;
      top: 10%;
      right: 0;
      left: 0;
      width: 100%;
      margin: 0;
      display: block;
      color: #bb1c2c;
      font-size: 14px;
      text-align: center;
      font-weight: bold;
    }
  }
}
</style>
<style lang="scss">
.login-container .theme--light.v-input {
  margin-bottom: 14px;
}

.login-container .v-messages {
  color: #bb1c2c;
}

.login-container .v-messages > div > div {
  line-height: 14px;
}

@media screen and (max-width: 768px) {
  .login-container .theme--light.v-input {
    margin-bottom: 0;
  }
}
</style>
