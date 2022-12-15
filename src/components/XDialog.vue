<template>
  <v-dialog
    persistent
    scrollable
    v-bind="$attrs"
    v-model="isShow"
    :width="width"
    :retain-focus="false"
    class="dialogInputColor"
    ><div>
      <v-row
        v-if="loading"
        class="pl-4 py-2 bg-w d-flex justify-space-between align-center"
      >
        <div>
          <v-skeleton-loader :loading="loading" type="chip"></v-skeleton-loader>
        </div>

        <v-icon color="#bbb" class="icon mr-2" @click="hide">close</v-icon>
      </v-row>
      <v-skeleton-loader :loading="loading" type="article, actions">
        <v-card class="dialogInputColor">
          <v-card-title class="text-left pb-0 pt-1 primary">
            <div v-if="title" class="xd_title fs-16">
              <span style="color: #fff" class="font-weight-bold">{{
                title
              }}</span>
            </div>
            <v-row class="pl-4 py-2 d-flex justify-end">
              <slot name="title-right">
                <v-icon color="#fff" class="icon" @click="hide">close</v-icon>
              </slot>
            </v-row>
          </v-card-title>
          <v-divider v-if="!hideDivider" />
          <v-card-text class="detail-wrap" :style="'max-height:' + maxHeight">
            <slot></slot>
          </v-card-text>
          <v-divider v-if="!hideDivider" />
          <v-card-actions>
            <v-spacer />
            <template v-if="$scopedSlots.ctrl">
              <slot name="ctrl"></slot>
            </template>
            <template v-else>
              <v-btn
                v-if="!alert"
                depressed
                color="primary"
                outlined
                @click="cancel"
                >{{ cancelText }}
              </v-btn>
              <v-btn
                v-if="isSubmitBtn"
                depressed
                color="primary"
                @click="submit"
                >{{ confirmText }}
              </v-btn>
            </template>
          </v-card-actions>
        </v-card>
      </v-skeleton-loader>
    </div>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator'

@Component({ name: 'XDialog' })
export default class XDialog extends Vue {
  @Prop({ default: false })
  loading?: boolean

  @Prop({ default: false })
  fixed?: boolean

  @Prop({ default: false })
  hideDivider?: boolean

  @Prop({ default: '' })
  title?: string

  @Prop({ default: '确定' })
  confirmText?: string

  @Prop({ default: '取消' })
  cancelText?: string

  @Prop({ default: true })
  isSubmitBtn?: boolean

  @Prop({ default: 1000 })
  width?: number

  @Prop({ default: 'calc(90vh - 94px)' })
  maxHeight?: string

  @Prop({ default: false })
  alert?: boolean

  @PropSync('syncIsShow', { default: true })
  isShow?: boolean

  show() {
    // this.$emit('update:isShow', true)
    this.isShow = true
  }

  hide() {
    this.$emit('hide')
    // this.$emit('update:isShow', false)
    this.isShow = false
  }

  cancel() {
    this.$emit('cancel')
    if (this.$listeners.cancel && typeof this.$listeners.cancel === 'function')
      return
    this.hide()
  }

  submit() {
    this.$emit('submit')
  }
}
</script>
<style lang="scss">
.xd_title_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}

.detail-wrap {
  overflow-y: auto;
}

.dialogInputColor {
  overflow-y: hidden;
  max-height: 90vh;
}

.v-card__subtitle, .v-card__text {
  font-size: 1rem;
}
</style>
