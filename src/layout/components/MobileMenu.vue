<template>
  <v-bottom-navigation :value="activeBtn" grow color="primary" fixed class="d-md-none">
    <template v-if="SettingsModule.isDrawerMode">
      <v-btn to="/">
        <span>首页</span>
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn  @click.stop="toggleIsShowDrawer()">
        <span>菜单</span>
        <v-icon>mdi-menu</v-icon>
      </v-btn>
<!--      <v-btn to="/message/MyMessageList">-->
<!--        <span>消息</span>-->
<!--        <v-icon>mdi-bell</v-icon>-->
<!--      </v-btn>-->
      <v-btn to="/user/MyAccount">
        <span>我的</span>
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </template>
    <template v-else v-for="(item,i) in routes">
      <v-btn v-if="!item.children" :key="i" v-bind:to="item.path">
        <span>{{item.meta.title}}</span>
        <v-icon>{{item.meta.icon}}</v-icon>
      </v-btn>
      <v-btn v-else-if="item.children.length==1" :key="i" v-bind:to="item.children[0].path">
        <span>{{item.children[0].meta.title}}</span>
        <v-icon>{{item.children[0].meta.icon}}</v-icon>
      </v-btn>
      <v-menu v-else :key="i" bottom top offset-y>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on">
            <span>{{item.meta.title}}</span>
            <v-icon>{{item.meta.icon}}</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item2, j) in item.children" :key="j" link :to="item2.path" @click>
            <v-list-item-title>
              <v-icon>{{item2.meta.icon}}</v-icon>
              {{ item2.meta.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-bottom-navigation>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { PermissionModule } from "@/store/modules/permission";
import { SettingsModule } from "@/store/modules/settings";
import { AppModule } from "@/store/modules/app";

@Component({
  components: {}
})
export default class MobileMenu extends Vue {
  activeBtn: number = 0;

  get routes() {
    return PermissionModule.menuRoutes
  }
  get SettingsModule() {
    return SettingsModule;
  }

  toggleIsShowDrawer() {
    AppModule.ToggleSideBar();
  }
}
</script>
