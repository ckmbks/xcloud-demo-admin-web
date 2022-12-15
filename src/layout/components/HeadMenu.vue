<template>
  <v-app-bar
    id="app-bar"
    app
    elevate-on-scroll
    color="white"
    clipped-right
    v-if="isShowHeadMenu"
    :dense="AppModule.device == 0"
    :style="AppModule.device == 0 ? 'box-shadow: 0 0 1px 0 gray;' : ''"
  >
    <div class="d-flex align-center" v-if="SettingsModule.isDrawerMode">
      <v-icon
        class="font-weight list_icon"
        @click.stop="toggleIsShowDrawer()"
        v-if="AppModule.device == 1 && !AppModule.sidebar.opened"
      >mdi-format-indent-increase
      </v-icon>
      <v-icon
        class="font-weight list_icon"
        @click.stop="toggleIsShowDrawer()"
        v-if="AppModule.device == 1 && AppModule.sidebar.opened"
      >mdi-format-indent-decrease
      </v-icon>
      <v-btn v-if="getIsGoback()" icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span
        :class="
          AppModule.device == 0
            ? 'pl-4 xchs_p1 xchs_weight font-weight-bold'
            : 'pl-3 xchs_p1 xchs_weight'
        "
      >{{ pageTitle }}</span
      >
    </div>
    <v-spacer></v-spacer>
    <v-tabs
      v-if="!SettingsModule.isDrawerMode"
      icons-and-text
      optional
      centered
      class="d-none d-md-block"
      active-class="active"
    >
      <v-tabs-slider class="d-none"></v-tabs-slider>
      <template v-for="(item, i) in routes">
        <!-- <div > -->
        <v-tab
          v-if="!item.children"
          :id="item.id"
          :key="i"
          v-bind:to="item.path"
        >
          <span>{{ item.meta.title }}</span>
          <!-- <v-icon>{{item.meta.icon}}</v-icon> -->
        </v-tab>
        <v-tab
          v-else-if="item.children.length == 1"
          :id="item.id"
          :key="i"
          v-bind:to="item.children[0].path"
        >
          <span>{{ item.children[0].meta.title }}</span>
          <!-- <v-icon>{{item.children[0].meta.icon}}</v-icon> -->
        </v-tab>
        <v-menu
          v-else
          :id="item.id"
          :key="i"
          open-on-hover
          offset-y
          allow-overflow
        >
          <template v-slot:activator="{ on }">
            <v-tab v-on="on" :id="item.id">
              <span>{{ item.meta.title }}</span>
              <!-- <v-icon>{{item.meta.icon}}</v-icon> -->
            </v-tab>
          </template>

          <v-list>
            <v-list-item
              v-for="(item2, j) in item.children"
              :key="j"
              link
              :to="item2.path"
            >
              <v-list-item-title to="item.path">
                <!-- <v-icon>{{item2.meta.icon}}</v-icon> -->
                {{ item2.meta.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <!-- </div> -->
      </template>
    </v-tabs>
    <!-- 消息 -->
    <!--    <head-message></head-message>-->

    <v-menu
      v-if="AppModule.device == 1"
      bottom
      left
      offset-y
      open-on-hover
      origin="top right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ on, value }">
        <v-btn class="ml-2" min-width="0" text v-on="on">
          <v-icon>mdi-account</v-icon>
          <span class="d-none d-md-block">{{ user.name }}</span>
          <v-icon v-if="value" class="ml-2">mdi-menu-up</v-icon>
          <v-icon v-else class="ml-2">mdi-menu-down</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="showResetPassword">
          <v-icon>mdi-lock-reset</v-icon>
          <v-list-item-title class="pl-2">修改密码</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout">
          <v-icon>mdi-logout</v-icon>
          <v-list-item-title class="pl-2">退出</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <!-- 重置密码 -->
    <reset-password
      v-if="isShowResetPassword"
      :is-show-reset-password.sync="isShowResetPassword"
    ></reset-password>
  </v-app-bar>
</template>

<script lang="ts">
// Components
import { Component, Prop, Vue } from 'vue-property-decorator'
import { PermissionModule } from '@/store/modules/permission'
import { UserModule } from '@/store/modules/user'
import { SettingsModule } from '@/store/modules/settings'
import { AppModule } from '@/store/modules/app'
import ResetPassword from './ResetPassword.vue'
import HeadMessage from '@/layout/components/HeadMessage.vue'

@Component({
  components: {
    HeadMessage,
    ResetPassword
  }
})
export default class HeadMenu extends Vue {
  @Prop({ default: '' }) pageTitle?: string

  get routes() {
    return PermissionModule.menuRoutes
  }

  get user() {
    return UserModule
  }

  get isShowHeadMenu() {
    return AppModule.device !== 0 || (this.$route.meta && !this.$route.meta.isHiddenHeadMenuIfMobile)
  }

  get AppModule() {
    return AppModule
  }

  get SettingsModule() {
    return SettingsModule
  }

  toggleIsShowDrawer() {
    AppModule.ToggleSideBar()
  }

  async logout() {
    await UserModule.LogOut()
  }

  isShowResetPassword = false

  created() {
  }

  getIsGoback() {
    if (this.$route.meta && this.$route.meta.hidden) return true

    return false
  }

  showResetPassword() {
    this.isShowResetPassword = true
  }
}
</script>
<style lang="scss" scoped>
.fixed-l {
  position: absolute;
  left: 0;
}

.fixed-r {
  position: absolute;
  right: 0;
}

.list_icon {
  padding: 4px;
}

.active {
  border-bottom: 2px solid #fff;
}

.msg-item {
  width: 300px;
  // padding-left: 20px;
}

.msg-item .title {
  flex: 1;
  font-size: 14px !important;
}

.msg-item .time {
  padding-right: 20px;
}

.elipsis {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.read::before {
  content: '·';
  color: blue;
  font-size: 40px;
}

.v-list-item-group {
  height: 200px;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.v-list-item-group::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>
<style lang="scss">
.v-toolbar__content .badge .v-badge__badge::after {
  border-color: #ffffff !important;
  border-width: 1px;
}
</style>
