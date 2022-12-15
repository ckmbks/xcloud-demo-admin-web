<template>
  <v-sheet class="d-flex">
    <v-sheet outlined v-if="!$vuetify.breakpoint.xs" :width="leftWidth" class="mr-3">
      <slot name="left-panel"/>
    </v-sheet>
    <v-bottom-sheet v-model="showBottom">
      <template v-slot:activator="{ on, attrs }">
      </template>
      <v-sheet height="70vh" style="overflow-y: scroll">
        <slot name="left-panel"/>
      </v-sheet>
    </v-bottom-sheet>
    <v-sheet :width="rightWidth">
      <slot name="right-panel"/>
    </v-sheet>
    <v-fab-transition>
      <v-btn
        fab
        bottom
        right
        fixed
        dark
        small
        style="bottom: 125px; right: 3px"
        v-if="$vuetify.breakpoint.xs" color="primary" class="ml-3" depressed @click="showBottom = true">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-sheet>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class XLeftRightPage extends Vue {
  @PropSync("syncShowBottom", { default: false })
  showBottom!: boolean

  @Prop({ default: '20vw' })
  leftWidth!: string

  @Prop({ default: '100vw' })
  rightWidth!: string

  @Prop({ default: '70vw' })
  bottomHeight!: string
}
</script>
<style scoped>
</style>
