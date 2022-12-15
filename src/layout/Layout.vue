<template>
  <v-app v-scroll="onScroll" class="bg-grey">
    <headMenu :pageTitle="pageTitle"/>
    <drawer v-if="SettingsModule.isDrawerMode"/>
    <routeView id="routeView" @setTitle="setTitle"/>
    <mobileMenu/>
    <float-button ref="floatButton"/>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import HeadMenu from "./components/HeadMenu.vue";
import RouteView from "./components/RouteView.vue";
import MobileMenu from "./components/MobileMenu.vue";
import Drawer from "./components/Drawer.vue";
import { SettingsModule } from "@/store/modules/settings";
import ResizeMixin from './mixin/resize'
import FloatButton from "@/layout/components/FloatButton.vue";

@Component({
  components: {
    FloatButton,
    HeadMenu,
    RouteView,
    MobileMenu,
    Drawer,
  },
  mixins: [ResizeMixin]
})
export default class Layout extends Vue {
  pageTitle: string = this.$route.meta && this.$route.meta.title || ""

  get SettingsModule() {
    return SettingsModule;
  }

  public $refs: any;


  @Watch("$route")
  changeRoute(newVal: any) {
    this.pageTitle = this.$route.meta && this.$route.meta.title || ""
  }

  setTitle(title: string) {
    this.pageTitle = title
  }

  onScroll(e: any) {
    this.$refs.floatButton.onScroll(e)
  }
}
</script>
