<template>
  <v-main class="pb-12 pb-md-0 bg-grey">
    <router-view class="px-0 px-md-3" @setTitle="setTitle"/>
  </v-main>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Footer from "./Footer.vue";

@Component({
  components: { Footer }
})
export default class RouteView extends Vue {
  setTitle(title: string) {
    this.$emit("setTitle", title)
  }
}
</script>
