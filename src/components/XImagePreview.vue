<template>
  <x-dialog
    ref="dialog"
    :sync-is-show.sync="isShow"
    :width="1200"
    title="图片预览"
    confirmText="关闭"
    :alert="true"
    @submit="submit"
  >
    <div class="pa-4">
      <img class="img" :src="src" alt="" />
    </div>
  </x-dialog>
</template>
<script lang="ts">
import { Component, PropSync, Prop, Vue } from 'vue-property-decorator'
import XDialog from '@/components/XDialog.vue'

@Component({
  components: { XDialog }
})
export default class XImagePreview extends Vue {
  @PropSync('syncIsShow')
  isShow!: boolean

  @Prop({ default: '' })
  src!: string

  $refs!: {
    dialog: XDialog
    form: HTMLFormElement
  }

  async mounted() {}

  async submit() {
    this.$refs.dialog.hide()
  }
}
</script>
<style lang="scss" scoped>
.img {
  width: 100%;
}
</style>
