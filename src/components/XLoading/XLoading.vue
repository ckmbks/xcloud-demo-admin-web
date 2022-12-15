<template>
  <v-dialog v-model="isShow" persistent width="150">
    <v-card dark>
      <v-card-text class="pa-0">
        <v-progress-linear indeterminate height="50" color="primary">
          <strong class="message">{{ message }}</strong>
        </v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator'

@Component({})
export default class XLoading extends Vue {
  @PropSync('syncIsShow', { default: false })
  isShow?: boolean

  @Prop()
  message!: string
}
</script>
<style lang="scss" scoped>
@import '~@/assets/styles/global.scss';

.message {
  //color: $primary;
}
</style>
