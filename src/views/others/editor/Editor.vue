<template>
  <v-card flat class="ma-6">
    <x-editor class="px-4 py-6" v-model="content"></x-editor>
  </v-card>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
@Component({
})
export default class Editor extends Vue {
  content: string = ""
}
</script>
<style lang="scss">
@import "@/assets/styles/global.scss";

</style>
