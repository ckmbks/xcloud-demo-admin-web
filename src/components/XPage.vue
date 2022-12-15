<template>
  <div class="xchs_page xchs_normal px-3 px-md-4 px-sm-4">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component
export default class XPage extends Vue {
  @Prop({ default: null })
  title?: string

  getTitle() {
    if (this.title || this.title === '') return this.title
    if (this.$route.meta && this.$route.meta.title)
      return this.$route.meta.title
    return ''
  }
}
</script>
<style lang="scss">
@import '~@/assets/styles/global.scss';

.xchs_page {
  display: block;
  width: 100%;
  height: 100%;
  background: #fff;
}

.xchs_page {
  box-sizing: border-box;
  .ctrl_box {
    min-height: 60px;
    line-height: 60px;
    display: flex;
    justify-content: space-between;
    > .right {
      button {
        margin-left: 10px;
      }
    }
    button {
      position: relative;
    }
  }
}

.xchs_normal {
  color: $text_normal;

  &.xchs_border {
    text-shadow: 0.3px 0px 0px $text_normal;
  }
}
</style>
