<template>
  <v-snackbar
    :color="color"
    v-model="isShow"
    :timeout="config.timeout"
    class="pt-6"
    top
  >
    <v-icon large small>{{icon}}</v-icon>
    {{ config.message }}
    <template v-slot:action="{ attrs }">
      <v-btn
        text
        v-bind="attrs"
        @click="close"
      >
        关闭
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from "vue-property-decorator";
import SnackbarConfig, { SnackbarType } from "@/components/Message/SnackbarConfig";

@Component({})
export default class XSnackbar extends Vue {

  @PropSync("syncIsShow", { default: false })
  isShow?: boolean

  @Prop()
  config!: SnackbarConfig;

  get icon(){
    switch (this.config.type){
      case SnackbarType.INFO:
        return "mdi-check-circle"
      case SnackbarType.WARN:
        return "mdi-alert-circle"
      case SnackbarType.ERROR:
        return "mdi-close-circle"
    }
  }

  get color(){
    switch (this.config.type){
      case SnackbarType.INFO:
        return "primary"
      case SnackbarType.WARN:
        return "orange darken-2"
      case SnackbarType.ERROR:
        return "red darken-2"
    }
  }

  close() {
    this.isShow = false
  }
};
</script>
