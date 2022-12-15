<template>
  <div>
    <v-navigation-drawer
      id="drawer"
      class="hide_scroll deep left"
      mobile-breakpoint="960"
      :expand-on-hover="isMiniDrawer"
      app
      touchless
      bottom
      floating
      src="@/assets/images/login/leftbackground.png"
      v-model="isShowDrawer"
    >
      <v-list-item class="ma-6" :class="isMiniDrawer ? 'px-3' : 'px-5'">
        <!-- <v-list-item-avatar size="32" :rounded="true">
          <v-img src="../../assets/images/login/logo.png"></v-img>
        </v-list-item-avatar> -->

        <v-img src="../../assets/images/login/logo-big.png"></v-img>
        <!-- <v-list-item-title class="text-subtitle-1 font-weight-bold">
        </v-list-item-title> -->
      </v-list-item>
      <!-- rounded是否为圆角 -->
      <v-list
        nav
        class="my-0"
        :class="isMiniDrawer ? '' : 'mx-3'"
        :rounded="false"
      >
        <template v-for="(item, i) in routes">
          <v-list-item-group v-if="!item.children" :id="item.id" :key="i">
            <v-list-item class="nav-item" v-bind:to="item.path">
              <v-list-item-icon>
                <img
                  class="index-icon"
                  :src="require(`../../assets/images/${item.meta.icon}.png`)"
                  alt=""
                />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.meta.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
          <v-list-item-group
            v-else-if="item.children.length == 1"
            :id="item.id"
            :key="i"
            color="primary"
          >
            <v-list-item class="nav-item" v-bind:to="item.children[0].path">
              <v-list-item-icon>
                <v-icon size="26">{{ item.meta.icon }}</v-icon>
                <!-- <v-icon size="26">{{ item.children[0].meta.icon }}</v-icon> -->
                <!-- <img
                  class="index-icon"
                  :src="
                    require(`../../assets/images/${item.children[0].meta.icon}.png`)
                  "
                  alt=""
                /> -->
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title
                  v-text="item.children[0].meta.title"
                ></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
          <v-list-group
            v-else
            no-action
            :id="item.meta.id"
            :key="i"
            append-icon="mdi-menu-down"
            :value="item.meta.id == initMenuId"
          >
            <template v-slot:activator>
              <v-list-item class="nav-item ma-0 pa-0">
                <v-list-item-icon>
                  <v-icon size="26">{{ item.meta.icon }}</v-icon>
                  <!-- <img
                    class="index-icon"
                    :src="require(`../../assets/images/${item.meta.icon}.png`)"
                    alt=""
                  /> -->
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    v-text="item.meta.title"
                  ></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-list-item
              class="nav-item pl-5 chlidren"
              v-for="(item2, j) in item.children"
              :key="j"
              link
              :to="item2.path"
            >
              <v-list-item-icon>
                <span class="index-icon"></span>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item2.meta.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
// Components
import { Component, Vue } from 'vue-property-decorator'
import { PermissionModule } from '@/store/modules/permission'
import { AppModule, DeviceType } from '@/store/modules/app'
import { SettingsModule } from '@/store/modules/settings'
import router from '@/router'

@Component
export default class Drawer extends Vue {
  created() {
    this.initTabSelect()
  }

  get SettingsModule() {
    return SettingsModule
  }

  initMenuId: number = 0

  initTabSelect() {
    for (const route of this.routes) {
      if (!route.children) {
        continue
      }

      route.children.forEach((ele: any) => {
        if (
          router.currentRoute.path.indexOf(ele.path) > -1 &&
          route.meta &&
          route.meta.id
        ) {
          this.initMenuId = route.meta.id
        }
      })
    }
  }

  get routes() {
    return PermissionModule.menuRoutes
  }

  get sidebar() {
    return AppModule.sidebar
  }

  get AppModule() {
    return AppModule
  }

  get isMiniDrawer() {
    return !this.sidebar.opened && AppModule.device !== DeviceType.Mobile
  }

  get isShowDrawer() {
    return this.sidebar.opened || AppModule.device !== DeviceType.Mobile
  }

  set isShowDrawer(isShowDrawer: boolean) {
    this.sidebar.opened = isShowDrawer
  }
}
</script>
<style lang="scss">
@import '~@/assets/styles/global.scss';
$bgColor: #090724;
$activeColor: $primary;
.chlidren.v-list-item--active {
  background-color: $activeColor !important;
  color: #ffffff;
}
#drawer {
  // background: #ffffff url("~@/assets/images/login/leftbackground.png") center;
  .drawer_title_box {
    position: relative;
    padding-left: 13px;
  }
  .sidebar-title-icon {
    display: inline-block;
    width: 36px;
    height: 36px;
    margin-right: 10px;
    background: url('../../assets/images/icon_logo.png') no-repeat center;
    background-size: 100% 100%;
    vertical-align: middle;
    position: absolute;
    top: 6px;
    left: -12px;
  }
  .sidebar-title {
    color: #ffffff;
    font-size: 18px;
    padding-left: 20px;
    vertical-align: middle;
    font-weight: bold;
  }

  .theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
    color: transparent !important;
  }
  .v-list-item--active .theme--light.v-list-item {
    background-color: transparent !important;
  }
  .theme--light.v-list-item--active:hover::before,
  .theme--light.v-list-item--active::before {
    opacity: 0;
  }
  .v-ripper__container {
    background: none;
  }
  .v-list-item {
    margin-bottom: 0;
    padding: 0 4px;
    // overflow: hidden;
    &.v-item--active {
      background-color: $activeColor;
    }
    .v-list-item__title {
      color: #fff;
      font-size: 14px;
      font-weight: 500;
    }
  }
  .theme--light.v-list-item--active:hover::before,
  .theme--light.v-list-item--active::before {
    opacity: 0;
  }
}
#drawer.v-navigation-drawer--is-mobile {
  background: $bgColor;
}

#drawer .v-application--is-ltr .v-list-item__action:first-child,
.v-application--is-ltr .v-list-item__icon:first-child {
  margin-right: 10px;
}
#drawer
  .theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled)
  .index-icon {
  color: #a3a3a3 !important;
}
.index-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  position: relative;
}

#drawer .theme--light.v-icon {
  color: #fff;
}
</style>
<style lang="scss" scoped>
.backgroundNone {
  background: none !important;
}
@media screen and (max-width: 960px) {
  #drawer {
    .mscreen-none {
      display: none;
    }
  }
}

.v-navigation-drawer--bottom.v-navigation-drawer--is-mobile {
  max-height: 70vh;
}
</style>
