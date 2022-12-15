<template>
  <v-fab-transition>
    <v-btn
      v-show="isShow"
      @click.stop="scrollToTop"
      color="primary"
      fab
      bottom
      right
      fixed
      dark
      small
      style="bottom: 70px; right: 3px"
    >
      <v-icon>mdi-chevron-up</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class FloatButton extends Vue {
  scrollToTop() {
    this.$vuetify.goTo(0)
  }

  isShow = false

  public onScroll(e: any) {
    this.isShow =
      (e.target.documentElement.scrollTop || document.body.scrollTop) > 400
        ? true
        : false
  }
}
</script>
